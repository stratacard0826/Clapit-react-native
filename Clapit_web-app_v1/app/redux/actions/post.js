/* eslint no-unused-vars:0 */
import {
    FETCH_GALLERY_MEDIAS,
    FETCH_GALLERY_MEDIAS_SUCCESS,
    FETCH_GALLERY_MEDIAS_ERROR,
} from '../constants/ActionTypes';

// import {
//    CameraRoll,
// } from 'react-native';

export function fetchMedias(count, after, reload = false) { // eslint-disable-line no-unused-vars
  return (dispatch, getState) => {
    const { post: { fetchingMedias } } = getState();

    if (fetchingMedias) { return false; }  // already doing it
    return true;
    // dispatch(startFetchingMedias(reload));
    // return CameraRoll.getPhotos({
    //  first: count,
    //  assetType: 'All',
    //  groupTypes: 'SavedPhotos',
    //  after,
    // }).then((data) => {
    //  dispatch(fetchMediasSuccess(data));
    // }).catch((err) => {
    //  dispatch(fetchMediasError(err));
    // });
  };
}

function startFetchingMedias(reloading = false) {
  return {
    type: FETCH_GALLERY_MEDIAS,
    payload: {
      reloading,
    },
  };
}

function fetchMediasSuccess(data) {
  return {
    type: FETCH_GALLERY_MEDIAS_SUCCESS,
    payload: {
      medias: data,
    },
  };
}

function fetchMediasError(error) {
  return {
    type: FETCH_GALLERY_MEDIAS_ERROR,
    payload: {
      error,
    },
  };
}
