/**
*
* NetworkItem
*
*/

import React from 'react';
import Images from '../../themes/Images';

class NetworkItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _onAvatarPress() {

  }

  _onFollowPress(item) {
    this.props.onFollowPressed(item);
  }

  _onProfilePress(item) {
    this.props.onProfilePressed(item);
  }
  render() {
    const { item, allowFollow } = this.props;

    let avatar = null;
    if (item.Media) {
      avatar = (
        <div onClick={this._onAvatarPress.bind(this)}>
          <img alt="" src={item.Media && item.Media.mediumURL || ' '} style={styles.avatar} />
        </div>
      );
    }

    let followButton = null;
    if (allowFollow) {
      followButton = (
        <div style={styles.followButton} onClick={this._onFollowPress.bind(this, item)}>
          <img
            alt=""
            style={styles.followImage}
            src={!item.following ? Images.profileFollow : Images.profileFollowing}
          />
        </div>
      );
    }

    let feedItemInfo = null;
    if (item.friendCount) {
      feedItemInfo = (<div style={styles.feedItemInfo}>
        <div style={styles.clapLabel}>
          <span style={styles.clapCount}>{item.friendCount}</span>
          <span style={styles.clapText}> Friends on Clapit</span>
        </div>
      </div>);
    } else {
      feedItemInfo = (<div style={styles.feedItemInfo}>
        <div style={styles.clapLabel}>
          <span style={styles.clapCount}>{item.clapCount}</span>
          <span style={styles.clapText}> Claps</span>
        </div>
        <div style={styles.reactLabel}>
          <span style={styles.reactCount}>{item.commentCount}</span>
          <span style={styles.reactText}> Reactions</span>
        </div>
      </div>);
    }

    return (

        <div style={{...this.props.style, ...styles.container}} >
          <div style={{...styles.subcontainer}} onClick={this._onProfilePress.bind(this, item)}>
            {avatar}
            <div style={styles.avatarInfo}>
              <div style={styles.username}>{item.username}</div>
              {feedItemInfo}
            </div>
          </div>
          {followButton}
        </div>

    );
  }
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    marginTop: 5,
    paddingLeft: 10,
    marginBottom: 5,
    borderBottom: 'solid #CCC 1px'
  },
  subcontainer: {
    width: '90%',
  },
  avatar: {
    borderRadius: 25,
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#AAA',
    float: 'left'
  },
  avatarInfo: {
    float: 'left',
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  feedItemInfo: {
    float: 'left',
    justifyContent: 'center',
    paddingRight: 10,
  },
  clapLabel: {
    float: 'left'
  },
  clapText: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'right',
  },
  clapCount: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    textAlign: 'right',
  },
  reactLabel: {
    paddingLeft: 10,
    float: 'left'
  },
  reactText: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'right',
  },
  reactCount: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    textAlign: 'right',
  },
  followButton: {
    paddingRight: 5,
  },
  followImage: {
    height: 50,
    width: 50,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    height: 1,
    backgroundColor: '#CCC',
    marginLeft: 15,
    marginRight: 15
  },
};

export default NetworkItem;
