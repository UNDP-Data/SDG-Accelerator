import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { GlobalHeader } from './Header';
import { Footer } from './Footer';
import { DefaultHomePage } from './HomePage/DefaultHomePage';

import './App.css';
// import { InsightReportLandingPage } from './InsightReportLandingPage';

const App = () => (
  <div className='undp-container'>
    <Routes>
      <Route
        path='/'
        element={(
          <>
            <GlobalHeader />
            <DefaultHomePage />
            <Footer />
          </>
        )}
      />
      {
        /*
          <Route
            path='/insight-reports/:country'
            element={(
              <>
                <GlobalHeader />
                <InsightReportLandingPage />
                <Footer />
              </>
            )}
          />
        */
      }
      <Route
        path='/:country/*'
        element={(
          <LandingPage />
        )}
      />
    </Routes>
  </div>
);

export default App;
