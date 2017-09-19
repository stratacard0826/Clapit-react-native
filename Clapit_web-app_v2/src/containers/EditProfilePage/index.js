/*
 *
 * EditProfilePage
 *
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { clapitSaveProfile, clearApiError } from '../../redux/actions/clapit';
import { fetchProfileData, fetchProfileRecentPosts, fetchProfilePopularPosts } from '../../redux/actions/profile';
import { fetchContactsToFollow, loadDeviceContacts } from '../../redux/actions/contacts';
import { uploadToCloudinary, createMedia } from '../../redux/actions/api';

import Video from 'react-html5video';
// import 'react-html5video/dist/ReactHtml5Video.css';

import { Colors } from '../../themes';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import PageContainer from '../../components/PageContainer';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { PROFILE_PHOTO, COVER_PHOTO } from '../../redux/constants/Constants';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';

const width = MAX_PAGE_WIDTH;
const DESCRIPTION_MAX_LENGTH = 150;

export class EditProfilePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onImageDropProfile = this.onImageDropProfile.bind(this);
    this.handleCloudinaryProfile = this.handleCloudinaryProfile.bind(this);
    this.onDropCover = this.onDropCover.bind(this);
    this.handleCloudinaryCover = this.handleCloudinaryCover.bind(this);
    this._onPressToSave = this._onPressToSave.bind(this);
    const { clapitAccountData: { username, description, Media, fullName, school, website, CoverMedia }, tabName } = props;
    const length = (description) ? description.length : 0;
    const descriptionCharsRemaining = DESCRIPTION_MAX_LENGTH - length;
    let uploadImagePath = '';
    let mediaId;
    let uploadCoverImagePath = ' ';
    let coverMediaId;

    if (Media) {
      uploadImagePath = Media.mediumURL;
      mediaId = Media.id;
    }
    if (CoverMedia) {
      uploadCoverImagePath = CoverMedia.mediumURL;
      coverMediaId = CoverMedia.id;
    }

    this.state = {
      username,
      description,
      fullName,
      school,
      website,
      descriptionCharsRemaining,
      uploadImagePath,
      uploadedImageUrl: null,
      uploadCoverImagePath,
      uploadedCoverImageUrl: null,
      mediaId,
      coverMediaId,
      cameraAuthorized: false,
      tabName: tabName || PROFILE_PHOTO,
      contentOffset: 0,
      profilePhotoUpdated: false,
      coverPhotoUpdated: false,
    };
  }
  _onChangeTab(tabName) {
    this.setState({
      tabName,
    });
  }
  componentWillReceiveProps(props) {
    let { clapitAccountData: { username, description, Media, fullName, school, website, CoverMedia } } = props;
    let uploadImagePath = ' ';
    let uploadCoverImagePath = ' ';
    let mediaId;
    let coverMediaId;
    if (Media) {
      uploadImagePath = Media.mediumURL;
      mediaId = Media.id;
    }
    if (CoverMedia) {
      uploadCoverImagePath = CoverMedia.mediumURL;
      coverMediaId = CoverMedia.id;
    }
    this.setState({
      username,
      description,
      fullName,
      school,
      website,
      uploadImagePath,
      uploadCoverImagePath,
      mediaId,
      coverMediaId,
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    let { clapitAccountData: oldClapitAccountData, fetchProfileData } = this.props;
    let { clapitAccountData } = nextProps;
    return true;
  }
  _saveProfile() {
    const { clapitSaveProfile, navigator, clapitAccountData } = this.props;
    const { username, description, mediaId, fullName, school, website, coverMediaId } = this.state;


    clapitSaveProfile(username, description, mediaId, fullName, school, website, coverMediaId, null, (err, data) => {
      const { fetchProfileData, contacts } = this.props;

      if (err) {
        // let msg = 'Problem occurred when saving your profile. Please try again.';
        // if (err.status === 422) {
        //  msg = `Username ${username} is already taken.`;
        // }
        // Alert.alert('Error saving profile', msg, [
        //  { text: 'OK' },
        // ]);
        this.setState({ showLoading: false });
        return false;
      }
      fetchProfileData(clapitAccountData.id);
    });
  }
  onImageDropProfile(acceptedFiles, rejectedFiles) {
    let self = this;
    this.setState({
      uploadedImageUrl: acceptedFiles[0],
      mediaId: null,
    });
    setTimeout(() => {
      self.handleCloudinaryProfile();
    }, 5);
  }
  handleCloudinaryProfile() {
    let self = this;
    const { uploadedImageUrl } = this.state;
    if (uploadedImageUrl !== null) {
      uploadToCloudinary(uploadedImageUrl.type, uploadedImageUrl, (err, res) => {
        if (err || res.status !== 200) {
          return false;
        }
        const { url } = res.body;
        createMedia(url)
            .then((data) => {
              if (data.error) {
                return false;
              }
              let { id: mediaId } = data;
              self.setState({
                uploadImagePath: url,
                mediaId,
                profilePhotoUpdated: true,
              });
              console.log('~~~~~CloudinaryProfile', data);
            });

      });
    }
  }
  onDropCover(acceptedFiles, rejectedFiles) {
    let self = this;
    this.setState({
      uploadedCoverImageUrl: acceptedFiles[0],
      coverMediaId: null,
    });
    setTimeout(() => {
      self.handleCloudinaryCover();
    }, 5);
  }
  handleCloudinaryCover() {
    let self = this;
    const { uploadedCoverImageUrl } = this.state;
    if (uploadedCoverImageUrl !== null) {
      uploadToCloudinary(uploadedCoverImageUrl.type, uploadedCoverImageUrl, (err, res) => {
        if (err || res.status !== 200) {
          return false;
        }
        const { url } = res.body;
        createMedia(url)
            .then((data) => {
              if (data.error) {
                return false;
              }
              let { id: coverMediaId } = data;
              self.setState({
                uploadCoverImagePath: url,
                coverMediaId,
                coverPhotoUpdated: true,
              });
              console.log('~~~~~CloudinaryCover', data);
            });
      });
    }
  }
  render() {
    const { username,
        description, school, website, fullName, descriptionCharsRemaining,
        uploadImagePath, uploadCoverImagePath, showLoading, tabName, contentOffset } = this.state;
    const { clapitAccountData } = this.props;
    const { Media, CoverMedia } = clapitAccountData;
    let coverIsVideo = (uploadCoverImagePath && uploadCoverImagePath.trim() &&! /^.*(gif|jpg|jpeg|png)$/.test(uploadCoverImagePath));

    console.log('~~~render state', this.state);
    return (
      <div style={{ marginTop: 50 }}>
        {
          clapitAccountData && clapitAccountData.accessToken ?
            <div>
              <Helmet
                title="Edit Profile"
                meta={[{ name: 'description', content: 'Description of Edit Profile' }]}
              />
              <PageContainer>
                <div style={[styles.view, { position: 'relative' }]}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={styles.bodyView}>
                      {
                        // <SimpleTabs
                        //    style={styles.tabs} selected={tabName}
                        //    underlineColor='#B289FC' onSelect={(el) => this._onChangeTab(el.props.name)} >
                        //  <Text style={styles.tabItem} selectedStyle={styles.tabSelected} name={PROFILE_PHOTO}>Profile Photo</Text>
                        //  <Text style={styles.tabItem} selectedStyle={styles.tabSelected} name={COVER_PHOTO}>Cover Photo</Text>
                        // </SimpleTabs>
                      }
                      {
                         <div>
                          <div style={styles.profileImageView}>
                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                              <img alt="" ref="profileImg" style={styles.profileImage} src={uploadImagePath.preview ? uploadImagePath.preview : uploadImagePath} />
                              <div style={styles.profileEditView}>
                                <Dropzone
                                  style={{ borderWidth: 2, borderColor: 'rgb(102, 102, 102)', borderStyle: 'dashed', borderRadius: 5, background: 'bisque', }}
                                  onDrop={this.onImageDropProfile}
                                  multiple={false}
                                  accept="image/*"
                                >
                                  <span style={{ margin: 5 }}>Edit Photo</span>
                                </Dropzone>
                              </div>
                            </div>
                            {
                              this.state.profilePhotoUpdated &&
                              <div style={[styles.profileEditView, { left: 5 }]}
                                                onClick={() => { this.setState({
                                            uploadImagePath: Media.mediumURL,
                                            mediaId: Media.id,
                                            profilePhotoUpdated: false,
                                        })}}>
                                <div >
                                  <span >Cancel</span>
                                </div>
                              </div>
                            }
                          </div>
                          <div style={styles.profileImageView}>
                            <div style={{ marginTop: 20,}}>
                              {(uploadCoverImagePath && uploadCoverImagePath.trim()) ?
                                  <div>
                                    {(coverIsVideo) ? <Video controls autoPlay loop ref="video" width="100%" height="10%">
                                            <source src={uploadCoverImagePath} />
                                          </Video>
                                        :
                                        <img alt="" ref="coverImg" style={styles.coverImage}
                                               src={uploadCoverImagePath} />
                                    }
                                    <div style={[styles.coverImage, {  backgroundColor: 'lightgrey', justifyContent: 'center', alignItems: 'center' }]}>
                                      <Dropzone
                                          style={{marginTop: 10, borderWidth: 2, borderColor: 'rgb(102, 102, 102)', borderStyle: 'dashed', borderRadius: 5, background: 'bisque', }}
                                          onDrop={this.onDropCover}
                                          multiple={false}
                                          accept="image/*,video/*"
                                          >
                                        <span style={{ color: Colors.purple, margin: 5 }}>Upload a Cover picture or video</span>
                                      </Dropzone>
                                    </div>
                                  </div>

                                  :
                                  <div style={[styles.coverImage, {  backgroundColor: 'lightgrey', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Dropzone
                                      style={{ borderWidth: 2, borderColor: 'rgb(102, 102, 102)', borderStyle: 'dashed', borderRadius: 5, background: 'bisque', }}
                                      onDrop={this.onDropCover}
                                      multiple={false}
                                      accept="image/*,video/*"
                                    >
                                      <span style={{ color: Colors.purple, margin: 5 }}>Upload a Cover picture or video</span>
                                    </Dropzone>

                                  </div>
                              }
                            </div>
                            {
                              this.state.coverPhotoUpdated &&
                              <div style={[styles.profileEditViewOpacity, { left: 0 }]}
                                                onClick={() => { this.setState({
                                            uploadCoverImagePath: CoverMedia ? CoverMedia.mediumURL : null,
                                            coverMediaId: CoverMedia ? CoverMedia.id : null,
                                            coverPhotoUpdated: false,
                                        })}}>
                                <div >
                                  <span >Cancel</span>
                                </div>
                              </div>
                            }
                          </div>
                         </div>
                      }
                      <div style={styles.inputView}>
                        <span style={styles.inputHeaderText}>Username</span>
                        <div style={styles.separator}></div>
                        <TextField
                          id="username"
                          onChange={this._usernameChange.bind(this)}
                          style={styles.textInput}
                          value={username}
                          ref="usernameTextInput"
                          placeholder="Enter your username"
                        />
                      </div>
                      <div style={styles.inputView}>
                        <span style={styles.inputHeaderText}>Full Name</span>
                        <div style={styles.separator} />
                        <TextField
                          id="fullName"
                          onChange={this._fullNameChange.bind(this)}
                          style={styles.textInput}
                          value={fullName}
                          ref="fullNameTextInput"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div style={styles.aboutView}>
                        <span style={styles.inputHeaderText}>Bio</span>
                        <span style={styles.aboutTextRemaining}>{descriptionCharsRemaining}</span>
                        <div style={styles.separator} />
                        <TextField
                          id="description"
                          onChange={this._descriptionChange.bind(this)}
                          style={styles.aboutTextInput}
                          value={description}
                          ref="aboutTextInput"
                          placeholder="What are your favourite talents? i.e. music, film, dance, art, design, comedy, sport, surfing, skating, snow, yoga..."
                        />
                      </div>
                      <div style={styles.inputView}>
                        <span style={styles.inputHeaderText}>College/University/School</span>
                        <div style={styles.separator} />
                        <TextField
                          id="school"
                          onChange={this._schoolChange.bind(this)}
                          style={styles.textInput}
                          value={school}
                          ref="schoolTextInput"
                          placeholder="Enter your College/University/School"
                        />
                      </div>
                      <div style={styles.inputView}>
                        <span style={styles.inputHeaderText}>Website</span>
                        <div style={styles.separator} />
                        <TextField
                          id="website"
                          onChange={this._websiteChange.bind(this)}
                          style={styles.textInput}
                          value={website}
                          ref="websiteTextInput"
                          placeholder="Enter your website"
                        />
                      </div>
                  </div>
                  <RaisedButton primary label="Save" style={{}} onClick={this._onPressToSave} />
                  </div>
                </div>
              </PageContainer>
            </div>
            : null
        }
      </div>
    );
  }
  _onPressToSave() {
    const { username } = this.state;
    if (_.trim(username).length < 2) {
      // Alert.alert('Username', "Please type a username with at least 2 letters", [
      //  { text: 'OK', onPress: () => this.refs.usernameTextInput.focus() }
      // ])

      return false;
    }
    this.setState({
      showLoading: true,
    });
    this._saveProfile();
  }
  _usernameChange(e) {
    const { value: username } = e.target;
    this.setState({ username });
  }

  _fullNameChange(e) {
    const { value: fullName } = e.target;
    this.setState({ fullName });
  }

  _schoolChange(e) {
    const { value: school } = e.target;
    this.setState({ school });
  }

  _websiteChange(e) {
    const { value: website } = e.target;
    this.setState({ website });
  }

  _descriptionChange(e) {
    const { value: description } = e.target;
    this.setState({ description });
    const descriptionCharsRemaining = DESCRIPTION_MAX_LENGTH - description.length;

    if (descriptionCharsRemaining >= 0) {
      this.setState({ description, descriptionCharsRemaining });

      return true;
    }

    return false;
  }
}

const styles = {
  view: {
    backgroundColor: 'white',
    width: '100%',
  },
  bodyView: {
    marginTop: 7,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    flex: 1,
  },
  scrollView: {},
  profileImageView: {
    alignItems: 'center',
  },
  profileImage: {
    marginTop: 10,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  coverImage: {
    marginTop: 10,
    width: 300,
    height: 200,
  },
  profileEditView: {
    // width: 70,
    // height: 18,
    position: 'absolute',
    // right: 0,
    bottom: 25,
  },
  profileEditViewOpacity: {
    width: 80,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
  },
  inputView: {
    marginTop: 10,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  aboutView: {
    marginTop: 10,
    height: 90,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  inputHeaderText: {
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    color: 'gray',
    fontSize: 15,
  },
  aboutTextInput: {
    marginTop: 5,
    flex: 1,
    color: 'gray',
    fontSize: 15,
  },
  aboutTextRemaining: {
    fontSize: 12,
    position: 'absolute',
    color: Colors.purple,
    right: 5,
    top: 5,
  },
  tabs: {
    height: 40,
    marginLeft: 0,
    marginRight: 0,
  },
  tabItem: {
    height: 25,
  },
  tabSelected: {
  },
};

function stateToProps(state) {
  const { apiError, clapitAccountData, contacts } = state;
  return { apiError, clapitAccountData, contacts };
}

function dispatchToProps(dispatch) {
  const actions = _.extend({}, { clapitSaveProfile, clearApiError, fetchProfileData, fetchProfileRecentPosts,
    fetchProfilePopularPosts, fetchContactsToFollow, loadDeviceContacts });

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps)(EditProfilePage);

