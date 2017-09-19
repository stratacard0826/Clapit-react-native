import { createSelector } from 'reselect';

/**
 * Direct selector to the registerPage state domain
 */
const selectRegisterPageDomain = () => (state) => state.get('registerPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by RegisterPage
 */

const selectRegisterPage = () => createSelector(
  selectRegisterPageDomain(),
  (substate) => substate.toJS()
);

export default selectRegisterPage;
export {
  selectRegisterPageDomain,
};
