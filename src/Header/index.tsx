import styled from 'styled-components';
import { HEADERCARDOPTION } from '../Constants';
import { CardButton } from '../Components/CardButton';
import { GIZLogo } from '../icons';

const RootEl = styled.div`
  background-color: var(--blue-bg);
  margin-top: 11.5rem;
  padding: 5rem 3rem 3rem 3rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url("https://raw.githubusercontent.com/UNDP-Data/SDG-Accelerator/main/public/img/scoping.svg");
  background-position: top 0px right 0px;
  background-repeat: no-repeat;
`;

const H5 = styled.h5`
  margin: 2rem 0rem;
`;

const CardContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 5rem;
`;

const LogoEl = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem; 
  margin: 0;
  div {
    margin-right: 2rem;
  }
`;

const LogoUnit = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rem;
`;

const HeaderEl = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BetaEl = styled.div`
  padding: 1rem;
  background-color: rgba(9, 105, 250, 0.25);
  color: var(--primary-blue);
  margin-left: 1rem;
  border-radius: 0.4rem;
  border: 1px solid var(--primary-blue);
  font-weight: bold;
`;

const H1 = styled.h1`
  margin-bottom: 0;
`;

const TopNavEl = styled.section`
  max-height: 11.5rem;
  background-color: #fafafa;
  box-shadow: 0 3px 6px rgb(0 0 0 / 10%);
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9;
`;

const HeaderContainer = styled.div`
  padding: 0 1.2rem;
  max-width: 100%;
  display: flex;
  align-items: center; 
  justify-content: space-between;
`;

const NavHead = styled.div`
  font-size: 2rem;
  line-height: 3rem;
  margin-left: 2.4rem;
  color: var(--navy);
`;

const RightNav = styled.a`
  font-size: 1.2rem;
  text-transform: uppercase;
  color: #55606e;
  cursor: pointer;
`;

export const Header = () => (
  <>
    <TopNavEl>
      <HeaderContainer>
        <a href='https://data.undp.org/' target='_blank' rel='noreferrer'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src='https://raw.githubusercontent.com/UNDP-Data/SDG-Accelerator/main/public/img/undp-logo-blue.4f32e17f.svg' alt='UNDP Logo' />
            <NavHead>
              <span className='bold'>Data Futures</span>
              <br />
              <span style={{ color: '#999' }}>Platform</span>
            </NavHead>
          </div>
        </a>
        <RightNav href='https://data.undp.org/' target='_blank' rel='noreferrer'>
          Visit Data Futures Platform
        </RightNav>
      </HeaderContainer>
    </TopNavEl>
    <RootEl>
      <div className='container'>
        <HeaderEl>
          <H1>Diagnostic Simulator</H1>
          <BetaEl>BETA</BetaEl>
        </HeaderEl>
        <H5>
          The Diagnostic Simulator is a key element of the
          {' '}
          <a href='https://sdgintegration.undp.org/sdg-acceleration-diagnostic' target='_blank' rel='noreferrer'>SDG Acceleration Diagnostic →</a>
          , a process that combines analytical capabilities with qualitative methods to assess context, options, and bottlenecks to determine effective policy choices, investments and pathways. These gaps, priorities, interlinkages, and opportunities identified by the Simulator, lay the framework for the
          {' '}
          <a href='https://sdgintegration.undp.org/sdg-acceleration-diagnostic/scoping' target='_blank' rel='noreferrer'>scoping work →</a>
          {' '}
          of the Diagnostic.
          <br />
          <br />
          Specifically, the Simulator focuses on
          <ol>
            <li>
              <span className='bold'>Visualizing data</span>
              {' '}
              to easily identify SDG gaps, progress and interlinkages that allows for a holistic dialogue
            </li>
            <li>
              Supporting faster real time learning and identification of priorities
              {' '}
              <span className='bold'>using advanced text-analytics</span>
              ; and
            </li>
            <li>
              Mapping the projected impact of the
              {' '}
              <span className='bold'>SDG Push scenarios</span>
              {' '}
              to provide an example of an ambitious set of actions that can accelerate SDG and national development goals
            </li>
          </ol>
        </H5>
        <LogoUnit>
          <div>
            <a href='https://sdgintegration.undp.org/sdg-acceleration-diagnostic' target='_blank' rel='noreferrer'>
              <button type='button' className='primary'>Learn More About the Diagnostic Process</button>
            </a>
          </div>
          <LogoEl>
            <div>In Partnership with</div>
            <GIZLogo
              size={60}
            />
          </LogoEl>
        </LogoUnit>
        <CardContainer>
          {
              HEADERCARDOPTION.map((d, i) => (
                <CardButton
                  key={i}
                  title={d.title}
                  body={d.body}
                  cardWidth={`${100 / HEADERCARDOPTION.length}%`}
                />
              ))
            }
        </CardContainer>
      </div>
    </RootEl>
  </>
);
