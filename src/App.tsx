import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { HomePage } from './HomePage';
import { Header } from './Header';
import { Footer } from './Footer';
import './style/style.css';
import './style/antd.css';
import './style/buttonStyle.css';

const App = () => (
  <div className='undp-container'>
    <Routes>
      <Route
        path='/sdg-push-diagnostic'
        element={(
          <>
            <Header />
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
