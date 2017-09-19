/**
*
* PostCommentsIconCounter
*
*/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as feedItemActions from '../../redux/actions/feedItem';
import * as networkActions from '../../redux/actions/network';
import * as friendsActions from '../../redux/actions/friends';

import { reloadUserPosts } from '../../redux/actions/app';
import IconButton from 'material-ui/IconButton';
import { Images } from '../../themes';
import { uploadToCloudinary, createMedia } from '../../redux/actions/api';

import TagAutocompleteInput from '../../components/TagAutocompleteInput';
import Dropzone from 'react-dropzone';
import Video from 'react-html5video';
import 'react-html5video/dist/ReactHtml5Video.css';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { navigateToPostDetail } from '../../utils/navigator';
class PostCommentsIconCounter extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.onDropReaction = this.onDropReaction.bind(this);
    this.handleCloudinaryReaction = this.handleCloudinaryReaction.bind(this);
    this._onPostReaction = this._onPostReaction.bind(this);
    this.onPost = this.onPost.bind(this);

    this.state = {
      modalAlert: false,
      modalMessage: '',
      commentValue: '',
      addedUserTags: [],
      reactionPath: null,
      reactionMedia: null,
      reactionId: null,
      modalPost: false,
    };
  }
  _getCommentCount() {
    let { post } = this.props;
    return post.commentCount || 0;
  }

  _onCommentCounterPressed() {
    let { post, disableCounterPress } = this.props
    if (disableCounterPress) return;

    navigateToPostDetail(post);

  }
  _imageSelected(image, video, textComment) {
    let { post } = this.props
    let { createItemReaction } = this.props

    const path = image.indexOf('file://') === 0 ? image.substring('file://'.length) : image
    // upload!
    this.setState({
      uploadImagePath: path,
      uploadInProgress: true,
      showLoading: true,
    });

    /* uploadToCloudinary('image', `file://${path}`, (err, res) => {
      if (err || res.status != 200) {
        Alert.alert(
          'Upload', 'We were unable to upload your image just now.  Would you like to try again?',
          [
            {
              text: 'No',
              onPress: () => {
                this.setState({ uploadInProgress: false, uploadImageUrl: null })
              },
              style: 'cancel'
            },
            {
              text: 'Yes',
              onPress: () => {
                this._imageSelected(path)
              }
            }
          ]
        )
        return
      }

      let { data } = res
      data = JSON.parse(data)
      let { url } = data

      this.setState({
        uploadInProgress: false,
        uploadedImageUrl: url
      })

      if (url) { // new image
        createMedia(url)
          .then(data => {
            if (data.error) { // TODO
              this.setState({ saveWhenDoneUploading: false })
              return;
            }

            ({ id: mediaId } = data)

            this.setState({ mediaId })
            createItemReaction(post, post.Account.id, mediaId, textComment || '')
            Mixpanel.track("Selfie Comment");
          })
          .then(() => {
            post.commentCount += 1
            this.setState({ showLoading: false })
          })
      } else {
        createItemReaction(post, post.Account.id, null, textComment || '')
          .then(() => {
            this.setState({ showLoading: false })
          })
        Mixpanel.trackWithProperties("Selfie Comment", { note: 'existing image'});
      }

    }) */
  }
  onDropReaction(acceptedFiles, rejectedFiles) {
    let self = this;
    this.setState({
      reactionPath: acceptedFiles[0],
    });
    setTimeout(() => {
      self.handleCloudinaryReaction();
    }, 5);
  }
  handleCloudinaryReaction() {
    let self = this;
    const { reactionPath } = this.state;
    if (reactionPath !== null) {
      uploadToCloudinary(reactionPath.type, reactionPath, (err, res) => {
        if (err || res.status !== 200) {
          this.setState({ modalPost: false, modalAlert: true, modalMessage: 'Error upload reaction image' });
          setTimeout(() => {
            self.setState({ modalAlert: false });
          }, 3000);
          return false;
        }
        const { url } = res.body;
        createMedia(url)
            .then((data) => {
              if (data.error) {
                this.setState({ modalPost: false, modalAlert: true, modalMessage: 'Error create madia reaction image' });
                setTimeout(() => {
                  self.setState({ modalAlert: false });
                }, 3000);
                return false;
              }
              let { id: reactionId } = data;
              self.setState({
                reactionMedia: url,
                reactionId: res.body,
              });
              console.log('~~~~~CloudinaryReaction', data);
            }).catch(() => {
              this.setState({ modalPost: false, modalAlert: true, modalMessage: 'Error create madia reaction image' });
              setTimeout(() => {
                self.setState({ modalAlert: false });
              }, 3000);
            });
      });
    }
  }
  _onPostReaction = ({ comment, imageUrl, reaction }) => {

    const { createItemReaction, appState, updateItemReaction, reloadUserPosts, post } = this.props;
    const { clapitAccountData: profile } = appState;
    // console.log('$$$~~~~~~~~~~', profile, post);
    if (comment) {
      const addedUserTags = this.state.addedUserTags.concat(comment.match(/@(\w+)/g));
      this.setState({ addedUserTags });
    }

    let { mediaId, uploadedImageUrl } = this.state;
    uploadedImageUrl = imageUrl || uploadedImageUrl;
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
  uploadPreview() {
    const { reactionPath, reactionId } = this.state;
    let patternPreview = null;
    if (reactionPath !== null) {
      const exp = reactionPath.type.split('/')[0];
      switch (exp) {
        case 'video':
          patternPreview = null;
          break;
        case 'image':
          patternPreview = (<div style={{ background: `url(${reactionPath.preview})  center center / cover no-repeat`, width: '50%', height: 200 }}></div>);
          break;
        default:
          patternPreview = null;
      }
    }
    if (reactionPath !== null && reactionId !== null) {
      const { resource_type, url, format } = reactionId;
      switch (resource_type) {
        case 'video':
          patternPreview = (<Video controls autoPlay loop width="300" height="200">
            <source src={url} type={`${resource_type}/${format}`} />
          </Video>);
          break;
        case 'image':
          patternPreview = (<div style={{ background: `url(${url})  center center / cover no-repeat`, width: '50%', height: 200 }}></div>);
          break;
        default:
          patternPreview = null;
      }
    }
    return patternPreview;
  }
  onPost() {
    const { commentValue, reactionPath, reactionMedia } = this.state;
    this._onPostReaction({ comment: commentValue || '', imageUrl: reactionMedia });
    this.setState({
      commentValue: '',
      reactionPath: null,
      reactionId: null,
      reactionMedia: null,
    });
  }
  _onTakeReactionPhoto() {
    console.log('~~~~ _onTakeReactionPhoto');
    this.modalPostOpen();
  }
  modalCommentChange = (event) => {
    const { value } = event.target;
    this.setState({
      commentValue: value,
    });
  };
  modalPostOpen = () => {
    this.setState({ modalPost: true });
  };

  modalPostClose = () => {
    this.setState({ modalPost: false });
  };
  handleModalClose = () => {
    this.setState({ modalAlert: false });
  };
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.modalPostClose}
      />,
      <FlatButton
        label="Post"
        primary
        onTouchTap={() => { this.modalPostClose(); this.onPost(); }}
      />,
    ];
    const actionsModalAlert = [
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.handleModalClose}
      />,
    ];
    return (
      <div style={styles.commentsCount}>

        <IconButton onClick={this._onTakeReactionPhoto.bind(this)} style={{ ...styles.commentCountImage, padding: 0, width: 42 }}>
          <img src={Images.reaction_smiley} width="40px" alt="" />
        </IconButton>

        <div style={styles.counterButton} onClick={this._onCommentCounterPressed.bind(this)}>
          <span style={styles.commentsCountText}>{this._getCommentCount()}</span>
        </div>
        <Dialog
            actions={actionsModalAlert}
            modal={false}
            open={this.state.modalAlert}
            onRequestClose={this.handleModalClose}
        >
          {this.state.modalMessage}
        </Dialog>
        <Dialog
            title="New Reaction"
            actions={actions}
            modal={false}
            open={this.state.modalPost}
            onRequestClose={this.modalPostClose}
            >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <Dropzone
                onDrop={this.onDropReaction}
                multiple={false}
                accept="image/*"
                >
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>Drop an image or click to select a file to upload.</div>
            </Dropzone>
            {
              this.uploadPreview()
            }
          </div>
          <TagAutocompleteInput
              style={{ height: '100%', width: '100%', paddingLeft: 15, paddingRight: 15 }}
              value={this.state.commentValue}
              onChange={this.modalCommentChange}
              placeholder="Comment here..."
              />
        </Dialog>

      </div>
    );
  }
}

const styles = {
  commentsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    float: 'left',
  },
  commentsCountText: {
    color: '#B385FF',
    fontSize: 14,
    marginLeft: 10,
    marginRight: 8,
    fontWeight: '500',
  },
  commentCountImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  counterButton: {
    minWidth: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    float: 'right',
  },
};

function stateToProps(state, props) {
  // have access to full app state
  // return { appState: appState.toObject() }

  /*if (props.location && props.location.state) {
    state = { ...state, ...props, ...props.location.state };
  }
  const { reactions, friendship, tags, clapitAccountData, postId, post, slug } = state;
  console.log('!!~!~',  tags)
  return { reactions, friendship, tags, profile: clapitAccountData, postId, post, slug };*/
  return { appState: state };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({ reloadUserPosts }, feedItemActions, networkActions, friendsActions);
  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(PostCommentsIconCounter);
