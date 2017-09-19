import { createSelector } from 'reselect';

/**
 * Direct selector to the feed state domain
 */
const selectFeedDomain = () => (state) => {
  const { feed } = state;
  return feed;
  // state.get('feed');
}


/**
 * Other specific selectors
 */


/**
 * Default selector used by Feed
 */

const selectFeed = () => (state) => {
  const { feed } = state;
  return feed;
  //createSelector(
  //selectFeedDomain(),
  //(substate) => substate.toJS()
  //);
}
export default selectFeed;
export {
  selectFeedDomain,
};
