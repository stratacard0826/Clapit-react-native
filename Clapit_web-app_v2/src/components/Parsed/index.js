/**
*
* Parsed
*
*/

import React from 'react';
import TextExtraction from '../../utils/TextExtraction';

const PATTERNS = {
  url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/,
  email: /\S+@\S+\.\S+/,
};

const defaultParseShape = React.PropTypes.shape({
  ...React.propTypes,
  type: React.PropTypes.oneOf(Object.keys(PATTERNS)).isRequired,
});

const customParseShape = React.PropTypes.shape({
  ...React.propTypes,
  pattern: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(RegExp)]).isRequired,
});

class Parsed extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static displayName = 'Parsed';

  static propTypes = {
    ...React.propTypes,
      parse: React.PropTypes.arrayOf(
  React.PropTypes.oneOfType([defaultParseShape, customParseShape]),
  ),
  };

  static defaultProps = {
    parse: null,
  };

  setProps(props) {
    this._root.setProps(props);
  }

  getPatterns() {
    return this.props.parse.map((option) => {
      const {type, ...patternOption} = option;
      if (type) {
        if (!PATTERNS[type]) {
          throw new Error(`${option.type} is not a supported type`);
        }
        patternOption.pattern = PATTERNS[type];
      }

      return patternOption;
    });
  }

  getParsedText() {
    if (!this.props.parse)                       { return this.props.children; }
    if (typeof this.props.children !== 'string') { return this.props.children; }

    const textExtraction = new TextExtraction(this.props.children, this.getPatterns());

    return textExtraction.parse().map((props, index) => {
      return (
        <span
          key={`parsedText-${index}`}
          {...props}
        />
      );
    });
  }

  render() {
  const { parse, ...other } = this.props;
    return (
        <div
            ref={ref => this._root = ref}
            {...other}>
          {this.getParsedText()}
        </div>
    );
  }

}

export default Parsed;
