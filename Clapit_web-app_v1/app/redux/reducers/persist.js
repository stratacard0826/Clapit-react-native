import { assignAccessToken } from '../actions/api';

export function autoRehydrated(state = false, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case 'persist/REHYDRATE': {
      const { clapitAccountData = {} } = payload;
      const { accessToken = null } = clapitAccountData;
      assignAccessToken(accessToken);
      return true;
    }
    default:
      return state;
  }
}
