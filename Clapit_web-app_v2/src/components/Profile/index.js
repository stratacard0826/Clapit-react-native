/**
*
* Profile
*
*/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Tabs, Tab } from 'material-ui/Tabs';
import Helmet from 'react-helmet';
import PageContainer from '../../components/PageContainer';
import IconButton from 'material-ui/IconButton';
import { fetchProfileData, fetchProfileRecentPosts, fetchProfilePopularPosts } from '../../redux/actions/profile';
import { clapitLogout } from '../../redux/actions/clapit';
import {
    NETWORK_FOLLOWERS,
    NETWORK_FOLLOWING,
} from '../../redux/constants/NetworkTypes';
import { follow, unfollow } from '../../redux/actions/network';
import { navigateToPostDetail } from '../../utils/navigator';

import { browserHistory } from 'react-router';

import {
  PROFILE_POSTS_RECENT,
  PROFILE_POSTS_POPULAR,
} from '../../redux/constants/PostsTypes';
import { PROFILE_PHOTO, COVER_PHOTO } from '../../redux/constants/Constants';
import { MAX_PAGE_WIDTH, HEADER_HEIGHT } from '../../redux/constants/Size';
const width = MAX_PAGE_WIDTH;

import ProfileDetails from '../ProfileDetails';
import ProfileItem from '../ProfileItem';

import _ from 'lodash';

import { Colors, Images } from '../../themes';
import { CloudinaryVideoThumbnail } from '../../utils/utils';


