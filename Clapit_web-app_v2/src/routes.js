import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Chat,
    Terms,
    Privacy,
    SearchResults,
    Alerts,
    OpenCalls,
    PostDetails,
    Home,
    Widgets,
    About,
    Login,
    LoginSuccess,
    Survey,
    NotFound,
    Pagination,
    EditProfile,
    Trending,
  } from 'containers';
import {
  Profile,
  Network,
} from 'components';
import { changeAuthType, changeTabIndex } from './redux/actions/homeUI';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>

      { /* Routes */ }
      <Route path="feed/best" onEnter={() => { store.dispatch(changeTabIndex(0)); }} component={Home}/>
      <Route path="feed/new" onEnter={() => { store.dispatch(changeTabIndex(1)); }} component={Home}/>
      <Route path="feed/friends" onEnter={() => { store.dispatch(changeTabIndex(2)); }} component={Home}/>
      <Route path="login" onEnter={() => { store.dispatch(changeAuthType('login')); }} component={Home}/>
      <Route path="signup" onEnter={() => { store.dispatch(changeAuthType('signup')); }} component={Home}/>
      <Route path="privacy" component={Privacy}/>
      <Route path="terms" component={Terms}/>
      <Route path="search/:type/:q" component={SearchResults}/>
      <Route path="opencalls" component={OpenCalls}/>
      <Route path="alerts" component={Alerts}/>
      <Route path="editprofile" component={EditProfile}/>
      <Route path="profile/:accountId/:username" component={Profile}/>
      <Route path="post/:postId/:slug" component={PostDetails}/>
      <Route path="followers/:resourceId" component={Network}/>
      <Route path="followings/:resourceId" component={Network}/>
      <Route path="claps/:resourceId" component={Network}/>
      <Route path="claps/:resourceId" component={Trending}/>


      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="pagination" component={Pagination}/>
      <Route path="survey" component={Survey}/>
      <Route path="widgets" component={Widgets}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
