import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { GlobalHeader } from './Header';
import { Footer } from './Footer';
import { DefaultHomePage } from './HomePage/DefaultHomePage';

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
      <Route
        path='/sdg-push-diagnostic'
        element={(
          <>
            <GlobalHeader />
            <DefaultHomePage />
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
