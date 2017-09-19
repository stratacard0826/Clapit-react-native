/**
*
* ProfileDetails
*
*/

import React from 'react';
import {Images} from '../../themes';
import FlatButton from 'material-ui/FlatButton';

class ProfileDetails extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    let { profile, username, clapitAccountData, isMyProfile } = this.props
    if (!profile) {
      profile = {
        description: '',
        clapCount: '',
        followingCount: '',
        followerCount: '',
        school: '',
      }
    }
    let description = profile.description
    let school = profile.school
    if (isMyProfile){
      username = clapitAccountData.username
      description = clapitAccountData.description
    }

    const isDemoAccount = profile.username === 'Clarissa'

    const clapCount = (isDemoAccount) ? 821 : profile.clapCount
    const followingCount = (isDemoAccount) ? 1241 : profile.followingCount
    const followerCount = (isDemoAccount) ? 24830 : profile.followerCount
    return (
      <div>
        <div style={styles.userContainer}>
          <span style={styles.username}>{username}</span>
        </div>
        <span style={styles.description}>{description}</span>
        {(school)? <span style={styles.school}>{school}</span> : null}

        <div style={styles.statsContainer}>
          <div style={styles.clapInfo}>
            <span style={styles.clapsNumber}>{clapCount}</span>
            <img style={{width:20, height: 20}} src={Images.ico_clap_bw}/>
          </div>
          <FlatButton style={styles.followingInfo} onClick={()=>this.props.onFollowingPressed()}>
            <span style={styles.followingNumber}>{followingCount}</span>
            <span style={styles.followingText}> FOLLOWING</span>
          </FlatButton>
          <FlatButton style={styles.followersInfo} onClick={()=>this.props.onFollowersPressed()}>
            <span style={styles.followersNumber}>{followerCount}</span>
            <span style={styles.followersText}> FOLLOWERS</span>
          </FlatButton>
          <div style={styles.actionInfo}>

          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#AAA',
    borderRadius: 5,
    overflow: 'hidden'
  },
  userContainer: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row'
  },
  username: {
    flex: 1,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  line: {
    backgroundColor: '#D0D0D0',
    marginLeft: 10,
    marginRight: 10,
    height: 1
  },
  description: {
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 7,
    fontSize: 11
  },
  school: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 7,
    fontSize: 10,
  },
  followingInfo: {
    width: '30%',
    height: 'initial',
    float: 'left'
  },
  followingNumber: {
    fontWeight: 'bold',
    fontSize: 12
  },
  followingText: {
    fontSize: 10
  },
  followersInfo: {
    width: '30%',
    height: 'initial',
    float: 'left'
  },
  followersNumber: {
    fontWeight: 'bold',
    fontSize: 12
  },
  followersText: {
    fontSize: 10
  },
  clapInfo: {
    width: '15%',
    // height: 20,
    float: 'left'
  },
  clapsNumber: {
    fontWeight: 'bold',
    fontSize: 12
  },
  clapsText: {
    fontSize: 10
  },
  actionInfo: {
    flex: 0.2,
    justifyContent: 'center',
    height: 30,
    paddingRight: 5
  },
  postButton: {
    backgroundColor: '#B289FC',
    height: 30,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B289FC',
    borderRadius: 2
  },
  postText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 20
  }
}

export default ProfileDetails;
