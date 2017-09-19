/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';

import FacebookLogin from 'react-facebook-login';

// import messages from './messages';
// import { loadRepos } from '../App/actions';
import { changeAuthType, changeTabIndex } from '../../redux/actions/homeUI';
import Link from './wrappers/link';
import LinkImage from './wrappers/linkImage';
import LinkChange from './wrappers/linkChange';
import MobileBackground from './wrappers/mobileBackground';
import UnderBlock from './wrappers/underBlock';
import Panel from './wrappers/panel';
import PanelBlock from './wrappers/panelBlock';
import ArticleContainer from './wrappers/articleContainer';
import Img from './wrappers/Img';
import ImgStore from './wrappers/imgStore';
import HorizontalDiv from './wrappers/horizontalDiv';
import LineDiv from './wrappers/lineDiv';
import TextDiv from './wrappers/textDiv';
import InputDiv from './wrappers/inputDiv';
import Input from './wrappers/input';
import P from './wrappers/p';
import UnderP from './wrappers/underP';
import H2 from './wrappers/h2';
import Button from './wrappers/button';
import Span from './wrappers/span';
import BottomDiv from './wrappers/bottomDiv';
import MarketDiv from './wrappers/marketDiv';
import PUnder from './wrappers/pUnder';
import { browserHistory } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import PageContainer from '../../components/PageContainer';
import Feed from '../../containers/Feed';
import Friends from '../../containers/Friends';
import Footer from '../../components/Footer';
import ClapitLogo from './images/clapit_top_bar.png';
import AppStoreImage from './images/app_store.png';
import GoogleStoreImage from './images/google_store.png';
import { Colors } from '../../themes';
import { MAX_PAGE_WIDTH, HEADER_HEIGHT } from '../../redux/constants/Size';

import * as EmailActions from '../../redux/actions/emailAuth';
import * as FacebookActions from '../../redux/actions/facebook';
import * as TwitterActions from '../../redux/actions/twitter';
import * as friendsActions from '../../redux/actions/friends';
import { clearApiError } from '../../redux/actions/clapit';
import { hashParamTW } from '../../redux/actions/api';
import {Images} from '../../themes';

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
const FB_APP_ID = '501904766628640';

