/**
*
* TagAutocompleteInput
*
*/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchHashtags, fetchUsernames } from '../../redux/actions/tags';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';


import MentionCompleter from './MentionCompleter';
import { Images } from '../../themes';
import { MAX_PAGE_WIDTH } from '../../redux/constants/Size';
const width = MAX_PAGE_WIDTH;

class SearchUI extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props, context) {
    super(props);

    this.state = {
      value: props.value || '',
      showAutocomplete: false,
      showTagsLoading: false,
      autocompleteContent: null,
    };
    this.debounceTimeout = null;
    this.showAutocompleteTimeout = null;
  }

  componentDidMount(){

    function createMatchUI(value, type) {
      if (!componentThis.props.fetchHashtags) return;

      if (['hashtag', 'username'].indexOf(type) === -1 || !value) {
        componentThis.setState({
          showAutocomplete : false,
          autocompleteContent: null,
        });
        return;
      }

      if (type === 'hashtag'){
        componentThis.props.fetchHashtags(value.substr(1));
      } else {
        componentThis.props.fetchUsernames(value.substr(1));
      }

      componentThis.setState({
        showAutocomplete: true,
        showTagsLoading: true,
      });
    }

    let componentThis = this;


    this.completer = new MentionCompleter({
      patterns: {
        username: /(@[\w]+)\b/,
        hashtag: /(#[\w]+)\b/,
      },
      getValue: function (cb) {
        setTimeout(() => {
          cb(null, componentThis.state.value);
        }, 50);
      },
      setValue: function (value) {},
      getSelectionRange: function (cb) {
        setTimeout(() => {
          cb(null, {
            start: componentThis.state.value.length,
            end: componentThis.state.value.length,
          });
        }, 50);

      },
      setSelectionRange: function (range) {},
    })
      .on('nomatch', createMatchUI)
      .on('match', function (match) {
        createMatchUI(match.value, match.type);
      })
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.tags
      || (newProps.tags.type === 'hashtag' && (!newProps.tags.hashtags || this.props.tags.hashtags === newProps.tags.hashtags))
      || (newProps.tags.type === 'username' && (!newProps.tags.usernames || this.props.tags.usernames === newProps.tags.usernames))) {
      return;
    }
    let tagsForAutocomplete = newProps.tags.type === 'hashtag' ? newProps.tags.hashtags : newProps.tags.usernames;
    tagsForAutocomplete = tagsForAutocomplete.slice(0, 4).map(tag => { return (tag.length > 40) ? tag.substr(0, 40) + '...' : tag; });
    let content = tagsForAutocomplete.map((tag) => {
      return  <FlatButton style={styles.autocompleteItem} key={tag} onClick={this._onMatchSelected.bind(this, tag)}>
        <span style={styles.autocompleteItemText}>{tag}</span>
      </FlatButton>;
    });

    this.setState({
      showAutocomplete: this.state.value && tagsForAutocomplete.length,
      autocompleteContent: content,
      showTagsLoading: false,
    });
    if (this.state.value && tagsForAutocomplete.length) {
      // this.refs.commentInput.focus();
    }

    // hide autocomplete when long time without action
    clearTimeout(this.showAutocompleteTimeout);
    this.showAutocompleteTimeout = setTimeout(() => {
      this.setState({
        showAutocomplete: false,
      });
    }, 5000);
  }

  setComment = (value) => {
    if (value) {
      this.setState({ value })
      this.refs.commentInput.focus();
    }
  };

  clear() {
    this.setState({ value: '' });
  }

  _onMatchSelected(match) {
    let value= this.state.value;
    let range= this.completer.mostRecentMatch.range
    value = value.substr(0, range.start) + match + value.substr(range.end);
    this.setState({
      value,
      showAutocomplete: false,
      autocompleteContent: null,
    });
    if (this.props.onChange) {
      this.props.onChange({ target: { value } });
    }

    let { onSearch } = this.props;
    if (onSearch) {
      this.props.onSearch(match);
    }
  }

  _onValueChange(e) {
    let { value } = e.target;
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    // debounced async results###
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.completer.checkForMatch.bind(this.completer)();
    }, 500);
  }

  _renderAutocomplete() {
    return (this.state.showAutocomplete) ?
      <div style={this.props.autocompleteBoxStyle || styles.autocompleteView}>
        {this.state.autocompleteContent}
      </div> : null;
  }

  _onSearch() {
    let {onSearch} = this.props;
    this.setState({ showAutocomplete: false });
    onSearch(this.state.value);
  }

  _onSubmitEditing = (e) => {
    const { displaySearch, onSubmit } = this.props;
    if (displaySearch) {
      this._onSearch();
    }
    if (typeof onSubmit === 'function') {
      onSubmit(e);
      this.setState({ value: '' });
    }
  };

  render() {
    return (<div style={this.props.containerStyle || styles.textInputContainer}>
      {this._renderAutocomplete.bind(this)()}
      <TextField
        id="headerSearch"
        underlineFocusStyle={{ borderColor: '#b385ff' }}
        style={{width: width - 270}}
        ref="commentInput"
        onChange={this._onValueChange.bind(this)}
        placeholder={this.props.placeholder || ''}
        onSubmit={this._onSubmitEditing}
        value={this.state.value}
        // style={this.props.style || styles.textInput}
      />
    </div>);
  }
}

const styles = {

  textInputContainer: {
  },

  textInput: {
    //fontSize: 15,
    //color: '#AAA',
  },

  autocompleteView: {
    position: 'absolute',
    top: 55,
    width: '26%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
  },
  goText: {
    fontSize: 18,
    color: '#B385FF',
    padding: 8,
    fontWeight: 'bold',
  },
  autocompleteItem: {
    width: '100%',
    borderBottom: '1px solid rgb(204, 204, 204)',
    height: 40,
  },
  autocompleteItemText: {
    fontSize: 15,
    color: '#B385FF',
    padding: 10,
    overflow: 'hidden',
  },
};

function stateToProps(state) {
  const { tags } = state;

  return { tags };
}

function dispatchToProps(dispatch) {
  const actions = Object.assign({}, { fetchHashtags, fetchUsernames });

  return bindActionCreators(actions, dispatch);
}

export default connect(stateToProps, dispatchToProps, null, { withRef: true })(SearchUI);
