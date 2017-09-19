/**
*
* PostDetailReactionItem
*
*/

import React from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FeedItemActions from '../../redux/actions/feedItem';
import * as friendsActions from '../../redux/actions/friends';
import { Images } from '../../themes';
import _ from 'lodash';
import Parsed from '../Parsed';
import { navigateToSearch, navigateToProfile } from '../../utils/navigator';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

const ReactionType = {
  TEXT_ONLY: 1,
  IMAGE_ONLY: 2,
  TEXT_AND_IMAGE: 3,
};
const access = {
  owner: ['Delete', 'Edit'],
  user: ['Report Inappropriate Content'],
  postOwner: ['Delete'],
};

class PostDetailReactionItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.getType = this.getType.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderContentImage = this.renderContentImage.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.onDeleteItemOptionPressed = this.onDeleteItemOptionPressed.bind(this);
    // this.onItemPressed = this.onItemPressed.bind(this);
    this.state = {
      open: false,
    };
  }

  getType() {
    const { reaction: { mediaId, comment } } = this.props;
    return mediaId !== null ?
      (_.isEmpty(comment) === false ? ReactionType.TEXT_AND_IMAGE : ReactionType.IMAGE_ONLY) :
      ReactionType.TEXT_ONLY;
  }

  getReactionAuthorAvatar() {
    const { reaction } = this.props;

    // return post.topReaction.Account && post.topReaction.Account.Media && post.topReaction.Account.Media.mediumURL;
    return reaction.Account && reaction.Account.Media && reaction.Account.Media.mediumURL || ' ';
  }

  getReactionAuthorUsername() {
    const { reaction } = this.props;

    return reaction.Account && reaction.Account.username;
  }

  getReactionComment() {
    const { reaction } = this.props;

    return reaction.comment;
  }

  onDeleteItemOptionPressed() {
    const { post: { Account: { id: postUserId } }, reaction, profile: { id: userId }, deleteReaction } = this.props;
    deleteReaction(reaction, userId === postUserId);
  }

  onReportPostOptionPressed() {
    const { post, navigator, reportInappropriateItem } = this.props;
    reportInappropriateItem(post);
    // navigator.pop();
  }

  onEditReactionPressed() {
    const { reaction, onEditReaction } = this.props;
    onEditReaction(reaction);
  }

  /* onItemPressed = () => {
    const { post: { Account: { id: postUserId } }, reaction: { Account: { id:reactionUserId } }, profile: { id:userId } } = this.props;

    const access = {
      owner: ['Delete', 'Edit', 'Cancel'],
      user: ['Report Inappropriate Content', 'Cancel'],
      postOwner: ['Delete', 'Cancel'],
    };

    const doNothing = () => {};

    const actions = {
      'Delete': () => {
        const msg = userId === postUserId
          ? 'Are you sure you want to remove this comment?'
          : 'Are you sure you want to delete your reaction?';
        Alert.alert('Delete', msg, [
          {
            text: 'Cancel', onPress: doNothing, style: 'cancel',
          },
          { text: 'Delete', onPress: this.onDeleteItemOptionPressed.bind(this) },
        ]);
      },
      'Edit': () => {
        this.onEditReactionPressed();
      },
      'Report Inappropriate Content': () => {

      },
      'Cancel': doNothing,
    }

    const options = userId === reactionUserId ? access.owner
      : userId === postUserId ? access.postOwner
        : access.user

    ActionSheetIOS.showActionSheetWithOptions({
        options,
        cancelButtonIndex: options.indexOf('Cancel'),
        destructiveButtonIndex: options.indexOf('Delete'),
      },
      (buttonIndex) => {
        actions[options[buttonIndex]]();
      });

  }; */

  onAuthorPressed() {
    const { reaction } = this.props;
    navigateToProfile(reaction.Account);
  }

  onTagPress(tag, type) {
    const { navigator, searchFriends } = this.props;
    searchFriends(tag, 0);
    navigateToSearch(type, tag);
  }

  renderContentImage(type) {
    const { reaction: { mediaId } } = this.props;

    if (!mediaId) {
      return null;
    }

    // const contentImageWidth = type == ReactionType.TEXT_AND_IMAGE ? this.props.width * 0.4 : this.props.width * 0.7
    const contentImageWidth = this.props.width * 0.4;
    const imageUrl = this.props.reaction.Media && this.props.reaction.Media.mediumURL;

    return (
      <div style={{ width: contentImageWidth, height: contentImageWidth, alignSelf: 'center' }}>
        <img
          alt=""
          style={{ ...styles.reactionImage, width: contentImageWidth, height: contentImageWidth }}
          src={imageUrl}
        />
        <img
          alt=""
          style={{ ...styles.reactionOverlay, width: contentImageWidth, height: contentImageWidth }}
          src={Images.ico_avatar_overlay}
        />
      </div>
    );
  }

  _renderUserTag(match, matches) {
    // matches[1] contains tag without @ at the beginning
    const username = matches[1];
    const isExistingUser = this.props.post.UserTags.find(userTag => userTag.Account.username === username)
      || this.props.addedUserTags.find(userTag => userTag === username || userTag.slice(1) === username);
    const props = isExistingUser ? {
      style: styles.tag,
      onPress: this.onTagPress.bind(this, username, 'user'),
    } : {};
    return (<span {...props}>@{username}</span>);
  }

  _renderHashTag(match, matches) {
    // matches[1] contains tag without hash at the beginning
    let hash = matches[1];
    hash = `#${hash}`;
    return (<span style={styles.tag} onClick={this.onTagPress.bind(this, hash, 'hashtag')}>{hash}</span>);
  }
  handleChangeSingle = (event, value) => {
    const { post: { Account: { id: postUserId } }, reaction: { Account: { id: reactionUserId } }, profile: { id: userId } } = this.props;

    const doNothing = () => {};
    const actions = {
      'Delete': () => {
        console.log('Delete');
        this.setState({ open: true });
        /* const msg = userId === postUserId
            ? 'Are you sure you want to remove this comment?'
            : 'Are you sure you want to delete your reaction?';
         Alert.alert('Delete', msg, [
          {
            text: 'Cancel', onPress: doNothing, style: 'cancel',
          },
          { text: 'Delete', onPress: this.onDeleteItemOptionPressed.bind(this) },
        ]); */
      },
      'Edit': () => {
        console.log('Edit');
        this.onEditReactionPressed();
      },
      'Report Inappropriate Content': () => {
        console.log('Report Inappropriate Content');
        // this.setState({ open: true });
      },
      'Cancel': doNothing,
    };
    const options = userId === reactionUserId ? access.owner
        : userId === postUserId ? access.postOwner
        : access.user;
    actions[options[value]]();
  };
  renderMenuItemRow(item, row) {
    return (
      <MenuItem key={`reactionItem${row}`} value={row.toString()} primaryText={item} />
    );
  }
  handleCloseDialog() {
    this.setState({ open: false });
  }
  renderItem() {
    const { post: { Account: { id: postUserId } }, reaction: { Account: { id: reactionUserId } }, profile: { id: userId } } = this.props;
    const options = userId === reactionUserId ? access.owner
        : userId === postUserId ? access.postOwner
        : access.user;
    const msg = userId === postUserId
        ? 'Are you sure you want to remove this comment?'
        : 'Are you sure you want to delete your reaction?';

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label="Delete"
        primary
        onTouchTap={() => { this.handleCloseDialog(); this.onDeleteItemOptionPressed(); }}
      />,
    ];

    const type = this.getType();
    const authorUrl = this.getReactionAuthorAvatar();
    return (
      <div style={styles.container}>
        <div style={styles.reactionContainer}>
          <div style={{}}>
            <FlatButton onClick={this.onAuthorPressed.bind(this)} style={{ height: 'initial', padding: 10 }}>
              <div >
                {(authorUrl) ? <img alt="" src={authorUrl} style={styles.avatar} /> : null}
                <span style={styles.username}>{this.getReactionAuthorUsername()}</span>
              </div>

            </FlatButton>
            <div>
              <Parsed
                style={styles.contentText}
                parse={[{ pattern: /#(\w+)/, renderText: this._renderHashTag.bind(this) },
                        { pattern: /@(\w+)/, renderText: this._renderUserTag.bind(this) }]}
              >
                {this.getReactionComment()}
              </Parsed>
            </div>
          </div>
          {this.renderContentImage(type)}
        </div>
        <IconMenu
          style={{ float: 'right' }}
          iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onChange={this.handleChangeSingle}
        >
          { options.map((item, index) => this.renderMenuItemRow(item, index)) }
        </IconMenu>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleCloseDialog}
        >
          {msg}
        </Dialog>

        {
          //
          // <button stlye={{ height: 45, width: 45 }} onClick={this.onItemPressed}>
          //  <span style={styles.commentOptions}>...</span>
          // </button>
        }

      </div>
    );
  }


  render() {
    const { reaction: { Account: { id: reactionUserId } }, profile: { id: userId } } = this.props;

    return this.renderItem();
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  profileContainer: {
    flex: 0.25,
    flexDirection: 'column',
    alignItems: 'center',
  },
  reactionContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
  },
  reactionHeader: {
    flex: 1,
    flexDirection: 'row',
    height: 25,
  },
  reactionContent: {
    flexDirection: 'row',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileText: {
    marginTop: 10,
    width: 50,
  },
  reactionTitle: {
    flex: 0.3,
    borderBottomWidth: 2,
    borderBottomColor: '#B385FF',
  },
  reactionTime: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  reactionTitleText: {
    color: '#B385FF',
  },
  reactionTimeText: {
    color: '#8E8E8E',
    marginLeft: 5,
    fontSize: 12,
  },
  reactionImage: {
    position: 'absolute',
  },
  reactionOverlay: {
    position: 'absolute',
  },
  contentImage: {
    borderColor: '#B385FF',
    flex: 0.3,
    resizeMode: 'contain',
    borderWidth: 2,
  },
  contentText: {
    color: '#AAA',
    fontSize: 14,
    marginLeft: 5,
    marginRight: 5,
  },
  tag: {
    color: '#B385FF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#AAA',
  },
  username: {
    fontSize: 14,
    marginLeft: 10,
  },
  commentOptions: {
    color: '#B385FF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 30,
    width: 30,
  },
};

function stateToProps(state) {
  const { reactions } = state;

  return { reactions };
}

function dispatchToProps(dispatch) {
  const actions = _.extend({}, FeedItemActions, friendsActions);

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(PostDetailReactionItem);
