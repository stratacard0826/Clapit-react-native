import {
    FETCH_PROFILE_DATA,
    FETCH_PROFILE_DATA_SUCCESS,
    FETCH_PROFILE_DATA_ERROR,
    // FETCH_RECENT_POSTS,
    FETCH_RECENT_POSTS_SUCCESS,
    FETCH_RECENT_POSTS_ERROR,
    // FETCH_POPULAR_POSTS,
    FETCH_POPULAR_POSTS_SUCCESS,
    FETCH_POPULAR_POSTS_ERROR,
} from '../constants/ActionTypes';

import {
    // PROFILE_POSTS_RECENT,
    // PROFILE_POSTS_POPULAR,
} from '../constants/PostsTypes';

export function profiles(state = {}, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_PROFILE_DATA: {
      const { accountId, details } = payload;
      details.isLoading = true;

      return Object.assign({}, state, { [accountId]: details });
    }
    case FETCH_PROFILE_DATA_SUCCESS: {
      const { accountId, details } = payload;
      details.isLoading = false;
      return Object.assign({}, state, { [accountId]: details });
    }
    case FETCH_PROFILE_DATA_ERROR: {
      const { accountId, error } = payload;
      details.isLoading = false; // eslint-disable-line no-undef
      return Object.assign({}, state, { [accountId]: { error } });
    }
    default:
      return state;
  }
}

export function recentPosts(state = {}, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_RECENT_POSTS_SUCCESS: {
      const { accountId, items: newItems, page } = payload;
      let items = [];

      if (state[accountId]) {
        ({ items } = state[accountId]);
      }

      if (page === 0) {
        items = newItems;
      } else {
        items = items.concat(newItems);
      }

      return Object.assign({}, state, { [accountId]: { page, items } });
    }
    case FETCH_RECENT_POSTS_ERROR: {
      const { accountId, error } = payload;

      return Object.assign({}, state, { [accountId]: { error } });
    }
    default:
      return state;
  }
}

export function popularPosts(state = {}, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_POPULAR_POSTS_SUCCESS: {
      const { accountId, items: newItems, page } = payload;
      let items = [];

      if (state[accountId]) {
        ({ items } = state[accountId]);
      }

      if (page === 0) {
        items = newItems;
      } else {
        items = items.concat(newItems);
      }

      return Object.assign({}, state, { [accountId]: { page, items } });
    }
    case FETCH_POPULAR_POSTS_ERROR: {
      const { accountId, error } = payload;

      return Object.assign({}, state, { [accountId]: { error } });
    }
    default:
      return state;
  }
}
