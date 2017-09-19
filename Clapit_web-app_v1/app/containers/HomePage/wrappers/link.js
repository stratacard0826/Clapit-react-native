import { Link } from 'react-router';
import styled from 'styled-components';

export default styled(Link)`
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-weight: bold;
  color: #41ADDD;
  
  &:visited {
    color: #999;
    font-weight: 600;
    text-decoration: none;
  }
`;
