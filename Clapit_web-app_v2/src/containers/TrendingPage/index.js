/*
 *
 * TrendingPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PageContainer from '../../components/PageContainer';
import Feed from '../Feed';
import { HEADER_HEIGHT } from '../../redux/constants/Size';


//trendingpage
export class TrendingPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="TrendingPage"
          meta={[
            { name: 'description', content: 'Description of TrendingPage' },
          ]}
        />
        <PageContainer>
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            marginTop: `${HEADER_HEIGHT}px`,
          }}>
            <Feed {...this.props} />
          </div>
        </PageContainer>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  console.log('PROPS FEED ' , props.location);
  if (props.location && props.location.state) {
    props = {...props, ...props.location.state };
  }
  return {
    ...props
  };
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(TrendingPage);
