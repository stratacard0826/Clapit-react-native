import { combineReducers } from 'redux';
import { routerReducer, LOCATION_CHANGE } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import { pagination } from 'violet-paginator';
import multireducer from 'multireducer';

import auth from './modules/auth';
import counter from './modules/counter';
import {reducer as form} from 'redux-form';
import info from './modules/info';
import widgets from './modules/widgets';

import { autoRehydrated } from './reducers/persist';
import { clapitAccountData, facebookLoggingIn, loggingIn, apiError, clapitDeviceToken } from './reducers/clapit';
import { facebookAuthData } from './reducers/facebook';
import { emailAuthData, emailLoginError } from './reducers/emailAuth';
import { twitterAuthData } from './reducers/twitter';
import { instagramAuthData } from './reducers/instagram';
import { homeReducer } from './reducers/homeUI';
import { feed } from './reducers/feed';
import { profiles, recentPosts, popularPosts } from './reducers/profiles';
import { post } from './reducers/post';
import { reactions } from './reducers/reactions';
import { friends } from './reducers/friends';
import { notifications, newNotifications } from './reducers/notifications';
import { tags } from './reducers/tags';
import { network } from './reducers/network';
import { claps } from './reducers/claps';
import { friendship } from './reducers/friendship';
import { settings } from './reducers/settings';
import { fileUpload } from './reducers/fileUpload';
import { preferences } from './reducers/preferences';

//import globalReducer from 'containers/App/reducer';
//import languageProviderReducer from 'containers/LanguageProvider/reducer';
import _ from 'lodash';

const routeInitialState = {
  locationBeforeTransitions: null,
};

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action = {}) {
  let newCHANGE;
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      newCHANGE = _.merge({
        locationBeforeTransitions: action.payload,
      });
      // return state.merge({
      //  locationBeforeTransitions: action.payload,
      // });
      return newCHANGE;
    default:
      return state;
  }
}

export default combineReducers({
  routing: routerReducer,
  //routing: routeReducer,
  reduxAsyncConnect,
  auth,
  form,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  info,
  pagination,
  widgets,
  autoRehydrated,
  loggingIn,
  clapitAccountData,
  clapitDeviceToken,
  facebookLoggingIn,
  apiError,
  facebookAuthData,
  emailAuthData,
  emailLoginError,
  twitterAuthData,
  instagramAuthData,
  feed,
  profiles,
  recentPosts,
  popularPosts,
  post,
  reactions,
  friends,
  notifications,
  newNotifications,
  tags,
  network,
  claps,
  friendship,
  settings,
  fileUpload,
  preferences,
  homeUI: homeReducer,
  //global: globalReducer,
  //language: languageProviderReducer,
});