function handleActive(tab) {
  browserHistory.push(tab.props['data-route']);
}
class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderPanelBlock = this.renderPanelBlock.bind(this);
    this.renderPanelBlockUnder = this.renderPanelBlockUnder.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.confirmPasswordChange = this.confirmPasswordChange.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      clapitAccountData: null,
    };
  }
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentWillMount() {
    if (hashParamTW('oauth_token') && hashParamTW('oauth_verifier')) {
      this.props.onTWOauthVerifier();
    }
  }
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }
  onButtonPress() {
    const { onEmailLogin, onEmailSignup } = this.props;

    if (this.props.authType === 'signup') {
      console.warn('signup');
      if (!this.state.email || !this.state.password || !this.state.confirmPassword || this.state.password !== this.state.confirmPassword) {
        console.log('All fields are required. Password must match.');
        return;
      }
      if (!emailRegex.test(this.state.email)) {
        console.log('Must be valid e-mail address');
        this.setState({ email: '' });
        return;
      }
      onEmailSignup(this.state.email, this.state.password, () => {
        onEmailLogin(this.state.email, this.state.password, (err) => {
          if (err) console.log('We\re sorry, please try to log in again.');
        }, true);
      });
    } else {
      console.warn('login');
      if (!this.state.password || !this.state.email) {
        console.log('Please fill both e-mail and password.');
      }
      onEmailLogin(this.state.email, this.state.password, (err) => {
        if (err) console.log('We\'re sorry, please try to log in again.');
      });
    }
  }
  emailChange(evt) {
    const { value: email } = evt.target;
    this.setState({ email });
  }

  passwordChange(evt) {
    const { value: password } = evt.target;
    this.setState({ password });
  }

  confirmPasswordChange(evt) {
    const { value: confirmPassword } = evt.target;
    this.setState({ confirmPassword });
  }
  clearState() {
    this.setState({
      email: '',
      password: '',
      confirmPassword: '',
    });
  }
  responseFacebook(response) {
    this.props.onFbLogin(response);
  }
  handleChangeTab(value) {
    const { clapitAccountData, onFetchFriendsData, onFetchRecentData, tabIndex } = this.props;
    this.props.onChangeTabIndex(value);
    const fetchData = value === 1 ? onFetchRecentData : onFetchFriendsData;
    fetchData(clapitAccountData.id, 0);
     console.log("~~~~~~ handleChangeTab", value);
  }
  renderPanelBlockUnder() {
    const { authType } = this.props;

    switch (authType) {
      case 'signup':
        return (
          <P>
            Have an account? <LinkChange href="javascript:;" onClick={() => { this.clearState(); this.props.onChangeAuthType('login'); }}>Log in</LinkChange>
          </P>
        );
      case 'login':
        return (
          <P>
            Don't have an account? <LinkChange href="javascript:;" onClick={() => { this.clearState(); this.props.onChangeAuthType('signup'); }}>Sign up</LinkChange>
          </P>
        );
      default:
        return (
          <div>
          </div>
        );
    }
  }
  renderFeed() {
    const { clapitAccountData, onFetchFriendsData } = this.props;
    //onFetchFriendsData(clapitAccountData.id, 0, true);
    return (
      <div style={{ marginTop: HEADER_HEIGHT }}>
        <Tabs
          onChange={this.handleChangeTab}
          value={this.props.tabIndex}
          className="tabs_feed"
          style={{ width: MAX_PAGE_WIDTH, margin: 'auto' }}
          inkBarStyle={{ backgroundColor : Colors.purple}}
          tabItemContainerStyle={{ backgroundColor :'inherit' }}
        >
          <Tab
            label="Best"
            value={0}
            data-route="/feed/best"
            style={styles.tab}
            onActive={handleActive}
          />
          <Tab
            label="New"
            value={1}
            data-route="/feed/new"
            style={styles.tab}
            onActive={handleActive}
          />
          <Tab
            label="Friends"
            value={2}
            data-route="/feed/friends"
            style={styles.tab}
            onActive={handleActive}
          />
        </Tabs>
        <SwipeableViews
          index={this.props.tabIndex}
          onChangeIndex={this.handleChangeTab}
        >
          <div>
            { this.props.tabIndex === 0 ?
              <PageContainer style={{marginTop: 0}}>
                <Feed isMainFeed />
              </PageContainer>
              :
              null
            }

          </div>
          <div>
            { this.props.tabIndex === 1 ?
              <PageContainer style={{marginTop: 0}}>
                <Friends toggleFeedType="New" />
              </PageContainer>
              :
              null
            }
          </div>
          <div>
            { this.props.tabIndex === 2 ?
              <PageContainer style={{marginTop: 0}}>
                <Friends toggleFeedType="Friends" />
              </PageContainer>
              :
              null
            }
          </div>
        </SwipeableViews>

      </div>
    );
  }

  renderSignupSignIn() {
    return (
      <div>
        <ArticleContainer>
          <MobileBackground />
          <Panel>
            <div style={{ backgroundColor: '#fff', border: '1px solid #efefef', borderRadius: '1px', margin: '0 0 10px', padding: '10px 0' }}>
              {
                <Img src={ClapitLogo} alt="" />
              }
              <BottomDiv>
                {this.renderPanelBlock()}
              </BottomDiv>
            </div>
            <PanelBlock>
              {this.renderPanelBlockUnder()}
            </PanelBlock>
            <UnderBlock>
              <PUnder>
                Get the app.
              </PUnder>
              <MarketDiv>
                <LinkImage target="_blank" href="https://itunes.apple.com/au/app/clapit/id1062124740?mt=8">
                  {
                    <ImgStore alt="" src={AppStoreImage} />
                  }

                </LinkImage>
                <LinkImage target="_blank" href="https://itunes.apple.com/au/app/clapit/id1062124740?mt=8">
                  {
                    <ImgStore alt="" src={GoogleStoreImage} />
                  }
                </LinkImage>
              </MarketDiv>
            </UnderBlock>
          </Panel>
        </ArticleContainer>
        <Footer />
      </div>
    );
  }

  renderPanelBlock() {
    const { authType } = this.props;
    const { email, password, confirmPassword } = this.state;

    switch (authType) {
      case 'signup':
        return (
          <div>
            <H2>Sign up to see photos and videos from your friends.</H2>
            <Span>
              <FacebookLogin
                appId={FB_APP_ID}
                // autoLoad
                version="2.8"
                fields="name,first_name,last_name,email,picture,id,link,gender,locale,timezone,updated_time,verified"
                textButton=" Log in with Facebook"
                callback={this.responseFacebook}
                cssClass="facebookButtonClass"
                icon={<i className="fa fa-facebook-official" aria-hidden="true" />}
              />
            </Span>
            <Span>
              <LinkChange href="javascript:;" onClick={() => { this.props.onTWLogin(); }}>
                <Button style={{ backgroundColor: '#326ada', textAlign: 'left', paddingLeft: 20 }}>
                  <i className="fa fa-twitter-square" aria-hidden="true" /> Log in with Twitter
                </Button>
              </LinkChange>
            </Span>
            <HorizontalDiv>
              <LineDiv />
              <TextDiv>or</TextDiv>
              <LineDiv />
            </HorizontalDiv>
            <InputDiv>
              <Input
                type="text"
                aria-describedby=""
                aria-label="Email"
                aria-required="true"
                autocapitalize="off"
                autocorrect="off"
                name="emailOrPhone"
                placeholder="Email"
                value={email}
                onChange={this.emailChange}
              />
            </InputDiv>
            <InputDiv>
              <Input
                type="password"
                aria-describedby=""
                aria-label="Password"
                aria-required="true"
                autocapitalize="off"
                autocorrect="off"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.passwordChange}
              />
            </InputDiv>
            <InputDiv>
              <Input
                type="password"
                aria-describedby=""
                aria-label="Confirm Password"
                aria-required="true"
                autocapitalize="off"
                autocorrect="off"
                name="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={this.confirmPasswordChange}
              />
            </InputDiv>
            <Span>
              <Button onClick={this.onButtonPress}>Sign up</Button>
            </Span>
            <UnderP>
              By signing up, you agree to our <Link to="/tos">Terms</Link> {'&'} <Link to="/privacy">Privacy Policy</Link>
            </UnderP>
          </div>
        );
      case 'login':
        return (
          <div>
            <div>
              <InputDiv>
                <Input
                  type="text"
                  aria-describedby=""
                  aria-label="Email"
                  aria-required="true"
                  autocapitalize="off"
                  autocorrect="off"
                  name="emailOrPhoneLogin"
                  placeholder="Email"
                  value={email}
                  onChange={this.emailChange}
                />
              </InputDiv>
              <InputDiv>
                <Input
                  type="password"
                  aria-describedby=""
                  aria-label="Password"
                  aria-required="true"
                  autocapitalize="off"
                  autocorrect="off"
                  name="passwordLogin"
                  placeholder="Password"
                  value={password}
                  onChange={this.passwordChange}
                />
              </InputDiv>
              <Span>
                <Button onClick={this.onButtonPress} >Log in</Button>
              </Span>
              <HorizontalDiv>
                <LineDiv />
                <TextDiv>or</TextDiv>
                <LineDiv />
              </HorizontalDiv>
              <Span>
                <FacebookLogin
                  appId={FB_APP_ID}
                  // autoLoad
                  version="2.8"
                  fields="name,first_name,last_name,email,picture,id,link,gender,locale,timezone,updated_time,verified"
                  textButton=" Log in with Facebook"
                  callback={this.responseFacebook}
                  cssClass="facebookButtonClass"
                  icon={<i className="fa fa-facebook-official" aria-hidden="true" />}
                />
              </Span>
              <Span>
                <LinkChange href="javascript:;" onClick={() => { this.props.onTWLogin(); }}>
                  <Button style={{ backgroundColor: '#326ada', textAlign: 'left', paddingLeft: 20 }}>
                    <i className="fa fa-twitter-square" aria-hidden="true" /> Log in with Twitter
                  </Button>
                </LinkChange>
              </Span>
            </div>
          </div>
        );
      default:
        return (
          <div>
            default
          </div>
        );
    }
  }
  render() {
    /* let mainContent = null;

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);

    // Show an error if there is one
    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);

    // If we're not loading, don't have an error and there are repos, show the repos
    } else if (this.props.repos !== false) {
      mainContent = (<List items={this.props.repos} component={RepoListItem} />);
    } */
    // console.log(this.props);
    return (
      <article>
        <Helmet
          title="Home"
          meta={[
            { name: 'description', content: 'Clapit' },
          ]}
        />

        {
          this.props.clapitAccountData && this.props.clapitAccountData.accessToken ?
            this.renderFeed()
          :
            this.renderSignupSignIn()
        }

      </article>
    );
  }
}

