/*
 *
 * LoginPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import selectLoginPage from './selectors';
import { FormattedMessage } from 'react-intl';
import Wrapper from './Wrapper';
// import WrapperButton from './WrapperButton';
// import Link from './Link';
import messages from './messages';


export class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleCheckAgree = this.handleCheckAgree.bind(this);
    this.state = {
      agree: true,
      email: '',
      password: '',
    };
  }
  handleChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };
  handleChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };
  handleCheckAgree = (event, isInputChecked) => {
    this.setState({
      agree: isInputChecked,
    });
  };
  render() {
    return (
      <div>
        <Helmet
          title="LoginPage"
          meta={[
            { name: 'description', content: 'Description of LoginPage' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Wrapper>
        </Wrapper>
      </div>
    );
  }
}

const mapStateToProps = selectLoginPage();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
