/**
 * Homepage selectors
 */

// import { createSelector } from 'reselect';

const selectHome = () => (state) => {
  // state.get('home');
  const { home } = state;
  return home;
};

const selectUsername = () => (state) => {
    const { username } = selectHome();
    return username;
};
// createSelector(
//  selectHome(),
//  (homeState) => homeState.get('username')
// );

const selectClapitAccountData = () => (state) => {
  const { clapitAccountData } = state;
  return clapitAccountData;
};
  // state.get('clapitAccountData');

const selectAuthType = () => (state) => {
  const { authType } = selectHome();
  return authType;
    /* createSelector(
        selectHome(),
        (homeState) => homeState.get('authType')
    ); */
}

const selectTabIndex = () => (state) => {
  const { slideIndex } = selectHome();
  return slideIndex;
    /* createSelector(
        selectHome(),
        (homeState) => homeState.get('slideIndex')
    ); */
}


export {
  selectHome,
  selectUsername,
  selectAuthType,
  selectTabIndex,
  selectClapitAccountData,
};
