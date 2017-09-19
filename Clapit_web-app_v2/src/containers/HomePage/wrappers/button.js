import styled from 'styled-components';

const Button = styled.div`
  font-size: 16px;
  line-height: 29px;
  padding: 0 11px;
  cursor: pointer;
  background: #b385ff;
  border-color: #8b809c;
  color: #fff;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  font-weight: 600;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  -webkit-appearance: none;
    &:active {
      opacity: .5
    }
`;

export default Button;
