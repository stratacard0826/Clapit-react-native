/**
*
* PostComments
*
*/

import React from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Images } from '../../themes';
import FlatButton from 'material-ui/FlatButton';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';
import { navigateToPostDetail } from '../../utils/navigator';
const width = MAX_PAGE_WIDTH;

class PostComments extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      addedTopReaction: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { appState : { reactions }, post } = nextProps
    if (reactions && reactions.reactionOfPostId && reactions.reactionOfPostId.postId === post.id) {
      this.setState({ addedTopReaction: reactions.reactionOfPostId });
    }

  }

  _isTopReactionPresent() {
    const { post } = this.props;

    return post.topReactionId || this.state.addedTopReaction;
  }

  _getCommentCount() {
    const { post } = this.props;

    return post.commentCount || 0;
  }

  _getTopReactionAuthorAvatar() {
    const { post } = this.props;
    if (!post.topReaction && post.commentCount > 0 && this.state.addedTopReaction) {
      const Account = this.state.addedTopReaction.Account;
      return Account && Account.Media && Account.Media.mediumURL  || ' ';
    }
    return post.topReaction && post.topReaction.Account && post.topReaction.Account.Media && post.topReaction.Account.Media.mediumURL  || ' ';
  }

  _getTopReactionAuthorCoverImage() {
    const { post } = this.props;
    if (!post.topReaction && post.commentCount > 0 && this.state.addedTopReaction) {
      const Account = this.state.addedTopReaction.Account
      return Account && Account.CoverMedia && Account.CoverMedia.mediumURL  || ' ';
    }
    return post.topReaction && post.topReaction.Account && post.topReaction.Account.CoverMedia && post.topReaction.Account.CoverMedia.mediumURL  || ' ';
  }

  _getTopReactionAuthorUsername() {
    const { post } = this.props;
    if (!post.topReaction && post.commentCount > 0 && this.state.addedTopReaction) {
      return this.state.addedTopReaction.Account.username;
    }
    return post.topReaction && post.topReaction.Account.username;
  }

  _getTopReactionComment() {
    const { post } = this.props;
    if (!post.topReaction && post.commentCount > 0 && this.state.addedTopReaction) {
      return this.state.addedTopReaction.comment;
    }
    return post.topReaction && post.topReaction.comment;
  }

  _getTopReactionSelfie() {
    const { post } = this.props;
    if (!post.topReaction && post.commentCount > 0 && this.state.addedTopReaction) {
      return this.state.addedTopReaction.Media && this.state.addedTopReaction.Media.mediumURL;
    }
    return post.topReaction && post.topReaction.Media && post.topReaction.Media.mediumURL;
  }

  _getTopReactionAccountId() {
    const { post } = this.props;
    if (!post.topReaction && post.commentCount > 0 && this.state.addedTopReaction) {
      return this.state.addedTopReaction.Account.id;
    }
    return post.topReaction && post.topReaction.Account.id;
  }

  _onViewAllReactionsPressed() {
    const { post} = this.props;
    navigateToPostDetail(post);
  }

  _onAuthorPressed() {
    const image = this._getTopReactionAuthorAvatar();
    const coverImage = this._getTopReactionAuthorCoverImage();
    const username = this._getTopReactionAuthorUsername();
    const accountId = this._getTopReactionAccountId();
    browserHistory.push({ pathname: `/profile/${accountId}/${username}`, state: { image, coverImage, accountId, username } });
  }

  _renderViewAllReactions() {
    const count = this._getCommentCount();
    const viewAllMsg = (count === 1) ? 'View 1 reaction' : `View all ${count} reactions`;
    return this._isTopReactionPresent() ?
      (
        <div style={styles.container}>
          <FlatButton primary={true} onClick={this._onViewAllReactionsPressed.bind(this)} >
            <div><span style={styles.commentsCountText}>{viewAllMsg}</span></div>
          </FlatButton>
        </div>
      )
      :
      null;
  }

  _renderAuthorAvatarAndTopReaction() {
    const authorImage = this._getTopReactionAuthorAvatar();
    const contentImageWidth = width * 0.4;
    const reactionSelfie = this._getTopReactionSelfie.bind(this)();
    return this._isTopReactionPresent() || this._getCommentCount() > 0 ?
      (
        <div style={styles.authorReactionContainer}>
          <div style={styles.authorContainer}>
            <FlatButton style={{ height: 'initial', padding: 10 }} onClick={this._onAuthorPressed.bind(this)}>
              <div style={{ display: 'flex', flexDirection: 'row', }}>
                {(authorImage) ? <img src={authorImage} style={styles.avatar} /> : null}
                <div style={{ paddingLeft: 15 }}>
                  <div><span style={styles.username}>{this._getTopReactionAuthorUsername()}</span></div>
                </div>
              </div>
            </FlatButton>
          </div>
          <div style={styles.reactionContainer}>
            <div>
              <div><span style={{...styles.lastComment, marginLeft: 15}}>{this._getTopReactionComment()}</span></div>
              {reactionSelfie ? (
                <div style={{ display: 'flex', justifyContent: 'center' }} onClick={this._onViewAllReactionsPressed.bind(this)}>
                  <div style={{ width: contentImageWidth, height: contentImageWidth, alignSelf: 'center' }}>
                    <img
                      style={{ ...styles.reactionImage, width: contentImageWidth, height: contentImageWidth }}
                      src={reactionSelfie}
                    />
                    <img
                      style={{ ...styles.reactionOverlay, width: contentImageWidth, height: contentImageWidth }}
                      src={Images.ico_avatar_overlay}
                    />
                  </div>
                </div>
                ) : null}
            </div>
          </div>
          <div style={{ clear: 'both' }}></div>
        </div>
      )
      :
      null;
  }

  render() {
    const { post } = this.props;
    const { topReaction } = post;
    const { addedTopReaction } = this.state;
    return (topReaction || addedTopReaction) ? (
      <div style={{ flexDirection: 'column', marginBottom: 10 }}>
        {this._renderViewAllReactions()}
        {this._renderAuthorAvatarAndTopReaction()}
      </div>
      ) : null;
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 10,
  },
  commentsCountText: {
    // color: '#AAA',
    fontSize: 14,
    margin: 15,
  },
  authorReactionContainer: {
    flexDirection: 'column',
    display: 'flex',
    // marginTop: 10,
    // marginLeft: 10,
  },
  authorContainer: {
    marginLeft: 5,
    // float: 'left',
  },
  reactionContainer: {

    marginRight: 5,
    //float: 'left',
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
    fontWeight: '500',
  },
  lastComment: {
    fontSize: 14,
    fontWeight: '300',
  },
  reactionImage: {
    position: 'absolute',
  },
  reactionOverlay: {
    position: 'absolute',
  },
};

function stateToProps(appState) {
  // have access to full app state
  // return { appState: appState.toObject() }
  return { appState };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({});

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(PostComments);
