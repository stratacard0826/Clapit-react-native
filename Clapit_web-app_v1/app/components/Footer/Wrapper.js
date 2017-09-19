import styled from 'styled-components';
import { MAX_PAGE_WIDTH, } from '../../redux/constants/Size';
const Wrapper = styled.footer`
  padding: 30px 20px;
  width: ${MAX_PAGE_WIDTH}px;
  min-height: 50px;
  margin: auto;
  @media (min-width: 874px) {
      width: 874px;
    }
`;

export default Wrapper;
