import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { GlobalHeader } from './Header';
import { Footer } from './Footer';

import './App.css';
import { GlobalHomePage } from './HomePage/GlobalHomePage';
import { InsightReportLandingPage } from './InsightReportLandingPage';
import { PrivacyPolicy } from './privacyPolicy';
// import { InsightReportLandingPage } from './InsightReportLandingPage';

const App = () => (
  <div className='undp-container'>
    <Routes>
      <Route
        path='/'
        element={(
          <>
            <GlobalHeader />
            <GlobalHomePage />
            <Footer />
          </>
        )}
      />
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
      <Route
        path='/:country/*'
        element={(
          <LandingPage />
        )}
      />
      <Route
        path='/privacy-policy'
        element={(
          <>
            <GlobalHeader />
            <PrivacyPolicy />
            <Footer />
          </>
        )}
      />
    </Routes>
  </div>
);

export default App;
