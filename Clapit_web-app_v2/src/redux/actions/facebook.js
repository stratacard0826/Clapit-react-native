import {
  ASSIGN_FACEBOOK_AUTH_DATA,
  FACEBOOK_LOGOUT,
  FACEBOOK_LOGOUT_SUCCESS,
  FACEBOOK_LOGOUT_ERROR,
  FACEBOOK_LOGIN_START,
  FACEBOOK_LOGIN_CANCEL,
} from '../constants/ActionTypes';

import { doFetch } from './api';
import { clapitLoginOrConnect } from './clapit';
// import _ from 'lodash';


export function fbLogin(data) {
  return (dispatch) => {
    // console.log('response -->', data);
    dispatch(facebookLoginStart());
    if (data.status !== 'unknown') {
      // getCurrentAccessToken
      dispatch(assignFacebookAuthData(data));
      dispatch(clapitLoginOrConnect('facebook', data.accessToken));
    } else {
      dispatch(facebookLoginCancel());
    }
    console.log('FBLOGIN: ', data);
  };
}

export function fbLogout() {
  return (dispatch) => {
    dispatch(startFacebookLogout());

    return doFetch('Accounts/disconnect/facebook', {
      method: 'POST',
    }).then((data) => {
      dispatch(facebookLogoutSuccess(data));
    }).catch((err) => {
      dispatch(facebookLogoutError(err));
    });
  };
}

function startFacebookLogout() {
  return {
    type: FACEBOOK_LOGOUT,
  };
}

function facebookLogoutSuccess(accountData) {
  return {
    type: FACEBOOK_LOGOUT_SUCCESS,
    payload: {
      accountData,
    },
  };
}

function facebookLogoutError(error) {
  return {
    type: FACEBOOK_LOGOUT_ERROR,
    payload: {
      error,
    },
  };
}

function assignFacebookAuthData(token) {
  return {
    type: ASSIGN_FACEBOOK_AUTH_DATA,
    payload: token,
  };
}

function facebookLoginStart() {
  return {
    type: FACEBOOK_LOGIN_START,
  };
}

function facebookLoginCancel() {
  return {
    type: FACEBOOK_LOGIN_CANCEL,
  };
}
