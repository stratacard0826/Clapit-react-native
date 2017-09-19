/**
*
* FeedItem
*
*/

import React from 'react';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';
import PostProfile from '../PostProfile';
import PostClapsIconCounter from '../PostClapsIconCounter';
import PostCommentsIconCounter from '../PostCommentsIconCounter';
import PostComments from '../PostComments';
import { Colors, Images, Styles } from '../../themes';
import { ShareButton, GetPreviewImageUrl } from '../../utils/utils';
// import ParsedText from '../ParsedText';
import Parsed from '../Parsed';
import { navigateToSearch } from '../../utils/navigator';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';
const width = MAX_PAGE_WIDTH;
class FeedItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  _onImagePress = (item) => () => {
    this.props.onMainImagePressed(item);
  };

  _onAvatarPress() {
    this.props.onProfilePressed();
  }

  _renderUserTag(match, matches) {
    // matches[1] contains tag without @ at the beginning
    const username = matches[1];
    const isExistingUser = this.props.item.UserTags
      && this.props.item.UserTags.find((userTag) => userTag.Account.username === username);

    let props = isExistingUser ? {
      style: styles.tag,
      onClick: this._onTagPress.bind(this, username, 'user'),
    } : {};
    return (<span {...props}>@{username}</span>);
  }

  _renderHashTag(match, matches) {
    // matches[1] contains tag without hash at the beginning
    let hash = matches[1];
    hash = `#${hash}`;
    return (<span style={styles.tag} onClick={this._onTagPress.bind(this, hash, 'hashtag')}>{hash}</span>);
  }

  _onTagPress(tag, type) {
    const { searchFriends } = this.props;
    searchFriends(tag, 0);
    navigateToSearch(type, tag);
  }


  _renderUserProfile = () => {
    const { recentPosts, item, rank, navigator} = this.props;
    const itemHeight = 0.75 * width;
    const hasExtraPosts = recentPosts.length === 2;

    const styles = {
      profileImage: {
        position: 'absolute',
        right: 20,
        width: 0.20 * width,
        height: 0.20 * width,
        borderRadius: 0.10 * width,
      },
      profile: {
        position: 'absolute',
        width: width - 50,
        top: itemHeight - (0.20 * width * (hasExtraPosts ? 0.8 : 1.2)),
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 50,
        paddingRight: 20,
      },
      profileLabel: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 5,
        color: 'white',
        fontSize: 18,
        width: 200,
        overflow: 'hidden',
      },
      moreTextOverlap: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textShadow: 'black 2px 2px',
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'transparent',
      },
    };

    const otherPosts = recentPosts.map((p, index) => {
      const smallWidth = width / 2;
      const smallHeight = smallWidth * 0.75;
      const style = index === 0 ? { borderRightWidth: 1, borderColor: 'white' } : {};
      return this._renderItem({ item: p, width: smallWidth, height: smallHeight, useGif: true, style, isSmall:true });
    });

    const content = this._renderItem({
      item, width, height: itemHeight,
      style: { borderBottomWidth: 1, borderBottomColor: 'white' },
    });
    return (
      <div style={{...styles.container, borderBottomWidth: 2, borderColor: Colors.grey }}>
        <div style={{ borderBottomWidth: 1, borderColor: Colors.grey, paddingTop: 5, paddingBottom: 5, position: 'relative' }} >
          <PostProfile
            post={item}
            profile={item.Account}
            publishTime={item.publishTime}
          />
          <div style={{float: 'right', position: 'relative'}}>
            <img alt="" style={{ height: 40, width: 40, marginRight: 8, marginTop: 8}} src={Images.gold_hand} />
            <span style={{ fontSize: 12, position: 'absolute', top: 25, right: 17, backgroundColor: 'transparent' }}>{rank}</span>
          </div>
        </div>
        {content}
        {hasExtraPosts && <div style={{ position: 'relative'}}>
          {otherPosts}
          <span style={styles.moreTextOverlap}>More from {item.Account.username}...</span>
        </div>}

      </div>
    );
  };

  _renderItem = ({ item, width, height, visibleParent, useGif, style, isSmall }) => {
    const youtubeIcon = <img alt="" src={Images.ico_youtube} style={Styles.videoIcon} />;
    let content =
      (<div style={{width, height, overflow: 'hidden'}}> <img alt="" src={item.Media && item.Media.mediumURL || ' '} style={{ width }} />
        {item.videoURL && item.videoURL.includes('youtu') && youtubeIcon}
      </div>);

    // console.log('props', this.props);
    if (item.videoURL) {
      if (item.videoURL.includes('youtu')) {
        // todo youtube player
      } else if (useGif) {
        content =
          (<div style={{width, height, overflow: 'hidden'}}><img alt="" src={GetPreviewImageUrl(item, 'gif')} style={{ width }} />
            {item.videoURL && item.videoURL.includes('youtu') && youtubeIcon}
          </div>);
      } else {
        content =
          (<div style={{ width, height, overflow: 'hidden' }}>
            <img alt="" src={GetPreviewImageUrl(item)} style={{ width }} />
          </div>);
      }
    }
    // if we want to add border for the content
    // <View style={[{borderColor:Colors.grey, borderBottomWidth:1, borderTopWidth: 1}, style]}>
    const float = (isSmall) ? 'left' : 'none';
    return (
      <div key={`button_${item.id}`} style={{ padding: 0, float }} onClick={this._onImagePress(item)}>
        <div style={style}>
          {content}
        </div>
      </div>
    );
  };

  _renderPost = () => {
    const { width, navigator, item, visibleParent } = this.props;
    const content = this._renderItem({ item, width, height: 0.75 * width, visibleParent });
    return (
      <div style={(this.props.item.featured) ? styles.featuredContainer : styles.container}>
        <PostProfile
          post={this.props.item}
          profile={this.props.item.Account}
          publishTime={this.props.item.publishTime}
          navigator={navigator}
        />
        <div style={{ marginTop: 5, height: 1 }}>
        </div>
        {content}

        <div style={styles.footerContainer}>
          {!this.props.item.featured &&
          <div style={{ flex: 1, flexDirection: 'row' }}>
            <PostClapsIconCounter
              post={this.props.item}
              navigator={navigator}
              onClap={this._onClap}
              storeClapFunc={this._storeClapFunc}
            />

            <PostCommentsIconCounter
              post={this.props.item}
              navigator={navigator}
            />
            <ShareButton post={item} style={styles.shareButton} />
          </div>
          }

          <div style={{ height: 40 }}></div>

        </div>
        <Parsed
          style={styles.postText}
          parse={[
            { pattern: /#(\w+)/, renderText: this._renderHashTag.bind(this) },
            { pattern: /@(\w+)/, renderText: this._renderUserTag.bind(this) },
          ]}
        >
          {this.props.item.title}
        </Parsed>

        <PostComments
          post={this.props.item}
          navigator={navigator}
        />
        <div style={styles.feedItemSeparator} />
      </div>
    );
  };

  render() {
    const { recentPosts } = this.props;
    return recentPosts ? this._renderUserProfile() : this._renderPost();
  }
}

FeedItem.propTypes = {
  item: React.PropTypes.object,
};

const styles = {
  container: {
    backgroundColor: 'white',
    overflow: 'hidden',
    padding: 0,
    // marginBottom: 10

  },
  featuredContainer: {
    backgroundColor: '#F0E5FF',
    overflow: 'hidden',
    padding: 0,
    // marginBottom: 10
  },
  footerContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 3,
    // backgroundColor: 'red'
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#AAA',
  },
  avatarInfo: {
    flex: 0.5,
    flexDirection: 'column',
    paddingLeft: 5,
    paddingRight: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 30,
  },
  username: {
    fontWeight: '500',
    fontSize: 10,
  },
  daysAgo: {
    color: '#AAA',
    fontSize: 9,
  },
  postText: {
    fontSize: 14,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 2,
    paddingBottom: 5,
  },
  feedItemInfo: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 10,
    color: '#AAA',
    textAlign: 'right',
  },
  clapInfo: {
    flex: 0.5,
    alignItems: 'center',
  },
  feedItemSeparator: {
    marginTop: 5,
    height: 1,
    backgroundColor: Colors.grey,
  },
  tag: {
    color: '#B385FF',
  },
  shareButton: {
    float: 'right',
  },
};

export default FeedItem;
