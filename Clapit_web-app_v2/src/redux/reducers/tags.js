import {
  FETCH_TAG_DATA_START,
  FETCH_TAG_DATA_SUCCESS,
  FETCH_TAG_DATA_ERROR,
  FETCH_HASHTAGS_START,
  FETCH_HASHTAGS_SUCCESS,
  FETCH_HASHTAGS_ERROR,
  FETCH_USERNAMES_START,
  FETCH_USERNAMES_SUCCESS,
  FETCH_USERNAMES_ERROR,
} from '../constants/ActionTypes';

const initialState = {
  fetchingData: false,
  reloading: false,
  error: undefined,

  items: [],
  itemsById: {},
  hashtags: [],
  usernames: [],
  type: '', // one of hashtag|username
};

export function tags(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_TAG_DATA_START: {
      const newTag = (payload.page === 0 || !state.items);
      const items = newTag ? [] : state.items;
      const itemsById = newTag ? {} : state.itemsById;
      return { ...state, fetchingData: true, reloading: payload.reloading, items, itemsById, page: payload.page };
    }
    case FETCH_TAG_DATA_SUCCESS: {
      const newItemsById = Object.assign({}, state.itemsById);
      payload.items.map((item) => newItemsById[item.id] = item); // eslint-disable-line no-return-assign
      const newItems = state.items.concat(payload.items.map((item) => item.id));
      return { ...state, fetchingData: false, items: newItems, itemsById: newItemsById, page: payload.page };
    }
    case FETCH_TAG_DATA_ERROR: {
      return { ...state, fetchingData: false, error: payload.error };
    }
    case FETCH_HASHTAGS_START: {
      return { ...state, fetchingData: true, hashtags: [], type: payload.type, page: payload.page };
    }
    case FETCH_HASHTAGS_SUCCESS: {
      return { ...state, fetchingData: false, hashtags: payload.hashtags, type: payload.type, page: payload.page };
    }
    case FETCH_HASHTAGS_ERROR: {
      return { ...state, fetchingData: false, type: payload.type, error: payload.error };
    }
    case FETCH_USERNAMES_START: {
      return { ...state, fetchingData: true, usernames: [], type: payload.type, page: payload.page };
    }
    case FETCH_USERNAMES_SUCCESS: {
      return { ...state, fetchingData: false, usernames: payload.usernames, type: payload.type, page: payload.page };
    }
    case FETCH_USERNAMES_ERROR: {
      return { ...state, fetchingData: false, type: payload.type, error: payload.error };
    }
    default:
      return state;
  }
}
