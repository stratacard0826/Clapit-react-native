import { EMAIL_AUTH_DATA, EMAIL_LOGIN_ERROR, CLEAR_AUTH_ERROR } from '../constants/ActionTypes';

export function emailAuthData(state = {}, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case EMAIL_AUTH_DATA:
      return payload;
    default:
      return state;
  }
}

export function emailLoginError(state = null, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case EMAIL_LOGIN_ERROR:
      return payload;
    case CLEAR_AUTH_ERROR:
      return null;
    default:
      return state;
  }
}
