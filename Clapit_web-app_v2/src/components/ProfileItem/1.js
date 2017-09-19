

import React from 'react';

import FlatButton from 'material-ui/FlatButton';

class ProfileItem extends React.Component { // eslint-disable-line react/prefer-stateless-function


  render() {
    let content =
      <div style={{ /* position: 'relative' */ }}>
        fghf
      </div>

    let marginLeft =  0.5;
    let marginRight =  0.5;

    return (
      <div style={{...this.props.style, ...styles.container, marginLeft, marginRight}}>
        <button style={{ height: 'initial' }} >
          {content}
        </button>
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
