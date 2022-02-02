import { createGlobalStyle } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { CurrentGaps } from './CurrentGaps';
import { Priorities } from './Priorities';
import { Interlinkages } from './Interlinkages';
import { FutureScenariosList, FutureScenariosViz } from './FutureScenarios';

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
    --black-300: #EDEFF0;
    --black-400: #E9ECF6;
    --black-500: #A9B1B7;
    --black-550: #666666;
    --black-700: #212121;
    --accent-red: #D12800;
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
    margin: 0;
    padding: 0;
    font-size: 1.6rem;
    line-height: 2.4rem;
    margin: auto;
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
    font-size: 2.5rem;
    line-height: 2.9rem;
    font-weight: normal;
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

  .selectDropDown {
    border: 0 !important;
    font-weight: bold;
    background-color: transparent !important;
    text-decoration: underline;
    color: var(--black-700) !important;
    margin-left: 0;
    padding-left: 0 !important;
    padding-right: 1.2rem !important;
    .react-dropdown-select-type-multi{
      padding: 0 !important;
    }

    .react-dropdown-select-content {
      height: auto !important;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 50rem;
      }
    }

    .react-dropdown-select-option{
      background-color: var(--black-700) !important;
      color: var(--white) !important;
    }

    .react-dropdown-select-dropdown-handle {
      display: none !important;
      width: 0 !important;
      margin: 0 !important;
      margin-top: 0.6rem !important;
    }
    .react-dropdown-select-dropdown {
      min-width: 20rem;
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 2rem;
    }
  }

  .countrySelectDropDown {
    border: 1 solid var(--black-400) !important;
    border-radius: 2rem !important;
    font-weight: bold;
    background-color: var(--white);
    color: var(--black-700) !important;
    margin-left: 0;
    padding: 0 2rem !important;
    .react-dropdown-select-type-multi{
      padding: 0 !important;
    }

    .react-dropdown-select-content {
      height: auto !important;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 50rem;
      }
    }

    .react-dropdown-select-option{
      background-color: var(--black-700) !important;
      color: var(--white) !important;
    }

    .react-dropdown-select-dropdown {
      min-width: 20rem;
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 2rem;
    }
  }

  .horizontal-slider {
    width: 100%;
    margin: auto;
    margin-top: -0.9rem;
  }

  .year-slider-track {
    position: relative;
    background: var(--black-400);
  }

  .year-slider-track.year-slider-track-0 {
    background: var(--blue-medium);
  }

  .horizontal-slider .year-slider-track {
    top: 2.2rem;
    height: 0.5rem;
    border-radius: 1rem;
  }
`;

const App = () => (
  <div>
    <GlobalStyle />
    <Header />
    <Routes>
      <Route
        path='/'
        element={<CurrentGaps />}
      />
      <Route
        path='/sdg-priorities'
        element={<Priorities />}
      />
      <Route
        path='/target-interlinkages'
        element={<Interlinkages />}
      />
      <Route
        path='/future-scenarios'
        element={<FutureScenariosList />}
      />
      <Route
        path='/future-scenarios/:indicator'
        element={<FutureScenariosViz />}
      />
    </Routes>
  </div>
);

export default App;
