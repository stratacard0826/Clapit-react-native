/**
*
* Network
*
*/

import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PageContainer from '../../components/PageContainer';

import _ from 'lodash';

import NetworkItem from '../NetworkItem';

import * as networkActions from '../../redux/actions/network';
import { searchFriends } from '../../redux/actions/friends';
import { fetchContactsToFollow, fetchContactsToInvite, loadDeviceContacts } from '../../redux/actions/contacts';
import { NETWORK_FOLLOW_CONTACTS } from '../../redux/constants/NetworkTypes';
import { navigateToProfile } from '../../utils/navigator';
import { HEADER_HEIGHT } from '../../redux/constants/Size';

class Network extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    console.log('~~~~props/Network', props);
    const items = (props.type === NETWORK_FOLLOW_CONTACTS) ? props.contacts.followItems : props.network.items;
    this.state = {
      items,
      dataSource: items,
      //scroll: new Animated.Value(0)
    };
  }
  componentDidMount() {
    const { resourceId, type, fetchNetwork } = this.props;
    if (type !== NETWORK_FOLLOW_CONTACTS) {
      fetchNetwork(resourceId, type, 0);
    }
  }

  componentWillReceiveProps(nextProps) {
    const items = (nextProps.type === NETWORK_FOLLOW_CONTACTS) ? nextProps.contacts.followItems : nextProps.network.items;

    this.setState({
      items,
      dataSource: items,
      //dataSource: this.state.dataSource.cloneWithRows(items)
    });

    if (nextProps.network.statusChanged) {
      this._refreshNotifications();
    }
  }

  _rightButton() {
    const { type } = this.props;
    if (type === NETWORK_FOLLOW_CONTACTS) {
      return (
        <div onClick={this._onPressForwardButton.bind(this)}>Next</div>
      );
    }
  }

  _onPressForwardButton() {
    const { navigator } = this.props;
    // navigator.pop();
    // navigator.pop();
  }

  _onPressBack() {
    const { navigator } = this.props;
    // navigator.pop();
  }

  _title() {
    return (
      <div>{this.props.title}</div>
    );
  }

  _leftButton() {
    const { type } = this.props;
    if (type !== NETWORK_FOLLOW_CONTACTS) {
      return (
        <div onClick={this._onPressBack.bind(this)}> Back </div>
      );
    }
  }
  _renderSeparator(sectionID, rowID) {
    return <div key={rowID} style={styles.separator}></div>;
  }

  _renderRow(item, section, row) {
    const { clapitAccountData } = this.props;
    return (
      <NetworkItem
        key={item.id}
        item={item}
        style={{...styles.networkItem}}
        allowFollow={(item.id !== clapitAccountData.id)}
        onProfilePressed={(item) => {
          navigateToProfile(item);
        }}
        onFollowPressed={this._onFollowPressed.bind(this, item.id)}
      />
    );
  }

  _onFollowPressed(itemId) {
    const { clapitAccountData } = this.props;
    let { items } = this.state;
    items = items.slice();

    const itemIndex = _.findIndex(items, { id: itemId });
    const item = Object.assign({}, items[itemIndex]);

    if (item.following) {
      this.props.unfollow(item.id, clapitAccountData.id);
      item.following = false;
    } else {
      this.props.follow(item.id, clapitAccountData.id);
      item.following = true;
    }

    items[itemIndex] = item; // put item back in items

    this.setState({
      items,
      dataSource: items,
      //dataSource: this.state.dataSource.cloneWithRows(items)
    });
  }
  _refreshNotifications() {
    const { resourceId, type } = this.props;
    this.props.reloadNetwork(resourceId, type);
  }

  render() {
    const { dataSource } = this.state;

    return (
      <PageContainer>
        <div style={styles.container}>
          {
            dataSource.map((item, index, row) => this._renderRow(item, index, row))
          }
        </div>
      </PageContainer>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'white',
    marginTop: `${HEADER_HEIGHT}px`,
    alignSelf: 'center',
  },
  navBar: {
    backgroundColor: 'white',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    marginLeft: 15,
    marginRight: 15,
  },
  networkItem: {
    position: 'relative',
    float: 'left',
    display: 'flex',
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  header: {
    backgroundColor: '#B385FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    resizeMode: 'contain',
    marginTop: 24,
  },
};

function stateToProps(state, props) {
  const { network, clapitAccountData, contacts } = state;
  if (props.location && props.location.state) {
    props = { ...props, ...props.location.state };
  }
  return { network, clapitAccountData, contacts, ...props };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, networkActions, { fetchContactsToFollow, fetchContactsToInvite, loadDeviceContacts, searchFriends });
  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(Network);
