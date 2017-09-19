import { Link } from 'react-router';
import styled from 'styled-components';

export default styled(Link)`
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  color: #41ADDD;
  
  &:hover {
    background: #41ADDD;
    color: #FFF;
  }
`;
