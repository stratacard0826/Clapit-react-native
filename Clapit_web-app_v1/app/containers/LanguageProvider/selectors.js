// import { createSelector } from 'reselect';

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = () => (state) => {
  // state.get('language');
  const { language } = state;
  return language;
};

/**
 * Select the language locale
 */

// const selectLocale = () => createSelector(
//  selectLanguage(),
//  (languageState) => languageState.get('locale')
// );

const selectLocale = () => {
  const { locale } = selectLanguage();
  return locale;
};
export {
  selectLanguage,
  selectLocale,
};
