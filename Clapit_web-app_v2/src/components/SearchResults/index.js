/**
*
* SearchResults
*
*/

import React from 'react';
import { respPixels, RESP_RATIO } from '../../utils/responsiveUtils';

import * as friendsActions from '../../redux/actions/friends';
import * as networkActions from '../../redux/actions/network';

import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FeedItem from '../FeedItem';
import NetworkItem from '../NetworkItem';
import _ from 'lodash';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';
import { navigateToProfile, navigateToPostDetail } from '../../utils/navigator';
const width = MAX_PAGE_WIDTH;

export class SearchResults extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    let datasourcefeed = this._getDataSourceFeed(props);
    this.state = {
      dataSourceFeed: datasourcefeed,
      dataSourceSearch: datasourcefeed,
      searchResults: [],
      // scroll: new Animated.Value(0),
      searching: false,
      canLoadNextPage: true,
      showLoading: true,
      // dataType: props.friends.dataType,
      dataType: 'hash-tags-search',
      searchTerm: props.searchTerm || '',
      showInfoModal: props.showInfoModal,
    };

    this.typeTimeout = null;
  }

  componentWillReceiveProps(nextProps) {
    let datasourcefeed = this._getDataSourceFeed(nextProps);
    // we want to prevent keep firing REST API calls with pagination/scrolling once at the bottom of
    // the screen (ie no more results); we prevent further loading for 1min
    const { page: oldPage, results: oldResults } = this.props.friends;
    const { page, results } = nextProps.friends;
    // new page request but we already have all of the results; stop asking for more
    if (page > oldPage && results.length === oldResults.length) {
      this.setState({ canLoadNextPage: false });
      // re-enable after 10 seconds
      setTimeout(() => {
        this.setState({ canLoadNextPage: true });
      }, 10 * 1000);
    }

    this.setState({
      searchResults: nextProps.friends.results,
      dataSourceSearch: this.state.dataSourceSearch,
      dataType: nextProps.friends.dataType,
      showLoading: nextProps.friends.fetchingRemoteData,
    });
    if (this.props.searchTerm !== nextProps.searchTerm) {
      this.setState({
        searchTerm: nextProps.searchTerm,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.typeTimeout);
    this.typeTimeout = null;
  }

  _onProfilePressed(item) {
    navigateToProfile(item.post.Account);
  }

  _onFollowPressed(itemId) {
    const { clapitAccountData } = this.props;
    let { searchResults: items } = this.state;
    items = items.slice();

    const itemIndex = _.findIndex(items, { id: itemId });
    const item = Object.assign({}, items[itemIndex]);
    if (item.following) {
      this.props.unfollow(item.id, clapitAccountData.id);
      item.following = false;
    } else {
      this.props.follow(item.id, clapitAccountData.id);
      item.following = true;
    }

    items[itemIndex] = item;

    this.setState({
      searchResults: items,
      dataSourceSearch: items,
    });
  }
  _renderSearchSeparator(sectionID, rowID) {
    return <div key={`${sectionID}-${rowID}`} style={styles.searchSeparator}></div>;
  }
  _renderSearchRow(item, row) {
    let { clapitAccountData, navigator, unauthenticatedAction, searchFriends } = this.props;

    const { dataType } = this.state;

    switch (dataType) {
      case 'friends-search':
      {
        return (
          <NetworkItem
            key={item.id}
            item={item}
            style={{ ...styles.searchItem }}
            allowFollow={(item.id !== clapitAccountData.id)}
            onProfilePressed={(item) => {
              navigateToProfile(item);
            }}
            onFollowPressed={this._onFollowPressed.bind(this, item.id)}
          />
        );
      }
        break;

      case 'hash-tags-search':
      {
        return (
          <FeedItem
            key={item.id}
            item={item}
            recentPosts={item.Account.Posts}
            rank={parseInt(row) + 1}
            clapitAccountData={clapitAccountData}
            style={{ ...styles.friendsItem }}
            width={width}
            dataType={dataType}
            navigator={navigator}
            searchFriends={searchFriends}
            unauthenticatedAction={unauthenticatedAction}
            onProfilePressed={this._onProfilePressed.bind(this, { post: item })}
            onMainImagePressed={this._onMainImagePressed}
            trackingSource="Search"
          />
        );
      }
        break;
    }
  }

  _onMainImagePressed = (item) => {
    navigateToPostDetail(item);
  };

  _onStartSearch(text) {
    const searchTerm = text.trim();
    if (searchTerm.length > 0) {
      // clear previous timeouts
      clearTimeout(this.typeTimeout);
      // perform search
      this.typeTimeout = setTimeout(() => {
        this.setState({
          searching: true,
          showLoading: true,
          searchTerm,
        });
        this.props.searchFriends(text, 0);
       //  Mixpanel.trackWithProperties("Search Friend", { trackingSource: 'Friends', text })
      }, 700);
    } else {
      this.setState({ showLoading: false, searching: false })
    }
  }
  /* _onScroll(e) {
    let { canLoadNextPage } = this.state

    if (canLoadNextPage && distanceFromEnd(e) < 2000 && !this.loadingNextPage) {
      let { friends: { page }, searchFriends } = this.props

      this.loadingNextPage = true
      // searchFriends handles both friends and hash tags
      searchFriends(this.state.searchTerm, page + 1).then(() => {
        this.loadingNextPage = false
      })

      setTimeout(() => {
        this.loadingNextPage = false
      }, 5000)  // try again after 5s

    }
  } */

  _getDataSourceFeed(props) {
    const { topLimit } = props;

    let result = [];
    switch (props.friends.dataType) {
      case 'friends-search':
        // results hold filtered friends
        result = props.friends.results;
        break
      case 'hash-tags-search':
        // results hold filtered posts with relevant hash tag
        result = props.friends.results && props.friends.results.filter((post) => !post.featured);
        if (topLimit && result) {
          result = result.filter((post) => post.Account.id !== 3).slice(0, topLimit);
        }
        break;
    }
    this.setState({ dataSourceFeed: result });
    return result;
  }

  _showInfoModal = () => {
    this.setState({ showInfoModal: true });
  }

  _onPressBack() {
    const { navigator } = this.props;
    // navigator.pop();
  }

  render() {
    const { hideSearchBar, infoText } = this.props;
    const { showLoading, dataSourceSearch, dataSourceFeed } = this.state;
    // console.log('~~~WWW', this.props);
    // const listView = <ListView
    //    removeClippedSubviews={false}
    //    dataSource={this.state.dataSourceSearch}
    //    renderRow={this._renderSearchRow.bind(this)}
    //    style={styles.list}
    //    onScroll={this._onScroll.bind(this)}
    //    scrollEventThrottle={5}
    //    enableEmptySections={true}
    //    premptiveLoading={5}
    //    scrollRenderAheadDistance={2000}
    //    stickyHeaderIndices={[]}
    //    initialListSize={3}
    //    pageSize={3}
    //    onEndReachedThreshold={50}
    //    ref="searchView">
    // </ListView>;
    // const leftButton = <BackButton onPress={this._onPressBack.bind(this)} />;
    // const title = <NavTitle>{this.props.title || this.state.searchTerm}</NavTitle>;
    // const rightButton = (infoText) ? <div onPress={this._showInfoModal}>
    //  <img alt="" src={Images.ico_info} style={{ width: 40, height: 40, marginRight: 10 }} />
    // </div> : <div></div>;
    const topOffset = 66;
    return (
      <div style={styles.container}>
        {
          // hideSearchBar ? null :
          //  <Animated.View style={{
          //          top: topOffset,
          //          left: 0, width,
          //          overflow: 'hidden',
          //          backgroundColor: 'white',
          //          height: this.state.scroll.interpolate({
          //            inputRange: [0, SEARCHBOX_HEIGHT * 2],
          //            outputRange: [SEARCHBOX_HEIGHT, 0],
          //            extrapolate: 'clamp'
          //          })
          //        }}/>
        }
        {
          // listView
          dataSourceFeed.map((item, index) => this._renderSearchRow(item, index))

        }
        {
          // hideSearchBar ? null :
          //  <ClapitSearchBar
          //      scroll={this.state.scroll}
          //      onSearch={this._onStartSearch.bind(this)}
          //      searchTerm={this.state.searchTerm}
          //      topOffset={topOffset}
          //      unauthenticatedAction={this.props.unauthenticatedAction}
          //      clapitAccountData={this.props.clapitAccountData}
          //      />
        }
        {
          // showLoading ? <ClapitLoading skipLayout={true} /> : null
        }
        {
           /*this.state.showInfoModal ? <ClapitModal infoText={infoText} showModal={this.state.showInfoModal} onClose={() => this.setState({ showInfoModal: false })} />
            : null*/
        }
      </div>
    );
  }
}
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    marginTop: 100,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    // marginBottom: 50,
    paddingTop: 20,
  },
  searchSeparator: {
    height: 1,
    backgroundColor: '#CCC',
    marginLeft: 15,
    marginRight: 15,
  },
  searchItem: {
    display: 'flex',
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  reactionItem: {
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  friendsItem: {
    display: 'flex',
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  header: {
    display: 'flex',
    backgroundColor: '#B385FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    resizeMode: 'contain',
    marginTop: 24,
  },
  opaqueModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginLeft: 30 * RESP_RATIO,
    marginRight: 30 * RESP_RATIO,
    marginBottom: 70 * RESP_RATIO,
  },
  innerBox: {
    marginLeft: 25 * RESP_RATIO,
    marginRight: 25 * RESP_RATIO,
  },
  inviteItem: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    paddingLeft: 10,
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 50 * RESP_RATIO,
    height: 50 * RESP_RATIO,
    paddingLeft: 10 * RESP_RATIO,
    paddingTop: 10 * RESP_RATIO,
    // flex: 0.2,
  },
  inviteAllButton: {
    alignSelf: 'stretch',
    marginLeft: respPixels(25),
    marginRight: respPixels(25),
    marginBottom: respPixels(20),
    marginTop: respPixels(20),
    borderRadius: 5,
    padding: respPixels(10),
    backgroundColor: '#BC90FF',
    borderColor: 'black',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteAllButtonText: {
    color: 'white',
    fontSize: 11 * RESP_RATIO,
    fontWeight: 'bold',
  },
  inviteImage: {
    width: respPixels(50),
    height: respPixels(50),
  },
  subtleText: {
    fontSize: 10 * RESP_RATIO,
    color: '#888',
  },
  buttonsContainer: {
    position: 'relative',
    top: -10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  username: {
  },
  itemText: {
    width: respPixels(160),
  },
};

function stateToProps(state) {
  const { friends, clapitAccountData } = state;
  return { friends, clapitAccountData };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, friendsActions, networkActions);
  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(SearchResults);
