import { browserHistory } from 'react-router';

export function navigateTo(path, state) {
  browserHistory.push({ pathname: path, state });
}

export function navigateToProfile(profile) {
  const {
    Media,
    CoverMedia,
    id,
    username,
    isMyProfile,
  } = profile;
  const image = Media && Media.mediumURL || ' ';
  const coverImage = (CoverMedia) ? CoverMedia.mediumURL : ' ';
  browserHistory.push({ pathname: `/profile/${id}/${username}`, state: { image, coverImage, accountId: id, username, isMyProfile } });
}

export function navigateToPostDetail(post) {
  const slug = post.title ? post.title.substr(0, 50).replace(/[^a-zA-Z0-9]/g, '-') : 'none';
  browserHistory.push({ pathname: `/post/${post.id}/${slug}`, state: { post, postId: post.id, slug } });
}

export function navigateToSearch(type, tag, otherProps) {
  const sliceTag = type === 'hashtag' ? tag.slice(1) : tag;
  browserHistory.push({ pathname: `/search/${type}/${sliceTag}`, state: { type, tag, ...otherProps } });
}
