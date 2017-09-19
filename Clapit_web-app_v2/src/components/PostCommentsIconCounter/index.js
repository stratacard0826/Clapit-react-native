/**
*
* PostCommentsIconCounter
*
*/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as feedItemActions from '../../redux/actions/feedItem';
import IconButton from 'material-ui/IconButton';
import { Images } from '../../themes';
import { uploadToCloudinary, createMedia } from '../../redux/actions/api';
import { navigateToPostDetail } from '../../utils/navigator';
class PostCommentsIconCounter extends React.Component { // eslint-disable-line react/prefer-stateless-function

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

    /*uploadToCloudinary('image', `file://${path}`, (err, res) => {
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

    })*/
  }

  _onTakeReactionPhoto() {
    let { appState : { clapitAccountData } } = this.props;


    /*navigator.push({
      name: 'ClapitCamera',
      photoSelect: true,
      photoOnlySelect: true,
      cameraType: Camera.constants.Type.front,
      displayGifCamSwitch: true,
      displayComment: true,
      displaySelfieOverlay: true,
      callback: this._imageSelected.bind(this),
    })*/
  }

  render() {

    return (
      <div style={styles.commentsCount}>

        <IconButton onClick={this._onTakeReactionPhoto.bind(this)} style={{ ...styles.commentCountImage, padding: 0, width: 42 }}>
          <img src={Images.reaction_smiley} width="40px" alt="" />
        </IconButton>

        <div style={styles.counterButton} onClick={this._onCommentCounterPressed.bind(this)}>
          <span style={styles.commentsCountText}>{this._getCommentCount()}</span>
        </div>

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

function stateToProps(appState) {
  // have access to full app state
  // return { appState: appState.toObject() }
  return { appState };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, feedItemActions);

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(PostCommentsIconCounter);
