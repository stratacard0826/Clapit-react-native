import React from 'react';
// import { FormattedMessage } from 'react-intl';

// import A from 'components/A';
import Wrapper from './Wrapper';
import {Colors} from '../../themes';
import A from '../A'

function Footer() {
  return (
    <Wrapper>
      <section>
        <div style={styles.footerLink}><A href="http://clapit.com/open-calls-2" target="_blank">Open Calls</A></div>
        <div style={styles.footerLink}><A href="http://clapit.com/contact" target="_blank">Contact</A></div>
        <div style={styles.footerLink}><A href="http://clapit.com/about-us" target="_blank">About us</A></div>
        <div style={styles.footerLink}><A href="http://clapit.com/terms-and-conditions" target="_blank">Terms</A></div>
        <div style={styles.footerLink}><A href="http://clapit.com/privacy" target="_blank">Privacy</A></div>
        <div style={styles.copyright}>© Clapit, {new Date().getFullYear()}</div>
      </section>
    </Wrapper>
  );
}

const styles = {
  footerLink:{
    float:'left',
    fontSize: '12px',
    marginRight: '20px'
  },
  copyright:{
    float:'right',
    fontSize: '12px',
  }
};

export default Footer;
