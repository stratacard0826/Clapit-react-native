import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import fetch from 'node-fetch';
import _ from 'lodash';
import bodyParser from 'body-parser';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// react-tap-event
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

function parseResponseParameters(response) {
  if (response.split) {
    const parameters = response.split('&');
    const parameterMap = {};
    for (let i = 0; i < parameters.length; i += 1) {
      parameterMap[parameters[i].split('=')[0]] = parameters[i].split('=')[1];
    }
    return parameterMap;
  }
  return {};
}

app.use(bodyParser.json({ limit: '50mb' }));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '50mb',
}));
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.post('/twitter/request_token', (req, res) => { // eslint-disable-line arrow-body-style
  const { signature_header } = req.body;
  const fetchParams = _.assign({}, {
    method: 'POST',
    headers: {
      'Authorization': signature_header, // eslint-disable-line quote-props
    },
  });
  return fetch('https://api.twitter.com/oauth/request_token', fetchParams)
    .then((response) => {
      const { status } = response;
      if (status >= 400) {
        return { error: { status } };
      }
      return response.text();
    }).then((result) => res.json(parseResponseParameters(result)))
    .catch((err) => res.json(err));
});

app.post('/twitter/access_token', (req, res) => { // eslint-disable-line arrow-body-style
  const { signature_header } = req.body;
  const fetchParams = _.assign({}, {
    method: 'POST',
    headers: {
      'Authorization': signature_header, // eslint-disable-line quote-props
    },
  });
  return fetch('https://api.twitter.com/oauth/access_token', fetchParams)
    .then((response) => {
      const { status } = response;
      if (status >= 400) {
        return { error: { status } };
      }
      return response.text();
    }).then((result) => res.json(parseResponseParameters(result)))
    .catch((err) => res.json(err));
});

app.post('/twitter/verifyCredentials', (req, res) => { // eslint-disable-line arrow-body-style
  const { signature_header } = req.body;
  const fetchParams = _.assign({}, {
    method: 'GET',
    headers: {
      'Authorization': signature_header, // eslint-disable-line quote-props
    },
  });
  return fetch('https://api.twitter.com/1.1/account/verify_credentials.json', fetchParams)
    .then((response) => {
      const { status } = response;
      if (status >= 400) {
        return { error: { status } };
      }
      return response.text();
    }).then((result) => res.json(result))
    .catch((err) => res.json(err));
});


app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const muiTheme = getMuiTheme({
          palette: {
            primary1Color: '#b385ff',
            accent1Color: '#fff',
          },
          tabs: {
            // backgroundColor: '#b385ff',
          },
          userAgent: req.headers['user-agent']
        });
        const component = (
          <MuiThemeProvider muiTheme={muiTheme} >
            <Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          </MuiThemeProvider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
