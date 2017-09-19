/*
 *
 * PostDetailsPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';
import * as networkActions from '../../redux/actions/network';
import * as feedItemActions from '../../redux/actions/feedItem';
import * as friendsActions from '../../redux/actions/friends';


import { reloadUserPosts } from '../../redux/actions/app';
import { uploadToCloudinary, createMedia, updatePost } from '../../redux/actions/api';
import PostProfile from '../../components/PostProfile';
import PostReaction from '../../components/PostReaction';
import PostClapsIconCounter from '../../components/PostClapsIconCounter';
import PostCommentsIconCounter from '../../components/PostCommentsIconCounter';
import PostDetailReactionItem from '../../components/PostDetailReactionItem';
import TagAutocompleteInput from '../../components/TagAutocompleteInput';
import Parsed from '../../components/Parsed';
import PageContainer from '../../components/PageContainer';
import { ShareButton } from '../../utils/utils';
import { Colors, Images } from '../../themes';
import { MAX_PAGE_WIDTH, HEADER_HEIGHT } from '../../redux/constants/Size';
import { browserHistory } from 'react-router';
import { navigateToSearch } from '../../utils/navigator';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

const width = MAX_PAGE_WIDTH;

const access = {
  postOwner: ['Delete', 'Edit'],
  user: ['Report Inappropriate Content'],
};
export class PostDetailsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)

    const reactions = props.reactions.reactionsByPostId[props.post.id] || [];
    const userFollowing = props.friendship.items.indexOf(props.post.Account.id);


    let following = (userFollowing > -1 ? true : false);

    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this._onDeletePostOptionPressed = this._onDeletePostOptionPressed.bind(this);
    this._onReportPostOptionPressed = this._onReportPostOptionPressed.bind(this);
    this.state = {
      open: false,
      dataSourceItems: reactions,
      contentOffset: 0,
      uploadImagePath: null,
      uploadedImageUrl: null,
      uploadInProgress: false,
      saveWhenDoneUploading: false,
      mediaId: null,
      following,
      cameraAuthorized: false,
      showLoading: false,
      pausedVideo: false,
      repeatVideo: true,
      mutedVideo: false,
      contentHeight: 0,
      editModalVisible: false,
      editTitleValue: '',
      showFlashOverlay: false,
      addedUserTags: [],
    }

    this.doubleTap = 0
    this.openPost; //for double tap
    this.clapFunc = [];
  }

  componentWillReceiveProps(nextProps) {
    const { post } = this.props;
    const reactions = nextProps.reactions.reactionsByPostId[post.id] || [];
    const following = nextProps.friendship.items.indexOf(post.Account.id) > -1;
    const ownPost = nextProps.profile.id === post.Account.id;
    this.setState({
      dataSourceItems: reactions,
      following,
      ownPost,
    });

    if (nextProps.reactions.reactionCreated) {
      this.props.fetchItemReactions(post.id);
      this.setState({ showLoading: false, uploadImagePath: null, mediaId: null, uploadedImageUrl: null });
    }
  }

  componentDidMount() {
    const { post } = this.props;
    this.props.fetchItemReactions(post.id);
  }

  _imageSelected = (image, video, textComment) => {
    const path = image.indexOf('file://') === 0 ? image.substring('file://'.length) : image;
    // upload!
    this.setState({
      uploadImagePath: path,
      uploadInProgress: true,
    })

    uploadToCloudinary('image', `file://${path}`, (err, res) => {
      if (err || res.status !== 200) {
        Alert.alert(
          'Upload', 'We were unable to upload your image just now.  Would you like to try again?',
          [
            {
              text: 'No',
              onPress: () => {
                this.setState({ uploadInProgress: false, uploadImageUrl: null });
              },
              style: 'cancel',
            },
            {
              text: 'Yes', onPress: () => {
              this._imageSelected(path);
            },
            }
          ]
        )
        return false;
      }

      let { data } = res;
      data = JSON.parse(data);
      const { url } = data;

      // console.log(`url: ${url}`)

      this.setState({
        uploadInProgress: false,
        uploadedImageUrl: url,
      })
      this._onPostReaction({ comment: textComment || '', imageUrl: url });
    });
  }

  _getCommentCount() {
    const { post } = this.props;
    return post.commentCount || 0;
  }

  _onTakeReactionPhoto() {
    //todo implement popup
  }

  _onPostReaction = ({ comment, imageUrl, reaction }) => {
    const { createItemReaction, updateItemReaction, post, profile, reloadUserPosts } = this.props;
    if (comment) {
      const addedUserTags = this.state.addedUserTags.concat(comment.match(/@(\w+)/g));
      this.setState({ addedUserTags });
    }

    let { mediaId, uploadedImageUrl } = this.state;
    uploadedImageUrl = uploadedImageUrl || imageUrl;
    const reloadPost = () => {
      setTimeout(() => {
        reloadUserPosts(post.Account.id);
      }, 1000);
    };

    this.setState({ showLoading: true });

    if (reaction) { // updating existing reaction
      updateItemReaction(post.id, reaction.id, comment);
      this.setState({ reaction: null });
      reloadPost();
    } else if (uploadedImageUrl) { // new image
      createMedia(uploadedImageUrl)
        .then((data) => {
          if (data.error) { // TODO
            this.setState({ saveWhenDoneUploading: false });
            return;
          }

          ({ id: mediaId } = data);

          this.setState({ mediaId });
          createItemReaction(post, profile.id, mediaId, comment);
          reloadPost();
        });
    } else {
      createItemReaction(post, profile.id, mediaId, comment);
      reloadPost();
    }
  };

  _onDeletePostOptionPressed() {
    const { post, deleteItem } = this.props;
    deleteItem(post);
    browserHistory.goBack();
  }

  _onReportPostOptionPressed() {
    const { post, reportInappropriateItem } = this.props;
    reportInappropriateItem(post);
    browserHistory.goBack();
  }

  /* _onShowPostOptionsPressed() {
    const { post } = this.props;
    if (post.Account.id === this.props.profile.id) {
      ActionSheetIOS.showActionSheetWithOptions({
          options: ['Delete', 'Edit', 'Cancel'],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 0
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            Alert.alert('Delete', 'Are you sure you want to delete your post?', [
              {
                text: 'Cancel', onPress: () => {
              }, style: 'cancel',
              },
              { text: 'Delete', onPress: this._onDeletePostOptionPressed.bind(this) },
            ]);
          } else if (buttonIndex === 1) {
            // console.log('post', post, this)
            this.setState({ editModalVisible: true });
          }
        });
    } else {
      ActionSheetIOS.showActionSheetWithOptions({
          options: ['Report Inappropriate Content', 'Cancel'],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            Alert.alert('Report Inappropriate Content', 'Are you sure you want to report this content?', [
              {
                text: 'Cancel',
                onPress: () => {
                },
                style: 'cancel',
              },
              {
                text: 'Report Inappropriate Content',
                onPress: this._onReportPostOptionPressed.bind(this),
              },
            ]);
          }
        });
    }
  } */

  _onImagePress() {
    this.doubleTap += 1

    if (this.doubleTap === 1) {
      this.openPost = setTimeout(() => {
        this.doubleTap = 0;
        const { post } = this.props;
        const { url } = post;
        browserHistory.push(url);
      }, 300);
    } else if (this.doubleTap === 2) {
      clearTimeout(this.openPost);
      this.doubleTap = 0;
      this.clapFunc.map((f) => f());
    }
  }

  _renderContents() {
    const { post } = this.props;

    if (post.urlType === 'video' && post.videoURL) {
      if (post.videoURL.includes('youtu')) {
        let src = `
                 <!DOCTYPE html>\n
                 <html>
                 <head>
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 </head>
                 <body style="margin: 0">
                 <embed src="${post.videoURL}" width="${width}" height="${0.75 * width}"></embed>
                 </body>
                 `
        return <iframe
          src={src}
          style={{ width, height: width }}
        />
      } else {
        const {mutedVideo, pausedVideo} = this.state;
        const imgSource = mutedVideo ? Images.ico_mute : Images.ico_unmute;
        return (
          <div style={{width, height: this.state.contentHeight || 0.75 * width, position: 'relative'}}>
            <FlatButton style={{ padding: 0, height: 'initial' }} onClick={this._replayVideo}>
              <video src={post.videoURL}
                     autoPlay={true}
                     paused={pausedVideo}
                     muted={mutedVideo}
                     style={{ height: this.state.contentHeight || 0.75 * width, width}} />
            </FlatButton>
            <FlatButton style={{ ...styles.muteButtonContainer, height: 'initial'}}  onClick={this._toggleMute}>
              <img src={imgSource} style={styles.muteButton} />
            </FlatButton>
          </div>
        )
      }
    } else {
      return (
        <FlatButton onClick={this._onImagePress.bind(this)} style={{ padding: 0, height: 'initial' }}>
          <img src={post.Media && post.Media.mediumURL || ' '} style={{ width, height: this.state.contentHeight || 0.75 * width }} />
        </FlatButton>
      );
    }
  }

  _toggleMute = () => {
    this.setState({ mutedVideo: !this.state.mutedVideo });
  }

  _replayVideo = () => {
    this.setState({ pausedVideo: !this.state.pausedVideo });
  }

  _onEditReaction = (reaction) => {
    if (reaction && reaction.comment) {
      const addedUserTags = this.state.addedUserTags.concat(reaction.comment.match(/@(\w+)/g));
      this.setState({ addedUserTags });
    }
    this.refs.postReaction.setReaction(reaction);
  };

  _storeClapFunc = (fn) => {
    this.clapFunc.push(fn);
  }
  handleChangeSingle = (event, value) => {
    const { post: { Account: { id: postUserId } }, profile: { id: userId } } = this.props;

    const doNothing = () => {};
    const actions = {
      'Delete': () => {
        console.log('Delete');
        this.setState({ open: true });
      },
      'Edit': () => {
        console.log('Edit');

      },
      'Report Inappropriate Content': () => {
        console.log('Report Inappropriate Content');
        this.setState({ open: true });
      },
      'Cancel': doNothing,
    };
    const options = userId === postUserId ? access.postOwner
        : access.user;
    actions[options[value]]();
  };
  renderMenuItemRow(item, row) {
    return (
      <MenuItem key={`postDetails${row}`} value={row.toString()} primaryText={item} />
    );
  }
  handleCloseDialog() {
    this.setState({ open: false });
  }
  _renderPost = () => {
    const { post } = this.props;

    const options = post.Account.id === this.props.profile.id ? access.postOwner : access.user;
    const msg = post.Account.id === this.props.profile.id
        ? 'Are you sure you want to delete your post?'
        : 'Are you sure you want to report this content?';
    const actionRight = post.Account.id === this.props.profile.id
        ? <FlatButton
          key="Delete"
          label="Delete"
          primary
          onTouchTap={() => { this.handleCloseDialog(); this._onDeletePostOptionPressed(); }}
        />
        : <FlatButton
          key="Report"
          label="Report"
          primary
          onTouchTap={() => { this.handleCloseDialog(); this._onReportPostOptionPressed(); }}
        />;
    const actions = [
      <FlatButton
        key="Cancel"
        label="Cancel"
        primary
        onTouchTap={this.handleCloseDialog}
      />,
      actionRight,
    ];

    return (
      <div>
        <PostProfile
          post={post}
          profile={post.Account}
          publishTime={post.publishTime}
        />
        <div style={{ marginTop: 5, height: 1, backgroundColor: '#F0F0F0' }} />
        <div style={{ width }}>
          {this._renderContents()}
        </div>
        {
          // <button style={{...styles.postOptions, top:(this.state.contentHeight)? this.state.contentHeight + 10 : 0.75 * width + 10}}
          //        onClick={this._onShowPostOptionsPressed.bind(this)}>
          //  <span style={styles.postOptionsText}>...</span>
          // </button>
        }
        <IconMenu
          style={{...styles.postOptions, top: (this.state.contentHeight) ? (this.state.contentHeight + 10) : (0.75 * width + 10) }}
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
        <div style={styles.postInfoContainer}>

          {(! post.featured) ?
            <PostClapsIconCounter
              post={post}
              onClap={this._onClap}
              storeClapFunc={this._storeClapFunc}
            />
            : null}

          {(! post.featured) ?
            <PostCommentsIconCounter
              post={post}
              disableCounterPress
            />
            : null}
          <ShareButton post={post} style={styles.shareButton} />
          <div style={{ height: 40 }}></div>
        </div>
        <Parsed style={styles.postText} parse={[
          {pattern: /#(\w+)/, renderText: this._renderHashTag.bind(this)},
          {pattern: /@(\w+)/, renderText: this._renderUserTag.bind(this)},
        ]}>
          {this.state.editTitleValue || post.title}
        </Parsed>
        <span style={styles.commentsCountText}>{this._getCommentCount()} reactions</span>
      </div>
    );
  }

  _renderRow(reaction, section, row) {
    const { post, profile } = this.props;
    // console.log('rendering reaction with ', post)
    return (
      <PostDetailReactionItem
        width={width}
        reaction={reaction}
        onEditReaction={this._onEditReaction}
        post={post}
        addedUserTags={this.state.addedUserTags}
        profile={profile}
      />
    );
  }

  _renderUserTag(match, matches) {
    // matches[1] contains tag without @ at the beginning
    const username = matches[1];
    const isExistingUser = this.props.post.UserTags.find((userTag) => userTag.Account.username === username)
      || this.state.addedUserTags.find(userTag => userTag === username || userTag.slice(1) === username);
    let props = isExistingUser ? {
        style: styles.tag,
        onPress: this._onTagPress.bind(this, username, 'user'),
      } : {};
    return (<span {...props}>@{username}</span>);
  }

  _renderHashTag(match, matches) {
    // matches[1] contains tag without hash at the beginning
    let hash = matches[1];
    hash = `#${hash}`;
    return (<span style={styles.tag} onClick={this._onTagPress.bind(this, hash, 'hashtag')}>{hash}</span>);
  }

  _onTagPress(tag, type) {
    const { searchFriends } = this.props;
    searchFriends(tag, 0);
    navigateToSearch(type, tag);
  }

  _onFollowPress() {
    const { post, profile: { id: userId } } = this.props;
    if (this.state.following) {
      this.props.unfollow(post.Account.id, userId);
      this.setState({ following: false });
    } else {
      this.props.follow(post.Account.id, userId);
      this.setState({ following: true });
    }
  }

  _onEditTitleValueChange = (e) => {
    const { text: value } = e.nativeEvent;
    this.setState({ editTitleValue: value });
  };


  _getBackgroundColor(clapCount) {
    if (clapCount >= 50) {
      return Colors.purple;
    } else if (clapCount >= 10) {
      return Colors.aqua;
    }
    return Colors.blue;
  }

  _onEditTitleSubmit = () => {
    const { post, navigationState } = this.props;
    let addedUserTags = this.state.addedUserTags.concat(this.state.editTitleValue.match(/@(\w+)/g));
    this.setState({ editModalVisible: false, addedUserTags });

    updatePost(post.id, { title: this.state.editTitleValue })
      .then((res) => {
        navigationState.routes[navigationState.routes.length-1].refreshProfile()
      }).catch((err) => {
      console.log('err', err);
    });
  };

  render() {
    let { post, profile } = this.props;
    let { dataSourceItems } = this.state;

    return (
      <div>
        <Helmet
          title="PostDetailsPage"
          meta={[
            { name: 'description', content: 'Description of PostDetailsPage' },
          ]}
        />
        <PageContainer>
          <div style={styles.container}>
            <div style={{...styles.topBar, width}}>

              <div style={styles.spacer}></div>

              { !this.state.ownPost ?
                (
                  <IconButton iconStyle={{height:30}} style={styles.followButton} onClick={this._onFollowPress.bind(this)}>
                    <img alt="" src={this.state.following ? Images.btn_following : Images.btn_follow} style={{ height: 30 }} />
                  </IconButton>
                )
                :
                null
              }
            </div>
            <div>
              {this._renderPost()}
              {(!post.featured) ?
                <PostReaction
                  profile={profile}
                  reactionImage={this.state.uploadImagePath}
                  style={{ height: 60, marginTop: 10, marginBottom: 10 }}
                  contentOffset={this.state.contentOffset}
                  onTakeReactionPhoto={this._onTakeReactionPhoto.bind(this)}
                  onPostReaction={this._onPostReaction}
                  ref="postReaction"
                />
                : null}
              {dataSourceItems.map((item) => this._renderRow(item))}

              <Dialog
                ref="editModal"
                modal={true}
                title={'Edit Description'}
                open={this.state.editModalVisible}
              >
                <div style={{ flex: 1, marginTop: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <div style={{ backgroundColor: 'white', marginTop: '20%' }}>
                    <span style={{ textAlign: 'center', fontSize: 18, borderBottomWidth: 1, marginTop: 5 }}>
                      Edit Description
                    </span>

                    <TagAutocompleteInput
                      value={post.title}
                      onChange={this._onEditTitleValueChange}
                      onSubmit={this._onEditTitleSubmit}
                      placeholder="Enter description"
                    />

                    <div style={{ flex: 1, paddingTop: 5, paddingBottom: 15, flexDirection: 'row', borderTopWidth: 1 }}>
                      <FlatButton style={{ flex: 0.5 }} onClick={() => {
                        this.setState({ editTitleValue: '', editModalVisible: !this.state.editModalVisible });
                      }}>
                        <span style={{ textAlign: 'center' }}>Cancel</span>
                      </FlatButton>

                      <FlatButton style={{flex: 0.5}} onClick={() => {
                        this._onEditTitleSubmit();
                      }}>
                        <span style={{ textAlign: 'center' }}>Update</span>
                      </FlatButton>
                    </div>
                  </div>
                </div>
              </Dialog>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    backgroundColor: 'white',
    marginTop: `${HEADER_HEIGHT}px`,
  },
  postContainer: {
    flexDirection: 'column',
  },
  topBar: {
    position: 'relative',
    height: 38,
    marginTop: 20,
    marginBottom: 10,
  },
  spacer: {
    flex: 0.2,
  },
  followButton: {
    paddingRight: 0,
    paddingTop: 5,
    position: 'absolute',
    right: 100,
  },
  followText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postInfoContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 3,
  },
  commentsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  commentsCountText: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 15,
  },
  postText: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 2,
    fontSize: 14,
    paddingBottom: 5,
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#AAA',
  },
  avatarInfo: {
    flex: 0.5,
    flexDirection: 'column',
    paddingLeft: 5,
    paddingRight: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 40,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  daysAgo: {
    color: '#AAA',
    fontSize: 12,
  },
  tag: {
    color: '#B385FF',
  },
  postOptions: {
    position: 'absolute',
    right: 10,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  postOptionsText: {
    color: '#B385FF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
  },
  shareButton: {
    float: 'right',
  },
  muteButton: {
    width: 20,
    height: 20,
  },
  muteButtonContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
  },
};


function stateToProps(state, props) {
  if (props.location && props.location.state) {
    state = { ...state, ...props, ...props.location.state };
  }
  const { reactions, friendship, tags, clapitAccountData, postId, post, slug } = state;
  return { reactions, friendship, tags, profile:clapitAccountData, postId, post, slug };
}

function dispatchToProps(dispatch) {
  const actions = _.extend({ reloadUserPosts }, feedItemActions, networkActions, friendsActions);

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(PostDetailsPage);
