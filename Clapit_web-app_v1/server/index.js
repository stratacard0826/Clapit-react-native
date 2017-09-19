/* eslint consistent-return:0 */

//import React from 'react';
//import ReactDOMServer from 'react-dom/server';
//import App from '../app/components/ProfileItem/1';

// const express = require('express');
import express from 'express';
// const session = require('express-session');
const logger = require('./logger');
const fetch = require('node-fetch');
const _ = require('lodash');
const bodyParser = require('body-parser');
// const localStorage = require('localStorage');
// const Storage = require('dom-storage');
// const sessionStorage = new Storage(null, { strict: true });
// const localStorage = new Storage('./db.json', { strict: false, ws: '  ' })

// const Flutter = require('flutter');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

// const twitterConsumerKey = '7BNH1Zdl9hbzQR6hyKytQvPU8';
// const twitterConsumerSecret = 'DWJdEokfqj2jZXNPNK1QsVdxJfbTFHao0hjwvVMyYCX1oDYma5';

/*
const flutter = new Flutter({
  consumerKey: twitterConsumerKey,
  consumerSecret: twitterConsumerSecret,
  loginCallback: 'http://localhost:3000/twitter/callback',
  authCallback: (req, res) => {
    if (req.error) {
      // Authentication failed, req.error contains details
      return false;
    }
    // const accessToken = req.session.oauthAccessToken;
    // const secret = req.session.oauthAccessTokenSecret;
    const pThis = req.session;
    pThis.twitterData = req.results;
    pThis.type = 'twitter';
    console.log('~~~~~~', pThis);
    // Store away oauth credentials here
    // Redirect user back to your app
    // res.redirect('/');
    res.send(pThis);
  },
});*/

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
// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.use(bodyParser.json({ limit: '50mb' }));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '50mb',
}));
/* app.use(session({ secret: '123456' }));

app.get('/twitter/connect', flutter.connect);
app.get('/twitter/callback', flutter.auth);
app.get('/twitter/logout', flutter.logout);
app.get('/twitter/session', (req, res) => { // eslint-disable-line arrow-body-style
  res.setHeader('Content-Type', 'application/json');
  // res.send(JSON.stringify(req.session, null, 3));
  return res.json(req.results);
}); */

// function handleRender(req, res) { /* ... */ }
// function renderFullPage(html, preloadedState) { /* ... */ }
//
// app.use(handleRender);

 //app.get('*', (request, response) => {
 //  var html = ReactDOMServer.renderToString(
 //    React.createElement(App)
 //  );
 //  response.send(html);
 //});

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

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended port number, use port 3000 if not provided
const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, url);
    });
  } else {
    logger.appStarted(port);
  }
});
