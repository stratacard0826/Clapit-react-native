/**
*
* ReactionItem
*
*/

import React from 'react';
import moment from 'moment';
import { Images, Styles } from '../../themes';
import FlatButton from 'material-ui/FlatButton';
import { GetPreviewImageUrl } from '../../utils/utils';

class ReactionItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _onReactionPress() {
    this.props.onReactionPressed()
  }

  render () {
    const reactionImageWidth = this.props.width * 0.5;
    const { item } = this.props;

    return (
      <FlatButton
        style={{...this.props.style, height: 'initial'}}
        onClick={this._onReactionPress.bind(this)}>
        <div style={styles.container}>
          <div style={styles.header}>
            <span style={styles.username}>{item.Account.username.trim() + '\'s reaction'}</span>

            <span style={styles.daysAgo}>
              <img src={Images.ico_grey_timestamp} style={{width:14}} />
               &nbsp; {moment(item.created).fromNow()}
            </span>
          </div>
          <div style={{clear:'both'}}></div>
          <div style={styles.content}>
            <div style={styles.reactionInfo}>
              <div style={{width: reactionImageWidth, height: reactionImageWidth}}>
                <img style={{...styles.reactionImage, width: reactionImageWidth, height: reactionImageWidth}}
                       src={GetPreviewImageUrl(item)} />
                <img style={{...styles.reactionOverlay, width: reactionImageWidth, height: reactionImageWidth}}
                       src={Images.ico_avatar_overlay} />
              </div>
            </div>
            <div style={styles.postInfo}>
              <img style={styles.postImage} src={GetPreviewImageUrl(item.Post, 'gif')} />
              { item.Post.videoURL && <img src={Images.ico_video} style={{...Styles.videoIcon, top:105, left:55}} />}
              <div style={styles.comment}>{item.comment}</div>
            </div>
          </div>
        </div>
      </FlatButton>
    )
  }
}

const styles = {
  container: {
    backgroundColor: '#FFF',
    border: '2px solid #aaa',
    borderRadius: '5px',
    overflow: 'hidden',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    textAlign: 'left'
  },
  header: {

  },
  username: {
    float: 'left',
    fontWeight: 'bold',
    fontSize: 14
  },
  daysAgo: {
    float: 'right',
    paddingLeft: 2,
    color: '#AAA',
    fontWeight: 'bold',
    fontSize: 11
  },
  content: {
    flexDirection: 'row',
    paddingTop: 10
  },
  reactionInfo: {
    float:'left'
  },
  reactionImage: {
    position: 'absolute',
  },
  reactionOverlay: {
    position: 'absolute'
  },
  postInfo: {
    float: 'left',
    position: 'relative',
    paddingTop: 100,
    paddingLeft: 50
  },
  postImage: {
    width: 100,
    height: 100,
  },
  comment: {
    width: 100,
    paddingTop: 2,
    fontSize: 11
  }
}

export default ReactionItem;
