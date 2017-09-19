import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  .facebookButtonClass {
    font-size: 16px;
    line-height: 29px;
    padding: 0 0 0 20px;
    cursor: pointer;
    background: #3b5998;
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
    text-align: left;
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-appearance: none;
  }
`;
