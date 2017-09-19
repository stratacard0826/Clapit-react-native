/*
 *
 * SearchResultsPage
 *
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as friendsActions from '../../redux/actions/friends';
import * as networkActions from '../../redux/actions/network';
import SearchResults from '../../components/SearchResults';
import PageContainer from '../../components/PageContainer';

class SearchResultsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { clapitAccountData, fetchFriendsData, searchFriends, params } = this.props;

    if (params.type.startsWith('hashtag') && params.type === 'hashtag') {
      searchFriends(`#${params.q}`, 0);
    } else if (params.type.startsWith('user') && params.type === 'user') {
      searchFriends(`${params.q}`, 0);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { params, searchFriends } = this.props;
    const { params: nextParams } = nextProps;
    if (typeof params !== 'undefined' && typeof nextParams !== 'undefined') {
      if (nextParams.q !== params.q) {
        if (nextParams.type.startsWith('hashtag') && nextParams.type === 'hashtag') {
          searchFriends(`#${nextParams.q}`, 0);
        } else if (nextParams.type.startsWith('user') && nextParams.type === 'user') {
          searchFriends(`${nextParams.q}`, 0);
        }
      }
    }
  }
  render() {
    const { params, clapitAccountData, fetchFriendsData } = this.props;
    // start searchFriends
    return (
      <div>
        <Helmet
          title="SearchResultsPage"
          meta={[
            { name: 'description', content: 'Description of SearchResultsPage' },
          ]}
        />
        <PageContainer>
          <SearchResults
            searchTerm={params.q}
          />
        </PageContainer>
      </div>
    );
  }
}

function stateToProps(state, props) {
  if (props.location && props.location.state) {
    props = { ...props, ...props.location.state };
  }
  const { friends, clapitAccountData } = state;
  return { friends, clapitAccountData, ...props };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, friendsActions, networkActions);
  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(SearchResultsPage);

