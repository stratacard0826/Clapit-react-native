/* eslint no-unused-vars:0 */
import {
  ASSIGN_TWITTER_AUTH_DATA,
  TWITTER_LOGOUT,
  TWITTER_LOGOUT_SUCCESS,
  TWITTER_LOGOUT_ERROR,
} from '../constants/ActionTypes';

import { doFetch, doFetchLocal, createNonce, createSignatureV2, parseResponseParameters, hashParamTW } from './api';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import { clapitLoginOrConnect } from './clapit';

// const TWITTER_CONSUMER_KEY = 'P86DNAn565MoVUtvsfl5boT0K';
// const TWITTER_CONSUMER_SECRET = '9u9QeA1yndUfTzlMoGMOrtoXjydOekJZaBgcWgdJXiqQnejZjD';
const TWITTER_CONSUMER_KEY = '7BNH1Zdl9hbzQR6hyKytQvPU8';
const TWITTER_CONSUMER_SECRET = 'DWJdEokfqj2jZXNPNK1QsVdxJfbTFHao0hjwvVMyYCX1oDYma5';
// const TWITTER_OAUTH_CALLBACK = 'https://www.facebook.com/connect/login_success.html';
const TWITTER_OAUTH_CALLBACK = 'http://localhost:3000?platform=twitter';

function oauthRequestToken() {
  /*
   * Request example
   * https://api.twitter.com/oauth/request_token
   * ?oauth_nonce=95613465
   * &oauth_timestamp=1305586162
   * &oauth_consumer_key=653e7a6ecc1d528c516cc8f92cf98611
   * &oauth_signature_method=HMAC-SHA1
   * &oauth_version=1.0
   * &oauth_signature=7w18YS2bONDPL%2FzgyzP5XTr5af4%3D
   * &oauth_callback=http%3A%2F%2Fwww.example.com
   */
  const requestTokenData = {
    oauth_nonce: createNonce(8),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
    oauth_version: '1.0',
    oauth_callback: encodeURIComponent(TWITTER_OAUTH_CALLBACK),
    oauth_consumer_key: TWITTER_CONSUMER_KEY,
  };
  const KEY = `${encodeURIComponent(TWITTER_CONSUMER_SECRET)}&`;
  requestTokenData.oauth_signature = createSignatureV2('POST', 'https://api.twitter.com/oauth/request_token', requestTokenData, KEY);

  const headerParameterKeys = Object.keys(requestTokenData);
  let authorizationHeader = 'OAuth ';
  for (let i = 0; i < headerParameterKeys.length; i += 1) {
    if (i === headerParameterKeys.length - 1) {
      authorizationHeader += `${headerParameterKeys[i]}="${requestTokenData[headerParameterKeys[i]]}"`;
    } else {
      authorizationHeader += `${headerParameterKeys[i]}="${requestTokenData[headerParameterKeys[i]]}",`;
    }
  }
  const fetchParams = _.assign({}, {
    method: 'POST',
    body: {
      oauth_callback: encodeURIComponent(TWITTER_OAUTH_CALLBACK),
      signature_header: authorizationHeader,
      action: 'request_token',
      platform: 'twitter',
    },
    //headers: {
    //  'Authorization': authorizationHeader, // eslint-disable-line quote-props
    //},
  });
  /* return fetch('https://api.twitter.com/oauth/request_token', fetchParams)
      .then((response) => {
        const { status } = response;
        if (status >= 400) {
          return { error: { status } };
        }
        return response.text();
      }).then((result) => parseResponseParameters(result))
      .catch((err) => err);
  */
  return doFetchLocal('/twitter/request_token', fetchParams);
}
function accessToken(verifier, oauthTokenSecret) {
  /*
   * https://api.twitter.com/oauth/access_token
   * ?oauth_nonce=37026218
   * &oauth_timestamp=1305586309
   * &oauth_verifier=5d1b96a26b494074
   * &oauth_consumer_key=653e7a6ecc1d528c516cc8f92cf98611
   * &oauth_signature_method=HMAC-SHA1
   * &oauth_version=1.0
   * &oauth_token=72157626737672178-022bbd2f4c2f3432
   * &oauth_signature=UD9TGXzrvLIb0Ar5ynqvzatM58U%3D
   * */
  const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
  const accessTokenData = {
    oauth_nonce: createNonce(8),
    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
    oauth_consumer_key: TWITTER_CONSUMER_KEY,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    oauth_token: verifier.oauth_token,
    oauth_verifier: verifier.oauth_verifier,
  };
  const KEY_FOR_ACCESS = `${encodeURIComponent(TWITTER_CONSUMER_SECRET)}&${encodeURIComponent(oauthTokenSecret)}`;
  accessTokenData.oauth_signature = createSignatureV2('POST', accessTokenURL, accessTokenData, KEY_FOR_ACCESS);

  const headerParameterKeys = Object.keys(accessTokenData);
  let authorizationHeader = 'OAuth ';
  for (let i = 0; i < headerParameterKeys.length; i += 1) {
    if (i === headerParameterKeys.length - 1) {
      authorizationHeader += `${headerParameterKeys[i]}="${accessTokenData[headerParameterKeys[i]]}"`;
    } else {
      authorizationHeader += `${headerParameterKeys[i]}="${accessTokenData[headerParameterKeys[i]]}",`;
    }
  }
  const fetchParams = _.assign({}, {
    method: 'POST',
    body: {
      oauth_callback: encodeURIComponent(TWITTER_OAUTH_CALLBACK),
      signature_header: authorizationHeader,
      action: 'access_token',
      platform: 'twitter',
    },
    //headers: {
    //  'Authorization': authorizationHeader, // eslint-disable-line quote-props
    //},
  });
  /* return fetch(accessTokenURL, fetchParams)
      .then((response) => {
        const { status } = response;
        if (status >= 400) {
          return { error: { status } };
        }
        return response.text();
      }).then((result) => parseResponseParameters(result))
      .catch((err) => err);*/
  return doFetchLocal('/twitter/access_token', fetchParams);
}
function userShow(accessData) {
  /*
   * https://api.twitter.com/1.1/users/show.json
   * */
  const userShowURL = 'https://api.twitter.com/1.1/users/show.json';
  const userShowData = {
    oauth_consumer_key: TWITTER_CONSUMER_KEY,
    oauth_nonce: createNonce(8),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
    oauth_token: accessData.oauth_token,
    oauth_version: '1.0',
    screen_name: accessData.screen_name,
    user_id: accessData.user_id,
  };
  const KEY_FOR_ACCESS = `${encodeURIComponent(TWITTER_CONSUMER_SECRET)}&${encodeURIComponent(accessData.oauth_token_secret)}`;
  userShowData.oauth_signature = createSignatureV2('GET', userShowURL, userShowData, KEY_FOR_ACCESS);

  const headerParameterKeys = Object.keys(userShowData);
  let authorizationHeader = 'OAuth ';
  for (let i = 0; i < headerParameterKeys.length; i += 1) {
    if (i === headerParameterKeys.length - 1) {
      authorizationHeader += `${headerParameterKeys[i]}="${userShowData[headerParameterKeys[i]]}"`;
    } else {
      authorizationHeader += `${headerParameterKeys[i]}="${userShowData[headerParameterKeys[i]]}",`;
    }
  }
  const fetchParams = _.assign({}, {
    method: 'GET',
    headers: {
      'Authorization': authorizationHeader, // eslint-disable-line quote-props
    },
  });
  return fetch(`https://api.twitter.com/1.1/users/show.json?user_id=${accessData.user_id}&screen_name=${accessData.screen_name}`, fetchParams)
      .then((response) => {
        const { status } = response;
        if (status >= 400) {
          return { error: { status } };
        }
        return response.json();
      })
      .catch((err) => err);
}

