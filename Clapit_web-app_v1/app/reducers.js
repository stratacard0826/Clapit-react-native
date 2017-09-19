/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

// import { fromJS } from 'immutable';
// import { combineReducers } from 'redux-immutable';
import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';

import { autoRehydrated } from 'redux/reducers/persist';
import { clapitAccountData, facebookLoggingIn, loggingIn, apiError, clapitDeviceToken } from 'redux/reducers/clapit';
import { facebookAuthData } from 'redux/reducers/facebook';
import { emailAuthData, emailLoginError } from 'redux/reducers/emailAuth';
import { twitterAuthData } from 'redux/reducers/twitter';
import { instagramAuthData } from 'redux/reducers/instagram';
import { feed } from 'redux/reducers/feed';
import { profiles, recentPosts, popularPosts } from 'redux/reducers/profiles';
import { post } from 'redux/reducers/post';
import { reactions } from 'redux/reducers/reactions';
import { friends } from 'redux/reducers/friends';
import { notifications, newNotifications } from 'redux/reducers/notifications';
import { tags } from 'redux/reducers/tags';
import { network } from 'redux/reducers/network';
import { claps } from 'redux/reducers/claps';
import { friendship } from 'redux/reducers/friendship';
import { settings } from 'redux/reducers/settings';
import { fileUpload } from 'redux/reducers/fileUpload';
import { preferences } from 'redux/reducers/preferences';

import globalReducer from 'containers/App/reducer';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import _ from 'lodash';
/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
// const routeInitialState = fromJS({
//  locationBeforeTransitions: null,
// });

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

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
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
    route: routeReducer,
    global: globalReducer,
    language: languageProviderReducer,
    ...asyncReducers,
  });
}
