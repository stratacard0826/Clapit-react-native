import React from 'react';
import { Images } from '../themes';
import IconButton from 'material-ui/IconButton';

const openShare = (post) => () => {
  const shareOptions = {
    title: post.title,
    message: post.Account.username + ' shared on clapit ' + (post.title ? `"${post.title}"` : ''),
    url: `https://content.clapit.com/posts/${post.id}`,
    subject: `Check out: ${post.title}`,  //  for email
  };
  // Share.open(shareOptions)
};

const styleShareBtn = {
  shareButtonImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
};

export const ShareButton = ({ post, style }) => (<div style={style}>
  <IconButton style={{ padding: 0, width: 42, top: -4 }} onClick={openShare(post)} >
    <img alt="" style={styleShareBtn.shareButtonImage} width="40px" src={Images.ico_share} />
  </IconButton>
</div>);

export const CloudinaryVideoThumbnail =
  (uri) => (uri) ? (uri.substr(0, uri.lastIndexOf('.')) + '.jpg') : ' ';

// replace  https://res.cloudinary.com/dz4nkgvsp/video/upload/c_limit,q_auto,w_750/v1477587759/rvelhmsaocepxo8kex7i.mp4
// into     https://res.cloudinary.com/dz4nkgvsp/video/upload/w_300,vs_30,dl_300/v1477587759/rvelhmsaocepxo8kex7i.gif
const CloudinaryVideoGifThumbnail =
  (uri) => (uri) ? (uri.substr(0, uri.lastIndexOf('.')) + '.gif').replace(/upload\/[^\/]*\//gi,'upload/w_300,du_2,so_2/') : ' ';

export const GetPreviewImageUrl = (item, format) => item.videoURL && !/youtu|instagram.com/.test(item.videoURL)
  ? (format === 'gif' ? CloudinaryVideoGifThumbnail(item.videoURL) : CloudinaryVideoThumbnail(item.videoURL))
  : item.Media && item.Media.mediumURL || ' ';
