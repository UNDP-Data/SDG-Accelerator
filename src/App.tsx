import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { HomePage } from './HomePage';
import { GlobalHeader } from './Header';
import { Footer } from './Footer';

const App = () => (
  <div className='undp-container'>
    <Routes>
      <Route
        path='/'
        element={(
          <>
            <GlobalHeader />
            <HomePage />
            <Footer />
          </>
        )}
      />
      <Route
        path='/sdg-push-diagnostic'
        element={(
          <>
            <GlobalHeader />
            <HomePage />
            <Footer />
          </>
        )}
      />
      <Route
        path='/sdg-push-diagnostic/:country/*'
        element={(
          <LandingPage />
        )}
      />
    </Routes>
  </div>
);

export default App;
