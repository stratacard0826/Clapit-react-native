/**
*
* ClapitButtonContainer
*
*/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { clapPost, sharePost } from '../../redux/actions/claps';
import IconButton from 'material-ui/IconButton';
import { Images } from '../../themes';

// taken from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor2(color, percent) {
  var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16)
      .slice(1);
}

class ClapitButtonContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
    };
    this._renderClapCount = this._renderClapCount.bind(this);
    this._getClaps = this._getClaps.bind(this);
    this._isClapped = this._isClapped.bind(this);

    if(props.storeClapFunc) {
      props.storeClapFunc(() => {
        this._doClap()
        props.onClap && props.onClap()
      })
    }
  }

  _getBackgroundColor(clapCount, clapped) {
    if (clapCount >= 50) {
      return clapped ? '#b385ff' : shadeColor2('#b385ff', 0.5);
    }
    if (clapCount >= 10) {
      return clapped ? '#4cd5ce' : shadeColor2('#4cd5ce', 0.5);
    }
    return clapped ? '#579fe7' : shadeColor2('#579fe7', 0.5);
  }

  _doClap() {
    let { postItem, clapPost } = this.props;

    if (postItem) {
      // if the post is not clapped
      if (!this._isClapped()) {

        // for hash tag search update clap count
        if (this.props.postType === 'hash-tag') {
          this.props.postItem.clapCount += 1
          this.forceUpdate()
        }

        // perform clap post action
        clapPost(postItem.id, this._isClapped())
      }
    }
  }

  _getClaps() {
    let result = 0;

    switch (this.props.postType) {
      case 'hash-tag':
        result = this.props.postItem.clapCount;
        break;
      default:
        if (this.props.postItem) {
          result = this.props.claps[this.props.postItem.id] || 0;
        }
    }

    return result;
  }

  _isClapped() {
    return this.props.postItem && this.props.myClaps.indexOf(this.props.postItem.id) > -1
  }

  _renderClapCount() {
    if (this.props.showClapCount) {
      return (<span style={styles.clapsText}>{this._getClaps()}</span>)
    } else {
      return null
    }
  }

  render() {

    let { style, onClap } = this.props;
    let clapped = this._isClapped();
    let clapCount = this._getClaps();
    let { borderRadius, ...mainStyle } = style;
    let backgroundColor = this._getBackgroundColor(clapCount, clapped);
    return (
      <div style={styles.clapInfo}>
        <div style={{...styles.view, ...mainStyle}}>
          <div style={styles.innerView}>
            <IconButton
              style={{...styles.touchableForegroundImage, ...mainStyle, backgroundColor, borderRadius}}
              onClick={() => {
                onClap && onClap()
                this._doClap()
              }}>
              <img src={Images.clapBlackOutline} width="34px" alt="" />
            </IconButton>
          </div>
        </div>
        {this._renderClapCount()}
      </div>
    )
  }
}

const styles = {
  view: {
    display: 'inline-block',
  },
  innerView: {
    position: 'absolute',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
  },
  touchableForegroundImage: {
    // position: 'absolute',
    // top: 0
    padding: 0,
    width: 42,
  },
  foregroundImage: {
    position: 'absolute',
    top: 0,
  },
  clapsText: {
    color: '#4DD6CF',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  clapInfo: {
    alignItems: 'center',
    float: 'left',
  },
};

function stateToProps(state) {
  // let { clapitAccountData, claps } = state.toObject();
  let { clapitAccountData, claps } = state;
  return { clapitAccountData, ...claps };
}

function dispatchToProps(dispatch) {

  let actions = Object.assign({}, { clapPost, sharePost });

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(ClapitButtonContainer);