function verifyCredentials(accessData) {
  /*
   * https://api.twitter.com/1.1/account/verify_credentials.json
   * */
  const userShowURL = 'https://api.twitter.com/1.1/account/verify_credentials.json';
  const userShowData = {
    oauth_consumer_key: TWITTER_CONSUMER_KEY,
    oauth_nonce: createNonce(8),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
    oauth_token: accessData.oauth_token,
    oauth_version: '1.0',
  };
  const KEY_FOR_ACCESS = `${encodeURIComponent(TWITTER_CONSUMER_SECRET)}&${encodeURIComponent(accessData.oauth_token_secret)}`;
  userShowData.oauth_signature = createSignatureV2('GET', userShowURL, userShowData, KEY_FOR_ACCESS);

  const headerParameterKeys = Object.keys(userShowData);
  let authorizationHeader = 'OAuth ';
  for (let i = 0; i < headerParameterKeys.length; i += 1) {
    if (i === headerParameterKeys.length - 1) {
      authorizationHeader += `${headerParameterKeys[i]}="${userShowData[headerParameterKeys[i]]}"`;
    } else {
      authorizationHeader += `${headerParameterKeys[i]}="${userShowData[headerParameterKeys[i]]}",`;
    }
  }
  const fetchParams = _.assign({}, {
    // method: 'GET',
    // headers: {
    //  'Authorization': authorizationHeader, // eslint-disable-line quote-props
    // },
    method: 'POST',
    body: {
      oauth_callback: encodeURIComponent(TWITTER_OAUTH_CALLBACK),
      signature_header: authorizationHeader,
      action: 'verifyCredentials',
      platform: 'twitter',
    },
  });
  /* return fetch('https://api.twitter.com/1.1/account/verify_credentials.json', fetchParams)
      .then((response) => {
        const { status } = response;
        if (status >= 400) {
          return { error: { status } };
        }
        return response.json();
      })
      .catch((err) => err); */
  return doFetchLocal('/twitter/verifyCredentials', fetchParams);
}
export function twitterOauthVerifier() {
  return (dispatch) => {
    accessToken(parseResponseParameters(window.location.search.replace('?', '')), localStorage.getItem('twitter_oauth_token_secret')).then((res) => {
      const authToken = res.oauth_token;
      const authTokenSecret = res.oauth_token_secret;

      // authToken:"3342282011-YYHPYbM8yoC6uLgtRAFqSNv0QJlnZF9BYt4JLA8"
      // authTokenSecret:"96qr40AVmptabpp7mwMP2nGYvEkuu9ZfocioznKnsUaqE"
      // userID:"3342282011"
      // userName:"sjsmaster"

      verifyCredentials(res).then((userData) => {
        const userDataRes = JSON.parse(userData);
        const userID = userDataRes.id_strt;
        const userName = userDataRes.screen_name;
        const twitterAuthData = _.assign({}, { authToken }, { userID }, { userName }, { authTokenSecret });
        console.log('twitterAuthData', twitterAuthData);
        browserHistory.push('/');
        dispatch(assignTwitterAuthData(twitterAuthData));
        dispatch(clapitLoginOrConnect('twitter', twitterAuthData));
      })
          .catch((err) => {
            console.log(err);
          });
    })
        .catch((err) => {
          console.log(err);
        });
  };
}
export function twitterLogin() {
  return (dispatch) => {  // eslint-disable-line no-unused-vars
    oauthRequestToken()
        .then((response) => {
          console.log(response);
          // console.log('URL response', response);
          if (Object.prototype.hasOwnProperty.call(response, 'oauth_token') === false) {
            throw new Error('Oauth request token was not received');
          }
          localStorage.setItem('twitter_oauth_token_secret', response.oauth_token_secret);
          const browserRef = window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`;
          /* const nY = 500;
          const oY = 600;
          const params = ['toolbar=no',
            `location=${(window.opera ? 'no' : 'yes')}`,
            'directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no',
            `width=${nY}`,
            `height=${oY}`,
            `top=${((window.screen.height - oY) / 2)}`,
            `left=${((window.screen.width - nY) / 2)}`].join();
          // const browserRef = window.open(`https://api.twitter.com/oauth/authenticate?oauth_token=${response.oauth_token}`, '_blank', params);
          const browserRef = window.open(`https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`, '_blank', params);
          if (!browserRef) {
            alert('Allow pop-up windows for this site.');
          } else {
            const browserRefOpened = setInterval(() => {
              // console.log('browserRef: ', browserRef.closed);
              if (browserRef.closed === false) {
                if ((browserRef.window.location.href).indexOf(TWITTER_OAUTH_CALLBACK) === 0) {
                  const callbackResponse = (browserRef.window.location.href).split('?')[1];
                  const verifier = parseResponseParameters(callbackResponse);
                  setTimeout(() => {
                    browserRef.close();
                    clearInterval(browserRefOpened);
                  }, 10);
                  if (Object.prototype.hasOwnProperty.call(verifier, 'oauth_verifier') === false) {
                    throw new Error('Browser authentication failed to complete.  No oauth_verifier was returned');
                  }
                  // console.log('parameterMap: ', verifier, response.oauth_token_secret);
                   accessToken(verifier, response.oauth_token_secret).then((res) => {
                    const authToken = res.oauth_token;
                    const authTokenSecret = res.oauth_token_secret;

                    // authToken:"3342282011-YYHPYbM8yoC6uLgtRAFqSNv0QJlnZF9BYt4JLA8"
                    // authTokenSecret:"96qr40AVmptabpp7mwMP2nGYvEkuu9ZfocioznKnsUaqE"
                    // userID:"3342282011"
                    // userName:"sjsmaster"

                    // console.log('OauthTWData: ', res);
                    verifyCredentials(res).then((userData) => {
                      const userID = userData.id_strt;
                      const userName = userData.screen_name;
                      const twitterAuthData = _.assign({}, { authToken }, { userID }, { userName }, { authTokenSecret });
                      // console.log('twitterAuthData', twitterAuthData);
                      dispatch(assignTwitterAuthData(twitterAuthData));
                      dispatch(clapitLoginOrConnect('twitter', twitterAuthData));
                    })
                        .catch((err) => {
                          console.log(err);
                        });
                  })
                      .catch((err) => {
                        console.log(err);
                      });
                }
              } else if (browserRef.closed === true) {
                setTimeout(() => {
                  browserRef.close();
                  clearInterval(browserRefOpened);
                }, 10);
              }
            }, 250);
          }*/
        })
        .catch((err) => {
          console.log(err);
        });
    /* oauthRequestToken()
        .then((response) => {
          // console.log('URL response', response);
          if (Object.prototype.hasOwnProperty.call(response, 'oauth_token') === false) {
            throw new Error('Oauth request token was not received');
          }

          const nY = 500;
          const oY = 600;
          const params = ['toolbar=no',
            `location=${(window.opera ? 'no' : 'yes')}`,
            'directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no',
            `width=${nY}`,
            `height=${oY}`,
            `top=${((window.screen.height - oY) / 2)}`,
            `left=${((window.screen.width - nY) / 2)}`].join();
          // const browserRef = window.open(`https://api.twitter.com/oauth/authenticate?oauth_token=${response.oauth_token}`, '_blank', params);
          const browserRef = window.open(`https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`, '_blank', params);
          if (!browserRef) {
            alert('Allow pop-up windows for this site.');
          } else {
            const browserRefOpened = setInterval(() => {
              // console.log('browserRef: ', browserRef.closed);
              if (browserRef.closed === false) {
                if ((browserRef.window.location.href).indexOf(TWITTER_OAUTH_CALLBACK) === 0) {
                  const callbackResponse = (browserRef.window.location.href).split('?')[1];
                  const verifier = parseResponseParameters(callbackResponse);
                  setTimeout(() => {
                    browserRef.close();
                    clearInterval(browserRefOpened);
                  }, 10);
                  if (Object.prototype.hasOwnProperty.call(verifier, 'oauth_verifier') === false) {
                    throw new Error('Browser authentication failed to complete.  No oauth_verifier was returned');
                  }
                  // console.log('parameterMap: ', verifier, response.oauth_token_secret);
                  accessToken(verifier, response.oauth_token_secret).then((res) => {
                    const authToken = res.oauth_token;
                    const authTokenSecret = res.oauth_token_secret;

                    // authToken:"3342282011-YYHPYbM8yoC6uLgtRAFqSNv0QJlnZF9BYt4JLA8"
                    // authTokenSecret:"96qr40AVmptabpp7mwMP2nGYvEkuu9ZfocioznKnsUaqE"
                    // userID:"3342282011"
                    // userName:"sjsmaster"

                    // console.log('OauthTWData: ', res);
                    verifyCredentials(res).then((userData) => {
                      const userID = userData.id_strt;
                      const userName = userData.screen_name;
                      const twitterAuthData = _.assign({}, { authToken }, { userID }, { userName }, { authTokenSecret });
                      // console.log('twitterAuthData', twitterAuthData);
                      dispatch(assignTwitterAuthData(twitterAuthData));
                      dispatch(clapitLoginOrConnect('twitter', twitterAuthData));
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                }
              } else if (browserRef.closed === true) {
                setTimeout(() => {
                  browserRef.close();
                  clearInterval(browserRefOpened);
                }, 10);
              }
            }, 250);
          }
        })
        .catch((err) => {
          console.log(err);
        });*/
  };
}

export function twitterLogout() {
  return (dispatch) => {
    // TwitterManager.logout()

    dispatch(startTwitterLogout());

    return doFetch('Accounts/disconnect/twitter', {
      method: 'POST',
    }).then((data) => {
      dispatch(twitterLogoutSuccess(data));
    }).catch((err) => {
      dispatch(twitterLogoutError(err));
    });
  };
}

function startTwitterLogout() {
  return {
    type: TWITTER_LOGOUT,
  };
}

function twitterLogoutSuccess(accountData) {
  return {
    type: TWITTER_LOGOUT_SUCCESS,
    payload: {
      accountData,
    },
  };
}

function twitterLogoutError(error) {
  return {
    type: TWITTER_LOGOUT_ERROR,
    payload: {
      error,
    },
  };
}

function assignTwitterAuthData(authData) {
  return {
    type: ASSIGN_TWITTER_AUTH_DATA,
    payload: authData,
  };
}
