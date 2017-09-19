import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clapitLogout } from '../../redux/actions/clapit';
import * as friendsActions from '../../redux/actions/friends';
import * as networkActions from '../../redux/actions/network';
import { cloudinaryUpload } from '../../redux/actions/fileUpload';
import { createMedia, createPost } from '../../redux/actions/api';
import * as AppActions from '../../redux/actions/app';
import Dropzone from 'react-dropzone';
import Video from 'react-html5video';
//import 'react-html5video/dist/ReactHtml5Video.css';
import AppBar from 'material-ui/AppBar';
import SearchUI from '../TagAutocompleteInput/SearchUI';
import TagAutocompleteInput from '../TagAutocompleteInput';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Images } from '../../themes';
import { navigateToProfile } from '../../utils/navigator';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';

// const screenSize = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
// const appBarMargin = (screenSize - MAX_PAGE_WIDTH) / 2;
const appBarMargin = (1000 - MAX_PAGE_WIDTH) / 2;

function handleActive(url) {
  browserHistory.push(url);
}

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.uploadPreview = this.uploadPreview.bind(this);
    this.onClap = this.onClap.bind(this);
    this.handleCloudinary = this.handleCloudinary.bind(this);
    this._createMedia = this._createMedia.bind(this);
    this._createPost = this._createPost.bind(this);
    this.state = {
      open: false,
      searchValue: '',
      commentValue: '',
      modalPost: false,
      uploadedFile: null,
      uploadedFileCloudinary: null,
    };
  }
  componentDidMount() {
    const { clapitAccountData, fetchFriendsData, fetchRecentData } = this.props;
    // const fetchData = fetchFriendsData;
    // fetchData(clapitAccountData.id, 0);
  }
  onImageDrop(acceptedFiles, rejectedFiles) {
    let self = this;
    this.setState({
      uploadedFile: acceptedFiles[0],
    });
    setTimeout(() => {
      self.handleCloudinary();
    }, 5);
  }

  handleCloudinary() {
    let self = this;
    const { cloudinaryUpload } = this.props;
    const { uploadedFile } = this.state;
    if (uploadedFile !== null) {
      const exp = uploadedFile.type.split('/')[0];
      switch (exp) {
        case 'video':
        case 'image':
          cloudinaryUpload(uploadedFile.type, uploadedFile, (err, res) => {
            if (err || res.status !== 200) {
              return false;
            }
            self.setState({
              uploadedFileCloudinary: res.body,
            });
            // this._createMedia(url);
            console.log('~~~~~cloudinaryUpload', res.body);
          });
          break;
        default:
      }
    }
  }
  onClap() {
    const { uploadedFile, uploadedFileCloudinary, commentValue } = this.state;
    const {  clapitAccountData: { id: userId }, reloadUserPosts, cloudinaryUpload } = this.props;
    if (uploadedFile !== null && uploadedFileCloudinary !== null) {
      const { resource_type, url, format } = uploadedFileCloudinary;
      switch (resource_type) {
        case 'video':
          this._createMedia(url);
          break;
        case 'image':
          this._createMedia(url)
          break;
        default:
      }
    } else {

    }
  }
  _createMedia(url) {
    createMedia(url)
        .then((data) => {
          if (data.error) {
            return false;
          }
          let { id: mediaId } = data;
          this._createPost(mediaId, url);
        });
  }

  _createPost(mediaId, url) {
    const { commentValue } = this.state;

    const postData = {
      isPublish: true,
      fbShare: false,
      twShare: false,
      igShare: false,
      data: {
        title: commentValue, mediaId, url,
      },
    };

    const {  clapitAccountData: { id: userId }, reloadUserPosts, cloudinaryUpload } = this.props;
    const { uploadedFile, uploadedFileCloudinary } = this.state;
    if (uploadedFile !== null && uploadedFileCloudinary !== null) {
      const { resource_type, url, format } = uploadedFileCloudinary;
      switch (resource_type) {
        case 'video':
            // postData.data.url = url;  // original video URL
            createPost(postData)
                .then((res) => {
                  if (reloadUserPosts) {
                    reloadUserPosts(userId);
                    this.setState({
                      commentValue: '',
                      uploadedFile: null,
                      uploadedFileCloudinary: null,
                    });
                  }
                });

          break;
        case 'image':
          createPost(postData)
              .then((res) => {
                if (reloadUserPosts) {
                  reloadUserPosts(userId);
                  this.setState({
                    commentValue: '',
                    uploadedFile: null,
                    uploadedFileCloudinary: null,
                  });
                }
              });
          break;
      }
    }
  }
  modalPostOpen = () => {
    this.setState({ modalPost: true });
  };

  modalPostClose = () => {
    this.setState({ modalPost: false });
  };
  modalCommentChange = (event) => {
    const { value } = event.target;
    this.setState({
      commentValue: value,
    });
  };

  handleChange = (event) => {
    const { value } = event.target;
    this.setState({
      searchValue: value,
    });
    const sliceTag = value.slice(1);
    if (value !== '') {
      if (value.startsWith('#') && value.length > 1) {
        browserHistory.push({ pathname: `/search/hashtag/${sliceTag}`, state: { type: 'hashtag', tag: `#${sliceTag}` } });
      } else if (!value.startsWith('#')) {
        browserHistory.push({ pathname: `/search/user/${value}`, state: { type: 'user', tag: `#${value}` } });
      }
    } else {
      browserHistory.goBack();
    }
  };
  rightItems = () => (
    <div style={{}}>
      <IconButton
        style={{ padding: 0, width: 42 }}
        tooltipPosition="bottom-left"
        tooltip="Open Calls"
        onTouchTap={browserHistory.push.bind(this, '/opencalls')}
      >
        <img src={Images.open_calls} width="34px" alt="" />
      </IconButton>
      <IconButton
        style={{ padding: 0, width: 42 }}
        onTouchTap={this.modalPostOpen} // eslint-disable-line react/prop-types
        tooltipPosition="bottom-left"
        tooltip="New Post"
      >
        <img src={Images.ico_post} width="36px" alt="" />
      </IconButton>
      <IconButton
        onTouchTap={this.handleToggle} // eslint-disable-line react/prop-types
        style={{ padding: 0, width: 44 }}
      >
        <img src={Images.menu} width="40px" alt="" />
        {
          // <MenuIcon color={'#b385ff'} />
        }
      </IconButton>
    </div>
  );
  leftItems = () => (
      <IconButton
        onTouchTap={browserHistory.push.bind(this, '/feed/best')}
        style={{ padding: 0, margin: 0,  }}
        iconStyle={{ padding: 0, margin: 0, width: 150  }}
      >
        <img src={Images.clapit_top_bar} alt="" />
      </IconButton>

  );
  centerItems = () => (
      <SearchUI
        placeholder="Search"
        underlineFocusStyle={{ borderColor: '#b385ff' }}
        value={this.state.value}
        onChange={this.handleChange}
      />
  );
  handleToggle = () => this.setState({ open: !this.state.open });
  handleClose = () => this.setState({ open: false });
  goToMyProfile = () => {
    const { clapitAccountData } = this.props;
    navigateToProfile({ ...clapitAccountData, isMyProfile: true });
  };
  uploadPreview() {
    const { uploadedFile, uploadedFileCloudinary } = this.state;
    let patternPreview = null;
    if (uploadedFile !== null) {
      const exp = uploadedFile.type.split('/')[0];
      switch (exp) {
        case 'video':
          patternPreview = null;
          break;
        case 'image':
          patternPreview = (<div style={{ background: `url(${uploadedFile.preview})  center center / cover no-repeat`, width: '50%', height: 200 }}></div>);
          break;
        default:
          patternPreview = null;
      }
    }
    if (uploadedFile !== null && uploadedFileCloudinary !== null) {
      const { resource_type, url, format } = uploadedFileCloudinary;
      switch (resource_type) {
        case 'video':
          patternPreview = (<Video controls autoPlay loop width="300" height="200">
                    <source src={url} type={`${resource_type}/${format}`} />
                  </Video>);
          break;
        case 'image':
          patternPreview = (<div style={{ background: `url(${url})  center center / cover no-repeat`, width: '50%', height: 200 }}></div>);
          break;
        default:
          patternPreview = null;
      }
    }
    return patternPreview;
  }
  render() {
    //console.log('~~~~HEAD this.state', this.state);
    //console.log('~~~~HEAD this.props', this.props);
    const { clapitAccountData, clapitLogout } = this.props;
    const styles = require('./ReactHtml5Video.scss');
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.modalPostClose}
      />,
      <FlatButton
        label="Post"
        primary
        onTouchTap={() => { this.modalPostClose(); this.onClap(); }}
      />,
    ];
    return (
      <div>
        {
          clapitAccountData && clapitAccountData.accessToken ?
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                padding: '0px',
                margin: '0px',
                minWidth: '100%',
                width: '100%',
                zIndex: 99,
              }}
            >
              <AppBar
                style={{ backgroundColor: '#ffffff'}}
                // showMenuIconButton={false}
                iconElementRight={this.rightItems()}
                iconElementLeft={this.leftItems()}
                iconStyleLeft={styles.leftItems}
                iconStyleRight={{ marginRight: appBarMargin - 30}}
                title={this.centerItems()}
                titleStyle={styles.centerItems}
              >
              </AppBar>
              <Dialog
                title="New Post"
                actions={actions}
                modal={false}
                open={this.state.modalPost}
                onRequestClose={this.modalPostClose}
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                  <Dropzone
                    onDrop={this.onImageDrop}
                    multiple={false}
                    accept="image/*,video/*"
                  >
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>Drop an image/video or click to select a file to upload.</div>
                  </Dropzone>
                  {
                  this.uploadPreview()
                  }
                </div>

                <TagAutocompleteInput
                  style={{ height: '100%', width: '100%', paddingLeft: 15, paddingRight: 15 }}
                  value={this.state.commentValue}
                  onChange={this.modalCommentChange}
                  placeholder="Enter description"
                />
              </Dialog>
              <Drawer
                open={this.state.open}
                docked={false}
                openSecondary
                onRequestChange={(open) => this.setState({ open })}
              >
                <MenuItem style={styles.menuItem} hoverColor={'#FF0000'} onTouchTap={() => { this.handleClose(); handleActive('/feed/best'); }}>Best</MenuItem>
                <MenuItem style={styles.menuItem} onTouchTap={() => { this.handleClose(); handleActive('/alerts'); }}>Alerts</MenuItem>
                <MenuItem style={styles.menuItem} onTouchTap={() => { this.handleClose(); this.goToMyProfile(); }}>My Profile</MenuItem>
                <MenuItem style={styles.menuItem} onTouchTap={() => { this.handleClose(); handleActive('/editprofile'); }}>Edit Profile</MenuItem>
                <MenuItem style={styles.menuItem} onTouchTap={() => { this.handleClose(); handleActive('/terms'); }}>Terms of use</MenuItem>
                <MenuItem style={styles.menuItem} onTouchTap={() => { this.handleClose(); handleActive('/privacy'); }}>Privacy Policy</MenuItem>
                <MenuItem style={styles.menuItem} onTouchTap={() => { this.handleClose(); clapitLogout(); handleActive('/'); }}>Sign out</MenuItem>
              </Drawer>
            </div> : null
        }
      </div>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, { clapitLogout }, { cloudinaryUpload }, friendsActions, networkActions, AppActions);
  return bindActionCreators(actions, dispatch);
}

// const mapStateToProps = createStructuredSelector({
//  clapitAccountData: selectClapitAccountData(),
// });

const mapStateToProps = (state) => {
  const { friends, clapitAccountData, contacts } = state;
  return { friends, clapitAccountData, contacts };
};

const styles = {
  menuItem: {
    borderBottom: '1px solid #b385ff',
  },
  leftItems: {
    margin: `0px 0px 0px ${appBarMargin}px`,
    padding: 0,
    width: 130,
    height: 64,
    overflow: 'hidden',
    position: 'relative',
    top: -5,
    left: (appBarMargin > 0) ? -50 : -40
  },
  centerItems: {
    //width: screenSize - 200,
    width: 1000 - 200,
    position: 'absolute',
    left: (appBarMargin > 0) ? 120 + appBarMargin : 130 + appBarMargin
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);

