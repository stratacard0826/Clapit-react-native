import {
  ASSIGN_CLAPIT_ACCOUNT_DATA,
  ASSIGN_TWITTER_AUTH_DATA,
  ASSIGN_FACEBOOK_AUTH_DATA,
  ASSIGN_INSTAGRAM_AUTH_DATA,
  ASSIGN_DEVICE_TOKEN,
  TWITTER_LOGOUT,
  FACEBOOK_LOGOUT,
  FACEBOOK_LOGIN_START,
  FACEBOOK_LOGIN_CANCEL,
  INSTAGRAM_LOGOUT,
  LOGOUT,
  LOGGING_IN,
  EMAIL_LOGIN_START,
  EMAIL_SIGNUP_START,
  EMAIL_LOGIN_ERROR,
  API_ERROR,
  CLEAR_API_ERROR,
} from '../constants/ActionTypes';
import _ from 'lodash';

export function clapitDeviceToken(state = {}, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case ASSIGN_DEVICE_TOKEN:
      return { ...state, deviceToken: payload.deviceToken };
    default:
      return state;
  }
}

export function clapitAccountData(state = {}, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case ASSIGN_CLAPIT_ACCOUNT_DATA: // eslint-disable-line no-case-declarations
      const {
          accessToken = state.accessToken,
          accessTokenCreated = state.accessTokenCreated,
          accessTokenTTL = state.accessTokenTTL,
          } = payload; // ensure these values are preserved if not in payload
      return _.assign({}, payload, { accessToken, accessTokenCreated, accessTokenTTL });
    case ASSIGN_TWITTER_AUTH_DATA: // eslint-disable-line no-case-declarations
      if (_.isEmpty(state)) { return state; }
      const { userID: twitterId, authToken: twitterToken, authTokenSecret: twitterTokenSecret } = payload;
      return _.assign({}, state, { twitterId, twitterToken, twitterTokenSecret });
    case ASSIGN_FACEBOOK_AUTH_DATA: // eslint-disable-line no-case-declarations
      if (_.isEmpty(state)) { return state; }
      const { id: facebookId, accessToken: facebookToken } = payload;
      return _.assign({}, state, { facebookId, facebookToken });
    case ASSIGN_INSTAGRAM_AUTH_DATA: // eslint-disable-line no-case-declarations
      if (_.isEmpty(state)) { return state; }
      const { userID: instagramId, accessToken: instagramToken } = payload;
      return _.assign({}, state, { instagramId, instagramToken });
    case TWITTER_LOGOUT:
      return _.assign({}, state, { twitterId: null, twitterToken: null, twitterTokenSecret: null });
    case FACEBOOK_LOGOUT:
      return _.assign({}, state, { facebookId: null, facebookToken: null });
    case INSTAGRAM_LOGOUT:
      return _.assign({}, state, { instagramId: null, instagramToken: null });
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

export function facebookLoggingIn(state = false, action = {}) {
  const { type } = action;

  switch (type) {
    case FACEBOOK_LOGIN_START:
      return true;
    case FACEBOOK_LOGIN_CANCEL:
      return false;
    case ASSIGN_CLAPIT_ACCOUNT_DATA:
      return false;
    default:
      return state;
  }
}

export function loggingIn(state = false, action = {}) {
  const { type } = action;

  switch (type) {
    case LOGGING_IN:
      return true;
    case EMAIL_LOGIN_START:
      return true;
    case EMAIL_SIGNUP_START:
      return true;
    case ASSIGN_CLAPIT_ACCOUNT_DATA:
      return false;
    case API_ERROR:
      return false;
    case EMAIL_LOGIN_ERROR:
      return false;
    default:
      return state;
  }
}

export function apiError(state = null, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case API_ERROR:
      return payload;
    case CLEAR_API_ERROR:
      return null;
    default:
      return state;
  }
}
