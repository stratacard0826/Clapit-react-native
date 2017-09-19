// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';
import { changeAuthType, changeTabIndex } from './containers/HomePage/actions';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducer'),
          System.import('containers/HomePage/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/feed/best',
      name: 'feed_best',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducer'),
          System.import('containers/HomePage/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });
        store.dispatch(changeTabIndex(0));
        importModules.catch(errorLoading);
      },
    }, {
      path: '/feed/new',
      name: 'feed_new',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducer'),
          System.import('containers/HomePage/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });
        store.dispatch(changeTabIndex(1));
        importModules.catch(errorLoading);
      },
    }, {
      path: '/feed/friends',
      name: 'feed_friends',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducer'),
          System.import('containers/HomePage/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });
        store.dispatch(changeTabIndex(2));
        importModules.catch(errorLoading);
      },
    }, {
      path: '/features',
      name: 'features',
      getComponent(nextState, cb) {
        System.import('containers/FeaturePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/login',
      name: 'loginPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducer'),
          System.import('containers/HomePage/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });
        store.dispatch(changeAuthType('login'));
        importModules.catch(errorLoading);
      },
    }, /* {
      path: '/login',
      name: 'loginPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/LoginPage/reducer'),
          System.import('containers/LoginPage/sagas'),
          System.import('containers/LoginPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('loginPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });
        console.log('~~~ff', store.dispatch(changeAuthType('login')))
        importModules.catch(errorLoading);
      },
    },*/ {
      path: '/signup',
      name: 'registerPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducer'),
          System.import('containers/HomePage/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });
        store.dispatch(changeAuthType('signup'));
        importModules.catch(errorLoading);
      },
    }, /* {
      path: '/signup',
      name: 'registerPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/RegisterPage/reducer'),
          System.import('containers/RegisterPage/sagas'),
          System.import('containers/RegisterPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('registerPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },*/{
      path: '/search/:type/:q',
      name: 'searchResultsPage',
      getComponent(location, cb) {
        System.import('containers/SearchResultsPage')
            .then(loadModule(cb))
            .catch(errorLoading);
      },
    }, {
      path: '/opencalls',
      name: 'openCallsPage',
      getComponent(location, cb) {
        System.import('containers/OpenCallsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/alerts',
      name: 'alertsPage',
      getComponent(location, cb) {
        System.import('containers/AlertsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/editprofile',
      name: 'editProfilePage',
      getComponent(location, cb) {
        System.import('containers/EditProfilePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/profile/:accountId/:username',
      name: 'profile',
      getComponent(location, cb) {
        System.import('components/Profile')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/post/:postId/:slug',
      name: 'postDetailsPage',
      getComponent(location, cb) {
        System.import('containers/PostDetailsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/followers/:resourceId',
      name: 'followers',
      getComponent(location, cb) {
        System.import('components/Network')
            .then(loadModule(cb))
            .catch(errorLoading);
      },
    }, {
      path: '/followings/:resourceId',
      name: 'followings',
      getComponent(location, cb) {
        System.import('components/Network')
            .then(loadModule(cb))
            .catch(errorLoading);
      },
    }, {
      path: '/claps/:resourceId',
      name: 'claps',
      getComponent(location, cb) {
        System.import('components/Network')
            .then(loadModule(cb))
            .catch(errorLoading);
      },
    }, {
      path: '/trending/:tag',
      name: 'trendingPage',
      getComponent(location, cb) {
        System.import('containers/TrendingPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/terms',
      name: 'termsOfUsePage',
      getComponent(location, cb) {
        System.import('containers/TermsOfUsePage')
            .then(loadModule(cb))
            .catch(errorLoading);
      },
    }, {
      path: '/privacy',
      name: 'privacyPage',
      getComponent(location, cb) {
        System.import('containers/PrivacyPage')
            .then(loadModule(cb))
            .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
