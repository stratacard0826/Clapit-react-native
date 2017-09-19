/**
*
* ProfileItem
*
*/

import React from 'react';
import Flag from '../Flag';
import FlatButton from 'material-ui/FlatButton';

import { Colors, Images, Styles } from '../../themes';
import { GetPreviewImageUrl } from '../../utils/utils';

class ProfileItem extends React.Component { // eslint-disable-line react/prefer-stateless-function

  _renderMedal() {
    const { medal, item } = this.props

    if (medal == 0) {
      return (
        <Flag style={{position: 'absolute', right: 15, top: 10}}>
          <div style={{marginLeft: 10, marginTop: 9}}>
            <img src={Images.smallWhiteClap} style={styles.medal}/>
            <span style={styles.medalText}>{this.props.item.clapCount}</span>
          </div>
        </Flag>
      )
    } else if (medal > 0 && medal < 3) {
      return (
        <div style={styles.medalContainer}>
          <img src={Images.smallWhiteClap} style={styles.medal}/>
          <span style={styles.medalText}>{this.props.item.clapCount}</span>
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    let {isOddItem, item, medal} = this.props
    if (medal > -1) isOddItem = !isOddItem;
    let {width, height} = this.props.style

    const imageUrl = GetPreviewImageUrl(item, 'gif');
    let content =
      <div style={{ /* position: 'relative' */ }}>
        <img src={imageUrl} style={{ width, height }} />
        {this._renderMedal()}
        {item.videoURL && <img src={Images.ico_video} style={Styles.videoIcon} />}
      </div>

    let marginLeft = (isOddItem) ? 0 : 0.5;
    let marginRight = (!isOddItem) ? 0 : 0.5;

    return (
      <div style={{...this.props.style, ...styles.container, marginLeft, marginRight}}>
        <FlatButton style={{ height: 'initial' }} onClick={this.props.onPress}>
          {content}
        </FlatButton>
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#FFF',
    marginBottom: 1,
    overflow: 'hidden',
    float: 'left',
    // borderWidth:1,
    // borderColor: Colors.grey
  },
  medalContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#569ee8',
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 45,
  },
  medal: {
    width: 15,
    height: 14,
  },
  medalText: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 11,
  },
};

export default ProfileItem;
