/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  AUTH_USER,
  AUTH_USER_SUCCESS,
  AUTH_USER_ERROR,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
//const initialState = fromJS({
//  loading: false,
//  error: false,
//  authData: null,
//  currentUser: false,
//  userData: {
//    repositories: false,
//  },
//});

const initialState = {
  loading: false,
  error: false,
  authData: null,
  currentUser: false,
  userData: {
    repositories: false,
  },
};

function appReducer(state = initialState, action = {}) {
  let userData = {};
  switch (action.type) {
    case AUTH_USER:
      // return state
      //    .set('loading', true)
      //    .set('error', false)
      //    .set('authData', null);
      return { ...state, loading: true, error: false, authData: null };
    case AUTH_USER_SUCCESS:
      // return state
      //    .set('loading', false)
      //    .set('authData', action.authData);
      return { ...state, loading: false, authData: action.authData };
    case AUTH_USER_ERROR:
      // return state
      //    .set('error', action.error)
      //    .set('loading', false);
      return { ...state, error: action.error, loading: false };
    case LOAD_REPOS:
      // return state
      //  .set('loading', true)
      //  .set('error', false)
      //  .setIn(['userData', 'repositories'], false);
      userData = {
        repositories: false,
      };
      return { ...state, loading: true, error: false, userData };
    case LOAD_REPOS_SUCCESS:
      // return state
      //  .setIn(['userData', 'repositories'], action.repos)
      //  .set('loading', false)
      //  .set('currentUser', action.username);
      userData = {
        repositories: action.repos,
      };
      return { ...state, loading: false, currentUser: action.username, userData };
    case LOAD_REPOS_ERROR:
      // return state
      //  .set('error', action.error)
      //  .set('loading', false);

    default:
      return state;
  }
}

export default appReducer;
