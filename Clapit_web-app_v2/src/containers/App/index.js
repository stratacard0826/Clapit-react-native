/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from 'components/Header';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchProfileData, fetchProfileRecentPosts, fetchProfilePopularPosts } from '../../redux/actions/profile';
import { clapitLogout } from '../../redux/actions/clapit';
import { follow, unfollow } from '../../redux/actions/network';

const AppWrapper = styled.div`
  // max-width: calc(768px + 16px * 2);
  // margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0;
  flex-direction: column;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { clapitAccountData, location } = this.props;
    return (
      <AppWrapper>
        <Helmet
            titleTemplate="%s - Clapit"
            defaultTitle="Clapit"
            meta={[
        { name: 'description', content: 'Clapit web application' },
      ]}
            />
        <Header />
        {React.Children.toArray(this.props.children)}
      </AppWrapper>
    );
  }

}

App.propTypes = {
  children: React.PropTypes.node,
};

function stateToProps(state, props) {

  if (props.location && props.location.state) {
    props = {...props, ...props.location.state};
  }
  let { accountId } = props;

  return { clapitAccountData: state.clapitAccountData, ...props };
}


function dispatchToProps(dispatch) {
  let actions = Object.assign({}, { clapitLogout, fetchProfileData, fetchProfileRecentPosts, fetchProfilePopularPosts, follow, unfollow });

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(App);
