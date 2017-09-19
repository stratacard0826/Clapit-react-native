/**
*
* PostProfile
*
*/

import React from 'react';
import { bindActionCreators } from 'redux';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { navigateToProfile } from '../../utils/navigator';
class PostProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function

  _onProfilePressed() {
    const { profile } = this.props;
    navigateToProfile(profile);
  }

  render() {
    const profilePicture = this.props.profile.Media && this.props.profile.Media.mediumURL || ' ';
    return (
      <FlatButton style={styles.avatarContainer} onClick={this._onProfilePressed.bind(this)}>
        <div>
          <img alt="" src={profilePicture} style={styles.avatar} />
          <div style={styles.avatarInfo}>
            <div><span style={styles.username}>{this.props.profile.username}</span></div>
            <div><span style={styles.daysAgo}>{moment(this.props.publishTime).fromNow()}</span></div>
          </div>
        </div>
      </FlatButton>
    );
  }
}
const styles = {
  avatarContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    // cursor: 'pointer',
    //display: 'inline-block',
    lineHeight: 'initial',
    height: 'inherit',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#AAA',
    float: 'left',
  },
  avatarInfo: {
    float: 'left',
    paddingLeft: 5,
    paddingRight: 10,
    textAlign: 'left',
    height: 40,
  },
  username: {
    fontWeight: '500',
    fontSize: 14,
  },
  daysAgo: {
    color: '#AAA',
    fontSize: 12,
  },
};

function stateToProps(appState) {
  // have access to full app state
  // return { appState:appState.toObject() }
  return { appState };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({});

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(PostProfile);

