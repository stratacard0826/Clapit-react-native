/*
 *
 * Feed
 *
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FeedItem from '../../components/FeedItem';
import * as feedActions from '../../redux/actions/feed';
import { searchFriends } from '../../redux/actions/friends';
import { browserHistory } from 'react-router';
import { DISTANCE_SCROLL } from '../../redux/constants/Constants';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';
import { navigateToProfile, navigateToPostDetail } from '../../utils/navigator';

const width = MAX_PAGE_WIDTH;

const TOGGLE_BEST_LABEL = 'Trending';
const TOGGLE_TOP_LABEL = 'Top';

export class Feed extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleScrollFeed = this.handleScrollFeed.bind(this);
    let datasourceItems = props.items.map((id) => { return props.itemsById[id]; });

    if (datasourceItems.length === 0) {
      datasourceItems = [{ key: 'empty', value: 'empty' }];
    }

    this.state = {
      datasourceItems,
      canLoadNextPage: true,
      selectedTab: props.selectedTab || TOGGLE_TOP_LABEL,
      showInfoModal: props.showInfoModal,
    };
  }

  componentDidMount() {
    if (this.props.isMainFeed) {
      this.props.fetchFeedData(0, false, '');
    } else {
      this.props.searchFriends(this.props.hashtag, 0, false, 10);
    }
    window.addEventListener('scroll', this.handleScrollFeed);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollFeed);
  }

  componentWillReceiveProps(nextProps) {
    const { itemsById: oldItemsById } = this.props;
    const { itemsById, friends } = nextProps;

    for (var itemId in oldItemsById) {
      if (oldItemsById[itemId] && itemsById[itemId]) {
        const { clapCount: oldClapCount } = oldItemsById[itemId];
        const { clapCount } = itemsById[itemId];
      }
    }

    // ensure can load more
    let { page:oldPage, items:oldItems,  friends:oldFriends, fetchingData:wasFetchingData } = this.props;
    let { page, items = [], hashtag, fetchingData } = nextProps

    let datasourceItems = items.map((id) => { return itemsById[id]; });

    if (page > oldPage && items.length === oldItems.length) { // done for now
      this.setState({ canLoadNextPage: false });

      // re-enable after 10 seconds
      setTimeout(() => {
        this.setState({ canLoadNextPage: true });
      }, 10 * 1000);
    }

    if ( !fetchingData && wasFetchingData ||
      !friends.fetchingRemoteData && oldFriends.fetchingRemoteData) {
      this.setState({ showLoading: false });
    }

    const { searchTerm, results } = friends;
    if (hashtag && searchTerm === hashtag.slice(1) && this.state.selectedTab === TOGGLE_TOP_LABEL) {
      // filter out featured posts and clapit account posts. show only top 10
      datasourceItems = results.filter((post) => !post.featured && post.Account.id !== 3);

      if (datasourceItems.length === 0) {
        datasourceItems = [{ key: 'empty', value: 'empty' }];
      }
    }
    this.setState({
      datasourceItems,
    });
  }
  handleScrollFeed(event) {
    const itemTranslate = document.getElementsByTagName('body')[0].scrollHeight - (event.srcElement.body.scrollTop + document.body.offsetHeight);
    // console.log('~~~~~~~~~~', itemTranslate);

    const { canLoadNextPage } = this.state;

    if (canLoadNextPage && itemTranslate < DISTANCE_SCROLL && !this.loadingNextPage) {
      const { page } = this.props;

      const { clapitAccountData, fetchFeedData } = this.props;

      this.loadingNextPage = true;
      fetchFeedData(page + 1, false, this.props.hashtag).then(() => {
        this.loadingNextPage = false;
      });

      setTimeout(() => {
        this.loadingNextPage = false;
      }, 5000);  // try again after 5s

    }
  }

  // _onScroll(e) {
  //  const { canLoadNextPage } = this.state;
  //
  //  if (canLoadNextPage && distanceFromEnd(e) < 2000 && !this.loadingNextPage) {
  //    const { page } = this.props;
  //
  //    const { clapitAccountData, fetchFeedData } = this.props;
  //
  //    this.loadingNextPage = true;
  //    fetchFeedData(page + 1, false, this.props.hashtag).then(() => {
  //      this.loadingNextPage = false;
  //    });
  //
  //    setTimeout(() => {
  //      this.loadingNextPage = false;
  //    }, 5000);  // try again after 5s
  //
  //  }
  // }

  _renderRow = (item, row) => {
    const { clapitAccountData } = this.props;

    if (item.value === 'empty') {
      return (
        <span key={'empty_' + item.id} style={{ padding: 10 }}>
          Open call started, but we don't have top yet...
        </span>
      );
    }

    const { searchFriends } = this.props;
    return (
      <FeedItem
        key={'FeedItem_' + item.id}
        item={item}
        recentPosts={item.Account.Posts}
        rank={parseInt(row) + 1}
        clapitAccountData={clapitAccountData}
        style={{ ...styles.feedItem }}
        width={width}
        searchFriends={searchFriends}
        onProfilePressed={this._onProfilePressed.bind(this, item)}
        onMainImagePressed={this._onMainImagePressed}
      />
    );
  }

  _onProfilePressed(item) {
    navigateToProfile(item.Account);
  }

  _onMainImagePressed = (item) => {
    navigateToPostDetail(item);
  }

  _showInfoModal = () => {
    this.setState({ showInfoModal: true });
  }

  _refreshFeed = () => {
    this.props.reloadFeedData(this.props.hashtag);
  }

  _refreshTop10Singit = () => {
    this.props.searchFriends(this.props.hashtag, 0, false, 10);
  }

  _navigateToOpenCalls = () => {
    const {renderFlashMessage, onContentSelected, navigator, clapitAccountData, fetchNetwork, fetchFeedData, searchFriends, reloadFeedData, preferences, setPreferences, unauthenticatedAction, visibleTab} = this.props

    navigator.push({ name: 'OpenCalls', onContentSelected, renderFlashMessage, clapitAccountData, fetchNetwork, fetchFeedData, searchFriends, reloadFeedData, preferences, setPreferences, unauthenticatedAction, visibleTab });
  }

  render() {
    const { showLoading, datasourceItems } = this.state;
    const { infoText, isMainFeed} = this.props;
    return (
      <div className='www' style={styles.container} >
        {(isMainFeed)?
            <div>
            </div>
            :
            <div>
            </div>
        }
        {datasourceItems.map((item, index) => this._renderRow(item, index))}

        { this.state.showInfoModal ?
            <ClapitModal infoText={infoText} showModal={this.state.showInfoModal} onClose={() => this.setState({showInfoModal:false})} />
            : null}

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  if (props.location && props.location.state) {
    props = {...props, ...props.location.state };
  }

  const { feed, clapitAccountData, friends } = state;
  const { items, itemsById, fetchingData, reloading, error, page } = feed;
  return {
    items, itemsById, fetchingData, reloading, error, clapitAccountData, page, friends, ...props
  };
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({ searchFriends }, feedActions);

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
    backgroundColor: 'white',
  },
  feedItem: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    resizeMode: 'contain',
    width: 240,
  },
  openCallImage: {
    resizeMode: 'contain',
    width: 70,
    position: 'absolute',
    right: 10,
  },
  openCallButton: {
    width: 100,
    position: 'absolute',
    right: 10,
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
