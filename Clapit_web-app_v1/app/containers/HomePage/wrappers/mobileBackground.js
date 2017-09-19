import styled from 'styled-components';
import {Images} from '../../../themes';

const div = styled.div`
    align-self: center;
    background-image: url(${Images.login_screen});
    background-position: 0 0;
    background-size: 297px 688px;
    -ms-flex-preferred-size: 297px;
    flex-basis: 297px;
    height: 688px;
    margin-left: -35px;
    margin-right: -15px;
    position: relative;
    top: -38px;
    @media (max-width: 874px) {
      display: none;
    }

`;

export default div;
