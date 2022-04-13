import styled from 'styled-components';
import { HEADERCARDOPTION } from '../Constants';
import { CardButton } from '../Components/CardButton';
import { GIZLogo } from '../icons';

const RootEl = styled.div`
  background-color: var(--blue-bg);
  padding: 5rem 3rem 3rem 3rem;
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
  margin: 1rem 0 3rem 0;
  div {
    margin-right: 2rem;
  }
`;

export const Header = () => (
  <>
    <RootEl>
      <div className='container'>
        <h1>SDG Acceleration Simulator</h1>
        <H5>
          The Diagnostic Simulator provides policy insight on recovering better by assessing potential SDG acceleration pathways, gaps and key challenges, and alignment to current national priorities. The Simulator uses advanced machine learning to identify SDG gaps, priorities and potential pathways toward acceleration through an initial analysis of available national data and knowledge resources. Walk through a set of actionable accelerators unique for your country.
        </H5>
        <LogoEl>
          <div>In Partnership with</div>
          <GIZLogo
            size={70}
          />
        </LogoEl>
        <button type='button' className='primary'>Learn More About the Diagnostic Process</button>
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
