/*
 * HomeReducer
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
  CHANGE_AUTHTYPE,
  CHANGE_TABINDEX,
} from '../constants/ActionTypes';
// import { fromJS } from 'immutable';

// The initial state of the App
// const initialState = fromJS({
//  username: '',
//  authType: 'signup',
//  slideIndex: 0,
// });

const initialState = {
  username: '',
  authType: 'signup',
  slideIndex: 0,
};
export function homeReducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_AUTHTYPE:
      // return state
      //    .set('authType', action.authType);
      return { ...state, authType: action.authType };
    case CHANGE_TABINDEX:
      // return state
      //    .set('slideIndex', action.slideIndex);
      return { ...state, slideIndex: action.slideIndex };
    default:
      return state;
  }
}
