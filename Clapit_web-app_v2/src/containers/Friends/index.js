/* //eslint-disable-line semi
 *
 * Friends
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as friendsActions from '../../redux/actions/friends';
import * as networkActions from '../../redux/actions/network';

import FeedItem from '../../components/FeedItem';
import ReactionItem from '../../components/ReactionItem';
// import NetworkItem from '../../components/NetworkItem';
// import _ from 'lodash';
import { Colors } from '../../themes';
import { browserHistory } from 'react-router';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';
import { DISTANCE_SCROLL } from '../../redux/constants/Constants';
import { navigateToProfile, navigateToPostDetail } from '../../utils/navigator';
const width = MAX_PAGE_WIDTH;
const TOGGLE_FRIENDS_LABEL = 'Friends';
const TOGGLE_NEW_LABEL = 'New';

export class Friends extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleScrollFeed = this.handleScrollFeed.bind(this);
    let dataSourceFeed = this.getDataSourceFeed(props);
    this.state = {
      dataSourceFeed,
      dataSourceSearch: [],
      searchResults: [],
      searching: false,
      canLoadNextPage: true,
      showLoading: true,
      dataType: props.friends.dataType,
      modalVisible: false,
      inviteItems: [],
      // toggleFeed: TOGGLE_NEW_LABEL,
      toggleFeed: props.toggleFeedType,
    };
  }

  componentDidMount() {
    const { clapitAccountData, fetchFriendsData, fetchRecentData } = this.props;
    const fetchData = this.state.toggleFeed === TOGGLE_NEW_LABEL ? fetchRecentData : fetchFriendsData;
    fetchData(clapitAccountData.id, 0);
    window.addEventListener('scroll', this.handleScrollFeed);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollFeed);
  }
  componentWillReceiveProps(nextProps) {
    let dataSourceFeed = this.getDataSourceFeed(nextProps);

    switch (nextProps.friends.dataType) {
      // hack to fix the auto play after visited the top10 feed, because the dataType didn't change
      case 'hash-tags-search':
      case 'friends-data':
        {
          const { itemsById: oldItemsById } = this.props.friends;
          const { itemsById } = nextProps.friends;

          // ensure can load more
          const { page:oldPage, items:oldItems } = this.props.friends;
          const { page, items } = nextProps.friends;

          if (page > oldPage && items.length === oldItems.length) { // done for now
            this.setState({ canLoadNextPage: false })
            // re-enable after 10 seconds
            setTimeout(() => {
              this.setState({ canLoadNextPage: true });
            }, 10 * 1000);
          }

          this.setState({
            searchResults: [],
            dataSourceFeed,
            dataType: nextProps.friends.dataType,
            showLoading: false,
          });
        }
        break;

      default:
        {
          this.setState({
            searchResults: [],
            dataSourceFeed,
          });
        }
    }
  }

  onProfilePressed(item) {
    navigateToProfile(item.post.Account);
  }

  renderFeedRow(item) {
    const { navigator, searchFriends } = this.props;

    if (item.reaction) {
      return (
        <ReactionItem
          key={item.reaction.id}
          item={item.reaction}
          style={{ ...styles.reactionItem }}
          width={width}
          searchFriends={searchFriends}
          onReactionPressed={() => {
            navigateToPostDetail(item.post);
          }}
        />
      );
    }
    return (
      <FeedItem
        key={item.post.id}
        item={item.post}
        style={{ ...styles.friendsItem }}
        width={width}
        searchFriends={searchFriends}
        navigator={navigator}
        onProfilePressed={this.onProfilePressed.bind(this, item)}
        onMainImagePressed={this.onMainImagePressed}
        trackingSource="Friends"
      />
    );
  }

  onMainImagePressed = (item) => {
    navigateToPostDetail(item);
  };

  handleScrollFeed(event) {
    const itemTranslate = document.getElementsByTagName('body')[0].scrollHeight - (event.srcElement.body.scrollTop + document.body.offsetHeight);
    // console.log('~~~~~~~~~~', itemTranslate);

    const { canLoadNextPage } = this.state;

    if (canLoadNextPage && itemTranslate < DISTANCE_SCROLL && !this.loadingNextPage) {
      const { friends: { page }, clapitAccountData, fetchFriendsData, fetchRecentData } = this.props;

      this.loadingNextPage = true

      const fetchData = this.state.toggleFeed === TOGGLE_NEW_LABEL ? fetchRecentData : fetchFriendsData;
      fetchData(clapitAccountData.id, page + 1).then(() => {
        this.loadingNextPage = false;
      })
      setTimeout(() => {
        this.loadingNextPage = false;
      }, 5000);  // try again after 5s
    }
  }
  // onScroll(e) {
  //  const { canLoadNextPage } = this.state;
  //
  //  if (canLoadNextPage && distanceFromEnd(e) < 2000 && !this.loadingNextPage) {
  //    const { friends: { page }, clapitAccountData, fetchFriendsData, fetchRecentData } = this.props;
  //
  //    this.loadingNextPage = true
  //
  //    const fetchData = this.state.toggleFeed === TOGGLE_NEW_LABEL ? fetchRecentData : fetchFriendsData;
  //
  //    fetchData(clapitAccountData.id, page + 1).then(() => {
  //      this.loadingNextPage = false;
  //    })
  //    setTimeout(() => {
  //      this.loadingNextPage = false;
  //    }, 5000);  // try again after 5s
  //  }
  // }

  getDataSourceFeed(props) {
    const result = props.friends.items.map((id) => (props.friends.itemsById[id]));
    return result;
  }

  render() {
    let { dataSourceFeed } = this.state;
    return (
      <div style={styles.container}>
        {dataSourceFeed.map((item) => this.renderFeedRow(item))}
      </div>
    );
  }
}

function stateToProps(state) {
  // const { friends, clapitAccountData, contacts } = state.toObject();
  const { friends, clapitAccountData, contacts, homeUI } = state;
  const { authType, slideIndex } = homeUI;
  return { friends, clapitAccountData, contacts, tabIndex: slideIndex };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, friendsActions, networkActions);
  return bindActionCreators(actions, dispatch);
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 50,
    // backgroundColor: 'green',
    // marginTop: 2
  },
  reactionItem: {
    // alignSelf: 'stretch',
    width,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    // marginBottom: 10,
    // backgroundColor: 'red'
  },
  friendsItem: {
    flex: 1,
    alignSelf: 'stretch',
    // marginBottom: 20,
    // backgroundColor:'blue'
  },
  header: {
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
    borderColor: 'grey',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 70,
  },
  innerBox: {
    marginLeft: 25,
    marginRight: 25,
  },
  inviteItem: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    paddingLeft: 10,
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 50,
    height: 50,
    paddingLeft: 10,
    paddingTop: 10,
    flex: 0.2,
  },
  subtleText: {
    fontSize: 10,
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
    width: 160,
  },
  inviteHeader: {
    flex: 0.8,
    marginTop: 20,
  },
  inviteHeaderText: {
    fontSize: 18,
    color: Colors.purple,
    left: -20,
  },
};

export default connect(stateToProps, dispatchToProps)(Friends);
