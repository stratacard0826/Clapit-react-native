/**
*
* NotificationItem
*
*/

import React from 'react';
import moment from 'moment';
import { Colors, Images, Styles } from '../../themes';
import { GetPreviewImageUrl } from '../../utils/utils';
import Parsed from '../Parsed';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';

class NotificationItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      following: false,
    };
  }

  componentDidMount() {
    const { item, currentUserFriendship } = this.props;
    if (currentUserFriendship) {
      const userFollowing = currentUserFriendship.items.indexOf(item.actorId);
      const following = (userFollowing > -1);
      this.setState({
        following,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item, currentUserFriendship } = nextProps;

    if (currentUserFriendship) {
      const userFollowing = currentUserFriendship.items.indexOf(item.actorId);
      const following = (userFollowing > -1);

      this.setState({
        following,
      });
    }
  }

  _onAvatarPress() {
    this.props.onUsernamePress(this.props.item.Actor);
  }

  _onUsernamePress(user) {
    this.props.onUsernamePress(user);
  }

  _onNotificationPress() {
    this.props.onNotificationPress(this.props.item);
  }

  _renderUserTag(match, matches) {
    // matches[1] contains tag without @ at the beginning
    const username = matches[0];
    let props = {};
    if (this.props.item.Actor) {
      props = {
        style: styles.username,
        onClick: this._onUsernamePress.bind(this, this.props.item.Actor),
      };
    }
    return (<span {...props}>{username}</span>);
  }

  _onFollowPress() {
    const { item } = this.props;
    if (this.state.following) {
      this.props.unfollow(item.actorId, item.accountId);
      this.setState({ following: false });
    } else {
      this.props.follow(item.actorId, item.accountId);
      this.setState({ following: true });
    }
  }
  render() {
    const { width, item } = this.props;
    // let notificationWidth = width * 0.65

    let rowImage = null;
    if (this.props.item.Post) {
      const imageUrl = GetPreviewImageUrl(item.Post, 'gif');

      rowImage =
        (
        <div style={{position: 'relative', float: 'right'}}>
          <img alt="" style={styles.notificationImage} src={imageUrl}/>
          { item.Post.videoURL && <img alt="" src={Images.ico_video} style={{...Styles.videoIcon,  top: 0, left: 0 }} />}
        </div>
        );
      // console.log('alert image', imageUrl)
    } else if (this.props.item.type === 'follow') {
      rowImage =
        (
          <div style={styles.followButton} onClick={this._onFollowPress.bind(this)}>
            <img alt="" src={this.state.following ? Images.btn_notifications_following : Images.btn_notifications_follow} style={{height: 40}}/>
          </div>
        );
    }

    let imageSource = '';

    let username = ' ';
    let actorImage = null;

    if (item && item.Actor && item.Actor.Media && item.Actor.Media.mediumURL) {
      username = item.Actor.username;

      actorImage = (
        <div onClick={this._onAvatarPress.bind(this)} style={{float: 'left'}}>
          <img alt="" src={item.Actor.Media.mediumURL || ' '} style={styles.avatar} />
        </div>
      );
    }

    let containerViewStyle = Object.assign({}, styles.container);

    if (item.isHighlighted) {
      containerViewStyle.backgroundColor = '#b1f5f1';
    }

    return (
      <div onClick={this._onNotificationPress.bind(this)}>
        <div style={containerViewStyle}>
          {actorImage}
          <div style={styles.notification}>
            <Parsed
              style={styles.text}
              parse={[{ pattern: new RegExp(username), renderText: this._renderUserTag.bind(this) }]}
            >
              {this.props.item.message}
            </Parsed>

            <span style={styles.daysAgo}>{moment(this.props.item.created).fromNow()}</span>
          </div>
          {rowImage}
          <div style={{clear: 'both'}}></div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottom: 'solid #CCC 1px'
  },
  avatar: {
    borderRadius: 25,
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#AAA',
    marginRight: 10,
  },
  notification: {
    float: 'left',
    width: MAX_PAGE_WIDTH - 150
  },
  text: {
    fontSize: 18,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.purple,
  },
  daysAgo: {
    color: '#AAA',
    fontSize: 10,
  },
  notificationImage: {
    height: 37.5,
    width: 50,
    marginRight: 10,
    border: `2px solid ${Colors.purple}`,
  },
  followButton: {
    paddingTop: 10,
    paddingRight: 10,
    float: 'right',
  },
};

export default NotificationItem;
