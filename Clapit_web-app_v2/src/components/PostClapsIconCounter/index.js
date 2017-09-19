/**
*
* PostClapsIconCounter
*
*/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as clapActions from '../../redux/actions/claps';
import ClapitButtonContainer from '../ClapitButtonContainer';
import { browserHistory } from 'react-router';
import {
    NETWORK_CLAPS,
} from '../../redux/constants/NetworkTypes';

class PostClapsIconCounter extends React.Component { // eslint-disable-line react/prefer-stateless-function

  _getClapsCount() {
    const { post } = this.props;
    return post.clapCount || 0;
  }

  _onClapsCounterPressed() {
    let { post } = this.props;
    browserHistory.push({ pathname: `/claps/${post.id}`, state: { resourceId: post.id, type: NETWORK_CLAPS } });
  }

  _isClapped() {
    const { post, appState: { claps: { myClaps }} } = this.props;
    return myClaps.indexOf(post.id) > -1;
  }

  _onClapsIconPressed() {
    let { post,  onClap } = this.props;
    onClap && onClap();

    if (!this._isClapped()) {
      post.clapCount += 1;
      this.setState({});
    }
  }

  render() {
    const { post, storeClapFunc } = this.props;
    // console.log('post claps icon counter', this.props)
    return (
      <div style={styles.clapsCount}>
        <div style={styles.clapButton}>
          <ClapitButtonContainer
            postType={'friends-data'}
            postItem={post}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            pressInScale={1.5}
            showClapCount={false}
            storeClapFunc={storeClapFunc}
            onClap={() => { this._onClapsIconPressed(); }}
          />
        </div>
        <div style={styles.counterButton} onClick={this._onClapsCounterPressed.bind(this)}>
          <span style={styles.clapsCountText}>{this._getClapsCount()}</span>
        </div>
      </div>
    );
  }
}

const styles = {
  clapsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    float: 'left',
    width: 100,
  },
  clapsCountText: {
    color: '#B385FF',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
    backgroundColor: 'transparent',
  },
  clapImage: {
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
  },
};

function stateToProps(appState) {
  // have access to full app state
  // return { appState: appState.toObject() }
  return { appState };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, clapActions);

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(PostClapsIconCounter);