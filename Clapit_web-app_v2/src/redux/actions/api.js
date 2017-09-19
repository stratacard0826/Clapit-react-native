import Promise from 'promise';
import request from 'superagent';
import _ from 'lodash';
import queryString from 'query-string';
import * as CryptoJS from 'crypto-js';


// export const STAGING_BASE_URL = 'https://api.clapit.com';
// export const PROD_BASE_URL = 'https://api.clapit.com';
export const STAGING_BASE_URL = 'http://staging-api.clapit.com'
export const PROD_BASE_URL = 'http://staging-api.clapit.com';

const CLOUD_NAME = 'dz4nkgvsp';
const UPLOAD_PRESET = 't1qa8lvv';

let baseUrl;
let accessToken = null;

const isConnected = true;

export function assignIsProd(isProd) {
  if (isProd) {
    baseUrl = PROD_BASE_URL;
  } else {
    baseUrl = STAGING_BASE_URL;
  }
}

export function assignAccessToken(token) {
  if (!token) {
    return;
  }
  accessToken = token;
}

export function createNonce(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
export function parseResponseParameters(response) {
  if (response.split) {
    const parameters = response.split('&');
    const parameterMap = {};
    for (let i = 0; i < parameters.length; i += 1) {
      parameterMap[parameters[i].split('=')[0]] = parameters[i].split('=')[1];
    }
    return parameterMap;
  }
  return {};
}
export function createSignatureV2(method, baseURL, params, key) {
  let signatureBaseString = method + '&' + encodeURIComponent(baseURL) + '&'; // eslint-disable-line prefer-template
  const parametersKeys = (Object.keys(params)).sort();
  for (let i = 0; i < parametersKeys.length; i += 1) {
    if (i === parametersKeys.length - 1) {
      signatureBaseString += encodeURIComponent(parametersKeys[i] + '=' + params[parametersKeys[i]]); // eslint-disable-line prefer-template
    } else {
      signatureBaseString += encodeURIComponent(parametersKeys[i] + '=' + params[parametersKeys[i]] + '&'); // eslint-disable-line prefer-template
    }
  }
  // console.log('signatureBaseString: \n');
  // console.log(signatureBaseString);
  // console.log('_____________________\n');
  return encodeURIComponent(CryptoJS.HmacSHA1(signatureBaseString, key).toString(CryptoJS.enc.Base64)); // eslint-disable-line new-cap
}

/*
 * Function to form url
 *
 * @param {string} baseURL
 * @param {object} params Parameters of query
 * @return {string} string that will be used for ajax-calls
 * */
export function createQuery(baseURL, params) {
  const parametersKeys = (Object.keys(params)).sort();
  let query = `${baseURL}?`;
  for (let i = 0; i < parametersKeys.length; i += 1) {
    if (i === parametersKeys.length - 1) {
      query += parametersKeys[i] + '=' + params[parametersKeys[i]]; // eslint-disable-line prefer-template
    } else {
      query += parametersKeys[i] + '=' + params[parametersKeys[i]] + '&'; // eslint-disable-line prefer-template
    }
  }
  return query;
}
export function doFetchLocal(endpoint, params = {}, query = {}) {
  if (!isConnected) {
    return Promise.reject('Not connected');
  }

  let headers = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers = _.assign(headers, { 'Authorization': accessToken }); // eslint-disable-line quote-props
  }
  const fetchParams = _.assign({}, params, { headers });

  if (fetchParams.body) {
    fetchParams.body = JSON.stringify(fetchParams.body);
  }

  let url = `http://localhost:3000${endpoint}`;
  if (!_.isEmpty(query)) {
    const qs = queryString.stringify(query);
    url = `${url}?${qs}`;
  }
  // console.log('fetch', url, fetchParams)
  return fetch(url, fetchParams)
      .then((response) => {
        const { status } = response;
        if (status >= 400) {
          return { error: { status } };
        }
        return response.json();
      })
      .catch((err) => err);
}

export function doFetch(endpoint, params = {}, query = {}) {
  if (!isConnected) {
    return Promise.reject('Not connected');
  }

  let headers = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers = _.assign(headers, { 'Authorization': accessToken }); // eslint-disable-line quote-props
  }
  const fetchParams = _.assign({}, params, { headers });

  if (fetchParams.body) {
    fetchParams.body = JSON.stringify(fetchParams.body);
  }

  let url = `${baseUrl}/api/${endpoint}`;
  if (!_.isEmpty(query)) {
    const qs = queryString.stringify(query);
    url = `${url}?${qs}`;
  }
    // console.log('fetch', url, fetchParams)
  return fetch(url, fetchParams)
    .then((response) => {
      const { status } = response;
      if (status >= 400) {
        return { error: { status } };
      }
      return response.json();
    })
    .catch((err) => err);
}

export function createMedia(url) {
  return doFetch('Media', {
    method: 'POST',
    body: {
      originalURL: url,
      largeURL: url,  // for backwards compatibility
      mediumURL: url,
      smallURL: url,
    },
  });
}

export function updatePost(id, data) {
  return doFetch(`Posts/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function createPost(data) {
  const datas = { title: '', ...data };
  return doFetch('Posts/new', {
    method: 'POST',
    body: datas,
  });
}
export function uploadToCloudinary(type, uri, callback) { // eslint-disable-line consistent-return
  if (!uri) return null;
  const upload = request.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type.split('/')[0]}/upload?upload_preset=${UPLOAD_PRESET}`)
      .field('upload_preset', UPLOAD_PRESET)
      .field('file', uri);
  upload.end((err, response) => {
    callback(err, response);
  });
}
export function hashParamTW(param) {
  if(typeof window !== 'undefined'){
    const requestTokenParameters = (window.location.search.replace('?', '')).split('&');
    const parameterMap = {};
    for (let i = 0; i < requestTokenParameters.length; i += 1) {
      parameterMap[requestTokenParameters[i].split('=')[0]] = requestTokenParameters[i].split('=')[1];
    }
    if (parameterMap.platform === 'twitter') {
      // Create a RegExp object for parsing params
      const regex = new RegExp(`${param}=([a-z0-9._-]+)`, 'i');

      // Look for matches in the windows hash
      const matches = window.location.search.match(regex);
      const matches1 = window.location.search.match(new RegExp('oauth_verifier=([a-z0-9._-]+)', 'i'));
      // console.log(matches);
      // console.log(matches1);
      // If matches are found...
      if (matches && matches1) {
        // ...and return the first matching param
        // console.log(parameterMap);
        return parameterMap;
      }
      // Otherwise return false if no matching params are found
    }
    return false;
  }
}