class Profile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    let { accountId, recentPosts = { items: [], page: 0 }, currentUserFriendship } = props;


    const userFollowing = props.currentUserFriendship.items.indexOf(accountId);
    let following = (userFollowing > -1 ? true : false);

    this.state = {
      dataSourceItems: recentPosts.items || [],
      reloading: false,
      following,
      tabSelected: PROFILE_POSTS_RECENT,
    };
  }

  componentDidMount() {
    let {
      profile,
      recentPosts,
      popularPosts,
      accountId,
      fetchProfileData,
      fetchProfileRecentPosts,
      fetchProfilePopularPosts
    } = this.props;

    if (_.isEmpty(profile)) {
      // fetchProfileData(accountId);
    }

    if (_.isEmpty(recentPosts)) {
      // fetchProfileRecentPosts(accountId);
    }

    if (_.isEmpty(popularPosts)) {
      // fetchProfilePopularPosts(accountId);
    }
  }

  componentWillReceiveProps(nextProps) {
    let {
      accountId,
      clapitAccountData,
      profile,
      recentPosts = {},
      popularPosts = {},
      fetchProfileData,
      fetchProfileRecentPosts,
      fetchProfilePopularPosts } = nextProps;
    let { reloading } = this.state;

    if (_.isEmpty(profile)) {
      fetchProfileData(accountId);
    }

    if (_.isEmpty(recentPosts)) {
      fetchProfileRecentPosts(accountId);
    }

    if (_.isEmpty(popularPosts)) {
      fetchProfilePopularPosts(accountId);
    }
    const ownPost = accountId === clapitAccountData.id;

    this.setState({ ownPost });

    if (profile && reloading) {
      this.setState({ reloading: false });
    }

    // check to see if loaded next page
    // TODO: refactor into one method
    if (!_.isEmpty(recentPosts)) {
      let { page } = recentPosts;

      if (page === 0 || (this.props.recentPosts && page > this.props.recentPosts.page)) {
        this.loadingNextPage = false;
      }
    }
    if (!_.isEmpty(popularPosts)) {
      let { page } = popularPosts;

      if (page === 0 || (this.props.popularPosts && page > this.props.popularPosts.page)) {
        this.loadingNextPage = false;
      }
    }

    this._updateDataSource(this.state.tabSelected, recentPosts, popularPosts);
  }

  // called when componentWillReceiveProps (like additional pages), and when
  // user changes tabs
  _updateDataSource(tabSelected, recentPosts, popularPosts) {
    let items = tabSelected === PROFILE_POSTS_RECENT && recentPosts && recentPosts.items ? recentPosts.items
      : popularPosts && popularPosts.items ? popularPosts.items
        : []

    this.setState({
      tabSelected,
      dataSourceItems: items,
    });
  }

  _onFollowersPressed() {
    let { profile } = this.props;
    if (!profile || !profile.id) {
      return console.warn('profile not defined');
    }
    browserHistory.push({ pathname: `/followers/${profile.id}`, state: { resourceId: profile.id, type: NETWORK_FOLLOWERS } });
  }

  _onFollowingPressed() {
    let { profile } = this.props;
    if (!profile || !profile.id) {
      return console.warn('profile not defined');
    }
    browserHistory.push({ pathname: `/followings/${profile.id}`, state: { resourceId: profile.id, type: NETWORK_FOLLOWING } });
  }

  _onScroll(e) {
    // note here using this.loadingNextPage as setState has latency
    if (distanceFromEnd(e) < 200 && !this.loadingNextPage) {

      let { recentPosts, popularPosts } = this.props;
      let { tabSelected } = this.state;

      if (tabSelected === PROFILE_POSTS_RECENT && recentPosts) {
        let { items, page } = recentPosts
        this._loadNextPage('recent', items, page + 1)
      } else if (tabSelected === PROFILE_POSTS_POPULAR && popularPosts) {
        let { items, page } = popularPosts;
        this._loadNextPage('popular', items, page + 1);
      }
    }
  }

  _loadNextPage(type, items, nextPage) {
    if (items && items.length % 20 === 0) { // potentially a next page
      let { accountId, fetchProfileRecentPosts, fetchProfilePopularPosts } = this.props;

      this.loadingNextPage = true;

      if (type === 'recent') {
        fetchProfileRecentPosts(accountId, nextPage);
      } else if (type === 'popular') {
        fetchProfilePopularPosts(accountId, nextPage);
      }
    }
  }

  _renderRow = (item, index) => {
    let { tabSelected } = this.state;
    let { navigator } = this.props;

    let itemWidth = (width / 2) - (styles.detailsContainer.marginLeft + styles.detailsContainer.marginRight) - 0.5;
    let itemHeight = 0.75 * itemWidth - 1;

    const firstPopularPost = index === 0 && tabSelected === PROFILE_POSTS_POPULAR;
    if (firstPopularPost) {
      itemWidth = width - (styles.detailsContainer.marginLeft + styles.detailsContainer.marginRight) * 2;
      itemHeight = 200;
    }

    let medal = tabSelected === PROFILE_POSTS_POPULAR ? index : -1;

    return (
      <ProfileItem
        key={item.id}
        item={item}
        style={{ ...styles.profileItem, width: itemWidth, height: itemHeight }}
        medal={medal}
        isOddItem={index % 2 === 0}
        onPress={() => {
          navigateToPostDetail(item);
        }}
      />
    );
  }

  _refreshProfile = () => {
    this.setState({ reloading: true })
    let { accountId, fetchProfileData, fetchProfileRecentPosts, fetchProfilePopularPosts } = this.props;

    fetchProfileData(accountId);
    fetchProfileRecentPosts(accountId);
    fetchProfilePopularPosts(accountId);
  }

  _onChangeTab(tabName) {
    let { recentPosts, popularPosts, trackingSource } = this.props;

    this._updateDataSource(tabName, recentPosts, popularPosts);
  }

  _editImage(tabName) {
    browserHistory.push('/editprofile');
  }

  _onFollowPress() {
    const { clapitAccountData, profile: { id:profileUserId }, trackingSource } = this.props;
    if (this.state.following) {
      this.props.unfollow(profileUserId, clapitAccountData.id);
      this.setState({ following: false });
    } else {
      this.props.follow(profileUserId, clapitAccountData.id);
      this.setState({ following: true });
    }
  }

  render() {
    let {
      image,
      coverImage,
      username,
      profile = {},
      isMyProfile
    } = this.props;

    let {
        recentPosts,
        popularPosts,
        accountId,
        fetchProfileData,
        fetchProfileRecentPosts,
        fetchProfilePopularPosts,
        clapitAccountData,
        } = this.props;

    if (_.isEmpty(profile) && clapitAccountData.accessToken) {
      fetchProfileData(accountId);
    }

    if (_.isEmpty(recentPosts) && clapitAccountData.accessToken) {
      fetchProfileRecentPosts(accountId);
    }

    if (_.isEmpty(popularPosts) && clapitAccountData.accessToken) {
      fetchProfilePopularPosts(accountId);
    }

    let { tabSelected, reloading, dataSourceItems } = this.state;
    let coverIsVideo = (! /^.*(gif|jpg|jpeg|png)$/.test(coverImage));

    const coverMedia = coverIsVideo
      ? <img src={CloudinaryVideoThumbnail(coverImage)} style={styles.coverImage} />
      : <img src={coverImage} style={styles.coverImage} />
    console.log('~~~~Render', this.props)
    return (
      <div>
        {
        this.props.clapitAccountData && this.props.clapitAccountData.accessToken ?
        <div>
            <Helmet
                title="Profile"
                meta={[
            {name: 'description', content: 'Description of Profile'},
          ]}
                />
            <PageContainer>
              <div
                  style={styles.container}
                  onScroll={this._onScroll.bind(this)}
                  >
                <div style={{...styles.topBar}}>
                  <div style={styles.spacer}></div>
                  { !this.state.ownPost ?
                      (
                          <IconButton  style={styles.followButton} iconStyle={{height:30}} onClick={this._onFollowPress.bind(this)}>
                            <img src={this.state.following ? Images.btn_following : Images.btn_follow } style={{height:30}}/>
                          </IconButton>
                      )
                      :
                      null
                  }
                </div>
                {(coverImage && coverImage.trim()) ?
                    (isMyProfile) ?
                        <div
                            style={styles.coverImage}
                            onClick={this._editImage.bind(this, COVER_PHOTO)}>
                          {coverMedia}
                        </div>
                        : coverMedia
                    :
                    (isMyProfile) ?
                        <div
                            style={styles.coverImage}
                            onClick={this._editImage.bind(this, COVER_PHOTO)}>
                          <span style={{color: Colors.purple}}>Upload a Cover picture or video</span>
                        </div>
                        :
                        <img src={Images.default_cover_image} style={styles.coverImage}/>
                }
                <div style={styles.detailsContainer}>
                  <ProfileDetails
                      profile={profile}
                      username={username}
                      clapitAccountData={this.props.clapitAccountData}
                      isMyProfile={this.props.isMyProfile}
                      onFollowingPressed={() => this._onFollowingPressed()}
                      onFollowersPressed={() => this._onFollowersPressed()}
                      onPostPressed={() => this._onPostPressed()}/>

                  <Tabs
                      className="tabs_feed"
                      style={{ width: MAX_PAGE_WIDTH, margin: 'auto' }}
                      inkBarStyle={{ backgroundColor : Colors.purple}}
                      tabItemContainerStyle={{ backgroundColor :'inherit' }}
                      >
                    <Tab
                        label={'Recent'}
                        value={0}
                        style={styles.tab}
                        onActive={this._onChangeTab.bind(this, PROFILE_POSTS_RECENT)}
                        />
                    <Tab
                        label={'Popular'}
                        value={1}
                        style={styles.tab}
                        onActive={this._onChangeTab.bind(this, PROFILE_POSTS_POPULAR)}
                        />
                  </Tabs>
                  {dataSourceItems.map((item, index) => this._renderRow(item, index))}
                </div>
                {(isMyProfile) ?
                    <div
                        style={styles.profileImageContainer}
                        onClick={this._editImage.bind(this, PROFILE_PHOTO)}>
                      <img src={image} style={styles.profileImage}/>
                    </div>
                    :
                    <img src={image} style={{...styles.profileImage, ...styles.profileImageContainer}}/>
                }
              </div>
            </PageContainer>
        </div>
        : null
        }
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    marginTop: `${HEADER_HEIGHT}px`,
  },
  topBar: {
    height: 38,
    width: (width - 80),
    position: 'absolute',
    top: 20,
    left: 0,
  },
  closeButton: {
    paddingLeft: 10,
    paddingTop: 5,
    flex: 0.2,
  },
  spacer: {
    flex: 0.2,
  },
  followButton: {
    paddingRight: 0,
    paddingTop: 5,
    position: 'absolute',
    right: 20,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  tabs: {
    height: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  grid: {
    marginBottom: 50,
  },
  tabItem: {
    // fontWeight: 'bold',
    fontSize: 16,
    height: 25,
    color: '#000',
  },
  tabSelected: {
    // fontWeight: 'bold',
    // fontSize: 18 * RESP_RATIO,
    // color: '#B289FC',
  },
  gridContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  profileItem: {

  },
  profileImageContainer: {
    position: 'absolute',
    width: 0.34 * width,
    height: 0.34 * width,
    right: 15,
    top: 0.3 * width,
  },
  profileImage: {
    width: 0.34 * width,
    height: 0.34 * width,
    borderRadius: 0.17 * width,
  },
  coverImage: {
    backgroundColor: 'lightgray',
    width,
    height: 0.6 * width,
    padding: 0,
  },
  tab:{
    color:'black',
    textTransform: 'normal',
    fontSize: 16
  }
}

function stateToProps(state, props) {

  if (props.location && props.location.state) {
    props = { ...props, ...props.location.state };
  }
  const { accountId } = props;

  // state = state.toObject();
  const profile = state.profiles[accountId];
  const recentPosts = state.recentPosts[accountId];
  const popularPosts = state.popularPosts[accountId];
  const currentUserFriendship = state.friendship;

  return { clapitAccountData: state.clapitAccountData, profile, recentPosts, popularPosts, currentUserFriendship, ...props };
}


function dispatchToProps(dispatch) {
  const actions = Object.assign({}, { clapitLogout, fetchProfileData, fetchProfileRecentPosts, fetchProfilePopularPosts, follow, unfollow });

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(Profile);
