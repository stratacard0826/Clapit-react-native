/* eslint no-unused-vars:0 */
import { doFetch, assignAccessToken } from './api';
import {
  ASSIGN_DEVICE_TOKEN,
  ASSIGN_CLAPIT_ACCOUNT_DATA,
  LOGOUT,
  LOGGING_IN,
  API_ERROR,
  CLEAR_API_ERROR,
} from '../constants/ActionTypes';
import _ from 'lodash';

export function clapitLoginOrConnect(socialNetwork, authData) {
  return (dispatch, getState) => {
    let loginCallback;
    let connectCallback;
    switch (socialNetwork) {
      case 'facebook':
        loginCallback = loginWithFacebook;
        connectCallback = connectWithFacebook;
        break;
      case 'twitter':
        loginCallback = loginWithTwitter;
        connectCallback = connectWithTwitter;
        break;
      case 'instagram':
        loginCallback = loginWithInstagram;
        connectCallback = connectWithInstagram;
        break;
      case 'email':
        loginCallback = loginWithEmail;
        connectCallback = connectWithEmail;
        break;
      default:
    }
    const { clapitAccountData } = getState();
    if (_.isEmpty(clapitAccountData) || !clapitAccountData.accessToken) {
      // login
      dispatch(startLogin());
      return dispatch(loginCallback(authData));
    }
    // connect
    return dispatch(connectCallback(authData));
  };
}

export function verifyDeviceToken() {
  return (dispatch, getState) => {
    const {
      clapitAccountData: { username, id, deviceToken: apiDeviceToken },
      clapitDeviceToken: { deviceToken },
      } = getState();
      // console.log('start update token', username, id, deviceToken);
    if (username && id && deviceToken && deviceToken !== apiDeviceToken) {
      // console.log('updated token', username, id, deviceToken);
      // return clapitSaveProfile()(dispatch, getState);
    }
    return {
      type: 'DEVICE_TOKEN_UPDATE_NOT_READY',
    };
  };
}

export function clapitSaveProfile(username = null, description = null, mediaId = null,
                                  fullName = null, school = null, website = null,
                                  coverMediaId = null, deviceToken = null, callback = null) {
  return (dispatch, getState) => {
    const { clapitAccountData, clapitDeviceToken } = getState();
    // let { deviceToken, username, fullName, description, school, website } = getState();
    const { id: userId } = clapitAccountData;
    if (!mediaId) {
      const { mediaId } = clapitAccountData; // eslint-disable-line no-shadow
    }
    if (!coverMediaId) {
      const { coverMediaId } = clapitAccountData; // eslint-disable-line no-shadow
    }
    if (!deviceToken) {
      deviceToken = clapitDeviceToken.deviceToken || clapitAccountData.deviceToken; // eslint-disable-line no-param-reassign
    }
    if (!username) {
      username = clapitAccountData.username; // eslint-disable-line no-param-reassign
    }
    if (fullName === undefined || fullName === null) {
      fullName = clapitAccountData.fullName; // eslint-disable-line no-param-reassign
    }
    if (description === undefined || description === null) {
      description = clapitAccountData.description; // eslint-disable-line no-param-reassign
    }
    if (school === undefined || school === null) {
      school = clapitAccountData.school; // eslint-disable-line no-param-reassign
    }
    if (website === undefined || website === null) {
      website = clapitAccountData.website; // eslint-disable-line no-param-reassign
    }
    // update first before the api returns
    const newData = _.assign({}, clapitAccountData);
    newData.deviceToken = deviceToken;
    dispatch(assignClapitAccountData(newData));
    return doFetch(`Accounts/${userId}`, {
      method: 'PATCH',
      body: {
        username,
        description,
        mediaId,
        fullName,
        school,
        website,
        coverMediaId,
        deviceToken,
      },
    }).then((data) => {
      if (data.error) {
        handleError(dispatch, data.error);
        if (callback) callback(data.error);
        return;
      }
      dispatch(assignClapitAccountData(data));
      if (callback) callback(null, data);
    }).catch((err) => {
      if (callback) callback(err);
      handleError(dispatch, err);
    });
  };
}


export function clapitLogout() {
  return (dispatch) => { // eslint-disable-line arrow-body-style
    return dispatch(logout());
  };
}

export function clearApiError() {
  return {
    type: CLEAR_API_ERROR,
  };
}

function handleError(dispatch, error) {
  dispatch(showAPIError(error));
}

