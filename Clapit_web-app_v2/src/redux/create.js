import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import localForage from 'localforage';
import createMiddleware from './middleware/clientMiddleware';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

const sagaMiddleware = createSagaMiddleware();

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [createMiddleware(client), reduxRouterMiddleware, thunk, createLogger(), sagaMiddleware,];

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');
    finalCreateStore = compose(
      autoRehydrate(),
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = compose(autoRehydrate(), applyMiddleware(...middleware))(_createStore);
  }

  //const reducer = require('./modules/reducer');
  const reducer = require('./reducer');
  if (data) {
    // data.pagination = Immutable.fromJS(data.pagination);
    // data.pagination = data.pagination;
  }
  const store = finalCreateStore(reducer, data);
  persistStore(store, {
    storage: localForage,
    whitelist: ['clapitAccountData', 'facebookAuthData', 'twitterAuthData', 'instagramAuthData', 'newNotifications', 'preferences'],
  }).purge(['feed', 'notifications', 'network']);
  // Extensions
  store.runSaga = sagaMiddleware.run;

  if (__DEVELOPMENT__ && module.hot) {
    //module.hot.accept('./modules/reducer', () => {
    //  store.replaceReducer(require('./modules/reducer'));
    //});
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'));
    });
  }

  return store;
}
