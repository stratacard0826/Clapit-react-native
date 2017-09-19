import { PREFERENCES_SET } from '../constants/ActionTypes';

const initialState = {
  singitPopupShouldAutoShow: true,
  danceitPopupShouldAutoShow: true,
  makemeamusePopupShouldAutoShow: true,
};

export function preferences(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case PREFERENCES_SET: {
      return { ...state, ...payload };
    }
    default:
      return state;
  }
}