function startLogin() {
  return {
    type: LOGGING_IN,
  };
}

function logout() {
  return {
    type: LOGOUT,
  };
}

function showAPIError(error) {
  return {
    type: API_ERROR,
    payload: error,
  };
}

function loginWithFacebook(accessToken) {
  return (dispatch) => { // eslint-disable-line arrow-body-style
    return doFetch('Accounts/login/facebook', {
      method: 'POST',
      body: {
        access_token: accessToken,
      },
    }).then((data) => {
      if (data.error) {
        handleError(dispatch, data.error);
        return false;
      }
      dispatch(assignClapitAccountData(data));
      return data;
    }).catch(handleError.bind(null, dispatch));
  };
}

function loginWithEmail(data) {
  return (dispatch) => {
    const Account = data.user;
    Account.accessToken = data.id;
    Account.accessTokenTTL = data.ttl;
    Account.accessTokenCreated = data.created;
    Account.isNew = data.isNew;
    dispatch(assignClapitAccountData(Account));
    return data;
  };
}

function connectWithEmail(data) {
  return (dispatch) => {
    const Account = data.user;
    Account.accessToken = data.id;
    Account.accessTokenTTL = data.ttl;
    Account.accessTokenCreated = data.created;
    Account.isNew = data.isNew;
    dispatch(assignClapitAccountData(Account));
    return data;
  };
}

function connectWithFacebook(accessToken) {
  return (dispatch) => { // eslint-disable-line arrow-body-style
    return doFetch('Accounts/connect/facebook', {
      method: 'POST',
      body: {
        fbAccessToken: accessToken,
      },
    }).then((data) => {
      if (data.error) {
        handleError(dispatch, data.error);
        return false;
      }
      // dispatch(assignClapitAccountData(data))
      return data;
    }).catch(handleError.bind(null, dispatch));
  };
}

function loginWithTwitter(twitterAuthData) {
  const { authToken, authTokenSecret, email } = twitterAuthData;
  return (dispatch) => {
    let body = {
      oauth_token: authToken,
      oauth_token_secret: authTokenSecret,
    };
    if (email) {
      body = _.assign({}, body, { email });
    }
    return doFetch('Accounts/login/twitter', {
      method: 'POST',
      body,
    }).then((data) => {
      if (data.error) {
        handleError(dispatch, data.error);
        return;
      }
      dispatch(assignClapitAccountData(data));
    }).catch(handleError.bind(null, dispatch));
  };
}

function connectWithTwitter(twitterAuthData) {
  const { authToken, authTokenSecret, email } = twitterAuthData;
  return (dispatch) => {
    let body = {
      oauthToken: authToken,
      oauthSecret: authTokenSecret,
    };
    if (email) {
      body = _.assign({}, body, { email });
    }
    return doFetch('Accounts/connect/twitter', {
      method: 'POST',
      body,
    }).then((data) => {
      if (data.error) {
        handleError(dispatch, data.error);
        return;
      }
      // dispatch(assignClapitAccountData(data))
    }).catch(handleError.bind(null, dispatch));
  };
}

function loginWithInstagram(instagramAuthData) {
  const { accessToken } = instagramAuthData;
  return (dispatch) => { // eslint-disable-line arrow-body-style
    return doFetch('Accounts/login/instagram', {
      method: 'POST',
      body: {
        access_token: accessToken,
      },
    }).then((data) => {
      if (data.error) {
        handleError(dispatch, data.error);
        return;
      }
      dispatch(assignClapitAccountData(data));
    }).catch(handleError.bind(null, dispatch));
  };
}

function connectWithInstagram(instagramAuthData) {
  const { accessToken } = instagramAuthData;
  return (dispatch) => { // eslint-disable-line arrow-body-style
    return doFetch('Accounts/connect/instagram', {
      method: 'POST',
      body: {
        accessToken,
      },
    }).then((data) => {
      if (data.error) {
        handleError(dispatch, data.error);
        return;
      }
      // dispatch(assignClapitAccountData(data))
    }).catch(handleError.bind(null, dispatch));
  };
}

function assignClapitAccountData(data) {
  const { accessToken } = data;
  assignAccessToken(accessToken);
  return {
    type: ASSIGN_CLAPIT_ACCOUNT_DATA,
    payload: data,
  };
}

export function assignDeviceToken(deviceToken) {
  return {
    type: ASSIGN_DEVICE_TOKEN,
    payload: { deviceToken },
  };
}
