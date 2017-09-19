import { ASSIGN_INSTAGRAM_AUTH_DATA, ASSIGN_CLAPIT_ACCOUNT_DATA } from '../constants/ActionTypes';
// import _ from 'lodash';

export function instagramAuthData(state = {}, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case ASSIGN_INSTAGRAM_AUTH_DATA: {
      return payload;
    }
    case ASSIGN_CLAPIT_ACCOUNT_DATA: {
      const { instagramId: userID, instagramToken: accessToken } = payload;

      if (userID && accessToken) {
        return { userID, accessToken };
      }
      return state;
    }
    default:
      return state;
  }
}
