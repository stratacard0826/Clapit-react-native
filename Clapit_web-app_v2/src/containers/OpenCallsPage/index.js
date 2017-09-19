/*
 *
 * OpenCallsPage
 *
 */

import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as feedActions from '../../redux/actions/feed';
import { searchFriends } from '../../redux/actions/friends';
import { setPreferences } from '../../redux/actions/preferences';
import Helmet from 'react-helmet';
import PageContainer from '../../components/PageContainer';
import {Colors, Images} from '../../themes';
import FlatButton from 'material-ui/FlatButton';

import {MAX_PAGE_WIDTH, HEADER_HEIGHT} from '../../redux/constants/Size';
import { navigateToSearch } from '../../utils/navigator';
import { browserHistory } from 'react-router';
const width = MAX_PAGE_WIDTH;
const POPUP_AUTOSHOW_POSTFIX = 'PopupShouldAutoShow';

export class OpenCallsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.state = {
      TheoOn: '0', // default to false until fetch from Mixpanel
      items: [
        {
          hashtag: 'danceit',
          bubbleText: 'Winner: Iamrichymon',
          title: "#danceit Open Call",
          infoText: '#danceit brought together the street dance community across the America. Winner @iamrichymon was flown to NYC to perform with the best and shoot his professional dance reel!'
        }, {
          hashtag: 'makemeamuse',
          bubbleText: 'Winner: emscrib',
          title: '#makemeamuse',
          infoText: 'Thousands entered the #makemeamuse open call, uploading a selfie to show how they embraced their own kind of beauty. @emscrib was the winner - she won a trip to NYC, a 3-year contract with Muse Models NYC and is now the face of clapit!'
        }
      ]
    }
  }


  _navigateToTrending(hashtag, infoText, title) {
      const ht = hashtag.slice(1) + POPUP_AUTOSHOW_POSTFIX;
      browserHistory.push({ pathname: `/trending/${hashtag.slice(1)}`,
        state: { showInfoModal: this.props.preferences[ht],
          hashtag,
         /* title,
          infoText,
          ...this.props*/
        }
      });
      this.props.setPreferences({[ht]: false})

  }

  _navigateToOpenCall(hashtag, infoText, title) {
    const ht = hashtag.slice(1) + POPUP_AUTOSHOW_POSTFIX;
    this.props.searchFriends(hashtag, 0);
    const otherProps = {
      showInfoModal: this.props.preferences[ht],
      infoText,
      title,
      ...this.props
    }
    //todo otherProps make search results empty - navigateToSearch('hashtag', hashtag, otherProps);
    navigateToSearch('hashtag', hashtag);

    this.props.setPreferences({[ht]: false})
  }

  render() {
    const singitInfoText = 'Enter the #singit open call for your chance to win a trip to NYC or LA and spend a day in the recording studio with Theophilus London! Just upload a 20 second video of you singing to clapit with #singit and get your friends to clap you to the top! Most claps wins.'

    return (
      <div>
        <Helmet
          title="OpenCallsPage"
          meta={[
            {name: 'description', content: 'Description of OpenCallsPage'},
          ]}
        />
        <PageContainer>
          <div style={styles.container}>
            <FlatButton style={styles.topItem}
                    onClick={this._navigateToTrending.bind(this, '#singit', singitInfoText, "#singit Open Call")}
            >

              <img src={Images.theo_video_preview} style={{width, height: width}}/>
              <span style={styles.hashtagText}>#singit Theophilus London</span>
              <div style={styles.statusBubble}>
                <span style={{color: Colors.purple, fontWeight: 'bold', fontSize: 14}}>Live</span>
              </div>

            </FlatButton>
            {this.state.items.map(item =>
              <FlatButton
                key={item.hashtag}
                style={styles.item}
                onClick={(item.live) ?
                  this._navigateToTrending.bind(this, '#' + item.hashtag, item.infoText, item.title) :
                  this._navigateToOpenCall.bind(this, '#' + item.hashtag, item.infoText, item.title)}
              >
                <img src={Images[item.hashtag]} style={styles.item}/>
                <span style={styles.hashtagText}>#{item.hashtag}</span>
                <div style={styles.statusBubble}>
                  <span style={(item.live) ? {color: Colors.purple, fontWeight: 'bold', fontSize: 14} : {
                      color: 'grey',
                      fontWeight: 'bold',
                      fontSize: 14,
                      height: 'initial',
                    }}>{item.bubbleText}</span>
                </div>

              </FlatButton>
            )}

          </div>
        </PageContainer>
      </div>
    )
  }
}


const styles = {
  container: {
    marginTop: `${HEADER_HEIGHT}px`
  },
  topItem: {
    width: width,
    height: width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  item: {
    // position: 'relative',
    width: width,
    height: 1 / 2 * width,
    alignItems: 'center'
  },
  hashtagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textShadow: '2px 2px black',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 35,
    left: 10,
    height: 'initial',
  },
  itemFooter: {
    opacity: 0.6,
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 60,
    width
  },
  statusBubble: {
    backgroundColor: 'white',
    opacity: 0.8,
    position: 'absolute',
    bottom: 5,
    right: 10,
    width: 0.4 * width,
    height: 'initial',
    borderRadius: 13,
    verticalAlign: 'center',
    padding: 4,
  }
}

function mapStateToProps(state) {
  const { feed, clapitAccountData, friends, preferences } = state;
  const { items, itemsById, fetchingData, reloading, error, page } = feed;
  return {
    items, itemsById, fetchingData, reloading, error, clapitAccountData, page, friends, preferences
  };
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({ searchFriends, setPreferences }, feedActions);

  return bindActionCreators(actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(OpenCallsPage);
