/*
 *
 * RegisterPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import selectRegisterPage from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Wrapper from './Wrapper';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.state = {
      checked: false,
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
  render() {
    return (
      <div>
        <Helmet
          title="RegisterPage"
          meta={[
            { name: 'description', content: 'Description of RegisterPage' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Wrapper>
        </Wrapper>
      </div>
    );
  }
}

const mapStateToProps = selectRegisterPage();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
