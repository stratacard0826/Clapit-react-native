/*
 *
 * AlertsPage
 *
 */

import React from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ReactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import _ from 'lodash';
import NotificationItem from '../../components/NotificationItem';
import PageContainer from '../../components/PageContainer';

import * as notificationsActions from '../../redux/actions/notifications';
import { follow, unfollow } from '../../redux/actions/network';

import { MAX_PAGE_WIDTH, HEADER_HEIGHT } from '../../redux/constants/Size';
import { Images, Colors } from '../../themes';
import { navigateToProfile, navigateToPostDetail } from '../../utils/navigator';

const width = MAX_PAGE_WIDTH;

export class AlertsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      dataSource: props.items,
      // scroll: new Animated.Value(0),
      showLoading: true,
      follow: props.follow,
      unfollow: props.unfollow,
      currentUserFriendship: props.currentUserFriendship,
    };
  }

  componentDidMount() {
    const { clapitAccountData } = this.props;
    if (!_.isEmpty(clapitAccountData)) {
      this.props.fetchNotifications(clapitAccountData.id, 0);
    }
    //this.setTimeout(() => {
    //  this._refreshAndRestart();
    //}, 60000);
  }

  componentWillReceiveProps(nextProps) {
    const { items, notifications = {}, newNotifications: { itemIds, lastItemId }, clapitAccountData } = nextProps;
    const { fetchingData } = notifications
    this.itemsChanged = (nextProps.currentUserFriendship.items.length !== this.props.currentUserFriendship.items.length);
    this.setState({
      currentUserFriendship: nextProps.currentUserFriendship,
    });

    if (items.length > 0) {
      this.setState({
        dataSource: nextProps.items,
      });
    } else if (items.length === 0 && !fetchingData) {
      this.setState({
        // showLoading: false,
      });
    }
    if (_.isEmpty(this.props.clapitAccountData) && !_.isEmpty(clapitAccountData)) {
      this.props.fetchNotifications(clapitAccountData.id, 0);
    }

    // check if we should show notification dot
    if (this.props.newNotifications.lastItemId !== lastItemId && itemIds.length) {
      this.props.showNotificationDot();
    }
  }

  componentWillUnmount() {
  }

  _refreshAndRestart() {
    this._refreshNotifications();

    //this.setTimeout(() => {
    //  this._refreshAndRestart();
    //}, 60000);
  }

  _renderSeparator(sectionID, rowID) {
    return <div key={`${sectionID}-${rowID}`} style={styles.separator}></div>;
  }

  _renderRow(item, section, row) {
    if (this.hideLoadingTimer) {
      this.clearTimeout(this.hideLoadingTimer);
    }
    this.hideLoadingTimer = this.setTimeout(() => {
      if (this.state.showLoading) {
        this.setState({ showLoading: false });
      }
    }, 100);

    return (
      <NotificationItem
        key={item.id}
        item={item}
        currentUserFriendship={this.state.currentUserFriendship}
        notifications={this.state.notifications}
        follow={this.state.follow}
        unfollow={this.state.unfollow}
        onAvatarPress={this._onAvatarPress.bind(this)}
        onUsernamePress={this._onUsernamePress.bind(this)}
        onNotificationPress={this._onNotificationPress.bind(this)}
        width={width}
      />
    );
  }

  _onAvatarPress(item) {
    this._showProfile(item);
  }

  _onUsernamePress(item) {
    this._showProfile(item);
  }
  _onNotificationPress(item) {
    const { id: notificationId } = item;

    this.props.markNotificationOld(notificationId); // mark as viewed

    if (item.Post) {
      // navigator.push({ name: 'PostDetails', post: item.Post });
      navigateToPostDetail(item.Post);
    } else if (item.Actor) {
      this._onUsernamePress(item.Actor);
    }
  }

  _showProfile(item) {
    const {
        Media,
        CoverMedia,
        id,
        username
        } = item;
    const image = (Media) ? Media.mediumURL : null || ' ';
    const coverImage = (CoverMedia) ? CoverMedia.mediumURL : ' ';
    navigateToProfile(item);
  }

  _refreshNotifications() {
    const { clapitAccountData } = this.props;
    if (_.isEmpty(clapitAccountData)) {
      return false;
    }
    this.props.reloadNotificationsData(clapitAccountData.id);
  }

  render() {
    const { showLoading } = this.state;
    const { items } = this.props;
    return (
      <div>
        <Helmet
          title="AlertsPage"
          meta={[
            { name: 'description', content: 'Description of AlertsPage' },
          ]}
        />
        <PageContainer>
          <div style={styles.container} >
            {(items && items.length) ?
              items.map((item, index, row) => this._renderRow(item, index, row))
              : <div style={[styles.list, { alignItems: 'center', justifyContent: 'center' }]}><span style={styles.noAlertsText}>see who's been clapping you</span></div>}
          </div>
        </PageContainer>
      </div>
    );
  }
}

ReactMixin(AlertsPage.prototype, TimerMixin);

const styles = {
  container: {
    marginTop: `${HEADER_HEIGHT}px`,
  },
  list: {
    marginBottom: 50,
    backgroundColor: 'white',
    paddingTop: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    marginLeft: 15,
    marginRight: 15,
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    resizeMode: 'contain',
  },
  noAlertsText: {
    fontSize: 24,
    color: Colors.purple,
    textAlign: 'center',
  },
}

function stateToProps(state) {
  const { notifications, newNotifications, clapitAccountData } = state;

  // mark items as highlighted
  let { items = {} } = notifications;
  const { itemIds = [] } = newNotifications;
  const currentUserFriendship = state.friendship;

  if (items.length) {
    items = items.slice();

    items = items.map((item) => {
      if (itemIds.indexOf(item.id) > -1) {
        return { ...item, isHighlighted: true };
      }
      return item;
    });
  }

  return { items, notifications, newNotifications, clapitAccountData, currentUserFriendship };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, { ...notificationsActions, follow, unfollow });

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(AlertsPage);
