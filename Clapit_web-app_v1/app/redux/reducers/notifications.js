import {
  FETCH_NOTIFICATIONS_DATA,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  MARK_NOTIFICATION_OLD,
  // LOGOUT,
} from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  fetchingData: false,
  reloading: false,
  error: undefined,
  items: [],
};

export function notifications(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_NOTIFICATIONS_DATA: {
      return { ...state, fetchingData: true, page: payload.page, reloading: payload.reloading };
    }
    case FETCH_NOTIFICATIONS_SUCCESS: {
      return { ...state, fetchingData: false, items: payload.items };
    }
    case FETCH_NOTIFICATIONS_ERROR: {
      return { ...state, fetchingData: false, error: payload.error };
    }
    default:
      return state;
  }
}

const newNotificationsInitialState = {
  itemIds: [],
  lastItemId: 0,
};

export function newNotifications(state = newNotificationsInitialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_NOTIFICATIONS_SUCCESS: {
      const { lastItemId } = state;

      if (payload.items.error) return state;

      const { items = [] } = payload;

      const nowTimestamp = new Date().getTime();

      // check to see if item's id is newer than lastItemId, if so set it, as long as it's not
      // greater than 2 days old
      const newItems = items.filter((item) => {
        const itemTimestamp = new Date(item.created).getTime();

        if (item.id > lastItemId && (nowTimestamp - itemTimestamp < 1000 * 60 * 60 * 48)) {
          return true;
        }

        return false;
      });

      let newLastItemId = lastItemId;

      if (items.length > 0) {
        newLastItemId = _.first(items).id; // assign newLastItemId
      }

      const newItemIds = _.compact(newItems.map((item) => item.id).concat(state.itemIds));

      return { itemIds: newItemIds, lastItemId: newLastItemId };
    }
    case MARK_NOTIFICATION_OLD: {
      let { itemIds } = state;

      itemIds = itemIds.slice();
      const itemIndex = itemIds.indexOf(payload);
      itemIds.splice(itemIndex, 1);
      return { ...state, itemIds };
    }
    default:
      return state;
  }
}
