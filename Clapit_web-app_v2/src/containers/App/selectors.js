/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = () => (state) => {
  console.log('~~~~STATE global',state);
  // state.get('global');
  const { global } = state;
  return global;
};

const selectCurrentUser = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('currentUser')
);

const selectLoading = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('loading')
);

const selectError = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('error')
);

const selectRepos = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['userData', 'repositories'])
);
const selectAuthData = () => createSelector(
    selectGlobal(),
    (globalState) => globalState.get('authData')
);

const selectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    // console.log('~~~state', state);
    // const routingState = state.get('route'); // or state.route
    const routingState = state.route; // or state.route
   // if (typeof routingState !== 'undefined' && !routingState.equals(prevRoutingState)) {
    prevRoutingState = routingState;
      // prevRoutingStateJS = routingState.toJS();
   // }

    return prevRoutingState;
  };
};

export {
  selectGlobal,
  selectCurrentUser,
  selectLoading,
  selectError,
  selectRepos,
  selectLocationState,
  selectAuthData,
};
