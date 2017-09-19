import {
    FETCH_FEED_DATA,
    FETCH_FEED_DATA_SUCCESS,
    FETCH_FEED_DATA_ERROR,
    FEED_ITEM_UPDATE,
    FEED_ITEM_DELETE_SUCCESS,
    FEED_ITEM_DELETE_ERROR,
} from '../constants/ActionTypes';

const initialState = {
  fetchingData: false,
  reloading: false,
  error: undefined,
  items: [],
  itemsById: {},
};

export function feed(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_FEED_DATA: {
      return { ...state, fetchingData: true, reloading: payload.reloading };
    }
    case FETCH_FEED_DATA_SUCCESS: {
      const { page, reload } = payload;
      if (!reload && payload.page <= state.page) { return state; }

      const newItemsById = reload ? {} : Object.assign({}, state.itemsById);
      const existingItems = reload ? [] : state.items;

      payload.items.map((item) => newItemsById[item.id] = item); // eslint-disable-line no-return-assign
      const newItems = existingItems.concat(payload.items.map((item) => item.id));

      return { ...state, fetchingData: false, page, items: newItems, itemsById: newItemsById };
    }
    case FEED_ITEM_UPDATE: {
      const { itemsById } = state;
      const { id: itemId, ...params } = payload;

      const item = Object.assign({}, itemsById[itemId], params);
      const newItemsById = Object.assign({}, itemsById, { [itemId]: item });
      return { ...state, itemsById: newItemsById };
    }
    case FETCH_FEED_DATA_ERROR: {
      return { ...state, fetchingData: false, error: payload.error };
    }
    case FEED_ITEM_DELETE_SUCCESS: {
      return { ...state };
    }
    case FEED_ITEM_DELETE_ERROR: {
      return { ...state };
    }
    default:
      return state;
  }
}
