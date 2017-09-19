/**
*
* PostReaction
*
*/

import React from 'react';
import TagAutocompleteInput from '../TagAutocompleteInput';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { Images } from '../../themes';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';
const width = MAX_PAGE_WIDTH;
const POST_BUTTONS_WIDTH = 108;

class PostReaction extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      reaction: null,
    };
  }

  _onTakePhoto() {
    this.props.onTakeReactionPhoto()
  }

  _onPostReaction() {
    //don't submit empty comment
    if (!this.state.comment || !this.state.comment.trim()) {
      return;
    }
    this.props.onPostReaction({comment: this.state.comment, reaction: this.state.reaction})
    this.setState({ comment: '', reaction: null })
    this.refs.tagsAutocomplete.getWrappedInstance().clear();
  }

  _onCommentChange(e) {
    let { value: comment } = e.target;
    this.setState({ comment });
  }

  setReaction(reaction) {
    if (typeof reaction !== 'object' && !reaction.comment) return;

    this.setState({
      reaction,
      comment: reaction.comment,
    });

    this.refs.tagsAutocomplete.refs.wrappedInstance.setComment(reaction.comment);
  }

  render() {
    let { reactionImage, tags, fetchHashtags } = this.props;

    return (

      <div style={styles.container}>
        <div style={{ /* float: 'left',*/ width: width - (POST_BUTTONS_WIDTH * 1.3) - 5, height: '100%' }}>
          <TagAutocompleteInput
            ref="tagsAutocomplete"
            onChange={this._onCommentChange.bind(this)}
            containerStyle={{backgroundColor: 'white', position: 'relative', height: '100%' }}
            style={{ fontSize: '15px', width: '100%', height: '100%', paddingLeft: '15px' }}
          />
        </div>
        <div style={styles.buttonsContainer}>
          <FlatButton onClick={this._onPostReaction.bind(this)} style={{ alignSelf: 'center', height: 48 }}>
            <div><span style={styles.postButtonText}>Post</span></div>
          </FlatButton>
          <IconButton style={{ padding: 0, width: 42, top: -2 }} onClick={this._onTakePhoto.bind(this)}>
            {
              reactionImage ?
                <img alt="" src={reactionImage}  style={styles.reactionImage} width="40px" />
                :
                <img alt="" src={Images.reaction_smiley} style={styles.reactionImage} width="40px" />
            }
          </IconButton>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    width,
    height: 50,
    border: '1px #F0F0F0 solid',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonsContainer: {
    // float: 'right',
    paddingTop: '2px',
    width: POST_BUTTONS_WIDTH * 1.3,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  postButtonText: {
    fontSize: 15,
    color: '#B385FF',
    paddingTop: 20,
  },
  reactionImage: {
    width: 40,
  },
}

export default PostReaction;
