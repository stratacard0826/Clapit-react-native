import styled from 'styled-components';

const Button = styled.button`
  font-size: 16px;
  padding: 0 11px;
  cursor: pointer;
  color: #385185;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  -webkit-appearance: none;
    &:active {
      opacity: .5
    }
`;

export default Button;
