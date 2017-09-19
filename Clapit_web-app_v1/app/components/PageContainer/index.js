import styled from 'styled-components';
import { MAX_PAGE_WIDTH, HEADER_HEIGHT } from '../../redux/constants/Size';
const div = styled.div`
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal; 
  margin: ${HEADER_HEIGHT}px auto 0;
  max-width: ${MAX_PAGE_WIDTH}px;
  width: 100%;
  flex-direction: row;
`;

export default div;