HomePage.propTypes = {
  // loading: React.PropTypes.bool,
  // error: React.PropTypes.oneOfType([
  //  React.PropTypes.object,
  //  React.PropTypes.bool,
  // ]),
  // repos: React.PropTypes.oneOfType([
  //  React.PropTypes.array,
  //  React.PropTypes.bool,
  // ]),
  // onClearApiError: React.PropTypes.func,
  onTWLogin: React.PropTypes.func,
  onFbLogin: React.PropTypes.func,
  onEmailLogin: React.PropTypes.func,
  onEmailSignup: React.PropTypes.func,
  // onEmailLogout: React.PropTypes.func,
  // onClearAuthErrorr: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  authType: React.PropTypes.string,
  tabIndex: React.PropTypes.number,
  onChangeTabIndex: React.PropTypes.func,
  onChangeAuthType: React.PropTypes.func,
  // onChangeUsername: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onFetchFriendsData: (id, page, f) => dispatch(friendsActions.fetchFriendsData(id, page, f)),
    onFetchRecentData: (id, page, f) => dispatch(friendsActions.fetchRecentData(id, page, f)),
    onChangeTabIndex: (index) => dispatch(changeTabIndex(index)),
    onTWLogin: () => dispatch(TwitterActions.twitterLogin()),
    onTWOauthVerifier: () => dispatch(TwitterActions.twitterOauthVerifier()),
    onFbLogin: (data) => dispatch(FacebookActions.fbLogin(data)),
    onClearApiError: () => dispatch(clearApiError()),
    onEmailLogin: (email, password, callback, isNew) => {
      dispatch(EmailActions.emailLogin(email, password, callback, isNew));
    },
    onEmailSignup: (email, password, callback) => dispatch(EmailActions.emailSignup(email, password, callback)),
    onEmailLogout: () => dispatch(EmailActions.emailLogout()),
    onClearAuthErrorr: () => dispatch(EmailActions.clearAuthError()),
    onChangeAuthType: (authType) => dispatch(changeAuthType(authType)),
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const styles = {
  tab: {
    color: 'black',
    textTransform: 'normal',
    fontSize: 16,
  },
};

const mapStateToProps = (state) => {
  // console.log('~~~~~~~mapStateToProps HOMEPAGE', state);
  const { clapitAccountData, homeUI } = state;
  const { authType, slideIndex } = homeUI;
  return { clapitAccountData, authType, tabIndex: slideIndex };
};

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
