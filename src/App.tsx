import { createGlobalStyle } from 'styled-components';
import { Routes, Route, useParams } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Header } from './Header';
import { CurrentGaps } from './CurrentGaps';
import { Priorities } from './Priorities';
import { FutureScenariosList } from './FutureScenarios';
import { HomePage } from './HomePage';

const GlobalStyle = createGlobalStyle`
  :root {
    --blue-bg: #E7F1FF;
    --white: #FFFFFF;
    --black-900: #000000;
    --primary-blue: #0969FA;
    --blue-medium: #018EFF;
    --navy: #082753;
    --black-100: #FAFAFA;
    --black-200: #F7F7F7;
    --black-250: #F1F1F1;
    --black-300: #EDEFF0;
    --black-400: #E9ECF6;
    --black-500: #A9B1B7;
    --black-550: #666666;
    --black-700: #212121;
    --accent-red: #D12800;
    --accent-orange: #fb7712;
    --accent-yellow: #FBC412;
    --accent-green: #59BA47;
    --accent-red-light: rgba(255, 188, 183, 0.2);
    --accent-yellow-light: rgba(255, 225, 126, 0.2);
    --accent-green-light:rgba(184, 236, 182, 0.2);
    --blue-very-light: #F2F7FF;
    --shadow:0px 10px 30px -10px rgb(9 105 250 / 15%);
    --shadow-bottom: 0 10px 13px -3px rgb(9 105 250 / 5%);
    --shadow-top: 0 -10px 13px -3px rgb(9 105 250 / 15%);
    --shadow-right: 10px 0px 13px -3px rgb(9 105 250 / 5%);
    --shadow-left: -10px 0px 13px -3px rgb(9 105 250 / 15%);
  }
  
  html { 
    font-size: 62.5%; 
  }

  body {
    font-family: "proxima-nova", "Helvetica Neue", "sans-serif";
    color: var(--black-700);
    background-color: var(--white);
    padding: 0;
    font-size: 1.6rem;
    line-height: 2.4rem;
    margin: 0 auto;
  }

  h1 {
    font-size: 6rem;
    font-weight: 700;
    line-height: 6.5rem;
    text-align: left;
  }

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 2.9rem;
    margin: 0;
  }

  h3 {
    font-size: 2rem;
    line-height: 2.4rem;
    font-weight: 500;
  }

  h5 {
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 2.8rem;
  }

  h4 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 2.8rem;
  }

  a {
    text-decoration: none;
    color: var(--primary-blue);
  }

  button.primary {
    padding: 2rem;
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.8rem;
    background-color: var(--primary-blue);
    color: var(--white);
    border: 0;
    text-transform: uppercase;
    cursor: pointer;
    &:hover {
      background: #4F95DD;
    }
    &:active{
      background: #4F95DD;
    }
  }

  button.secondary {
    font-size: 1.6rem;
    line-height: 1.8rem;
    font-weight: 700;
    color: var(--black);
    border: 0;
    text-transform: uppercase;
    background-color: transparent;
    cursor: pointer;
  }

  div.container {
    max-width: 128rem;
    margin: auto;
  }

  .bold {
    font-weight: 700;
  }
  
  .italics {
    font-style: italic;
  }

  .ant-select-selector {
    border: 0 !important;
    padding-left: 0 !important;
    background-color: var(--black-200) !important;
  }
  .ant-select-selection-item {
    font-size: 2.4rem;
    font-weight: 500 !important;
    a {
      color: var(--black-700) !important;
    }
  }
  .ant-select-dropdown{
    min-width: 20rem !important;
  }
  .ant-select-item-option-content {
    a {
      font-size: 1.6rem !important;
      line-height: 3rem !important;
      color: var(--black-700) !important;
    }
  }

  .navCountry{
    font-size: 2.4rem;
    color: var(--primary-blue) !important;
    font-weight: bold;
  }

  .modalSelect{
    font-size: 2.4rem;
  }

  .homeDropDown{
    widht: 100%;
    .ant-select-selector {
      width: 47.2rem !important;
      height: auto !important;
      border: 0 !important;
      padding: 1rem !important;
      font-size: 2rem !important;
      background-color: var(--black-200) !important;
    }
    .ant-select-selection-placeholder{
      color: var(--black-700);
    }
    .ant-select-selection-item {
      font-size: 2.4rem;
      font-weight: 500 !important;
      a {
        color: var(--black-700) !important;
      }
    }
    .ant-select-dropdown{
      min-width: 20rem !important;
    }
    .ant-select-item-option-content {
      a {
        font-size: 1.6rem !important;
        line-height: 3rem !important;
        color: var(--black-700) !important;
      }
    }
  }
  .countryModal{
    .ant-modal-footer{
      display: none !important;
    }
  }
  .SDGSelector{
    .ant-select-selector{
      background-color:transparent !important;
    }
    .ant-select-selection-item{
      padding-right: 3rem !important;
      font-weight: bold !important;
    }
  }
  .countrySelect{
    .ant-btn{
      background-color: transparent;
      border: 0 !important;
      padding: 0 !important;
    }
    .anticon-down{
      svg {
        width: 1.5rem !important;
        height: 1.5rem !important;
      }
    }
  }
  .targetSelector{
    .ant-select-selector{
      background-color: transparent !important;
    }
    .ant-select-selection-item{
      max-width: 40rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 2rem;
      font-weight: 700 !important;
      padding-right: 3rem !important;
      color: var(--primary-blue);
    }
  }
`;

const App = () => (
  <div>
    <GlobalStyle />
    <Header />
    <Routes>
      <Route
        path='/'
        element={<HomePage />}
      />
      <Route
        path='/:country/current-sdg-gaps'
        element={<CurrentGaps />}
      />
      <Route
        path='/:country/acceleration-Opportunities'
        element={<Priorities country={useParams().country} />}
      />
      <Route
        path='/:country/future-scenarios'
        element={<FutureScenariosList />}
      />
    </Routes>
  </div>
);

export default App;
