import styled from 'styled-components';

const RootEl = styled.div`
  background-color: var(--blue-bg);
  padding: 5rem 3rem 3rem 3rem;
`;

const H5 = styled.h5`
  margin: 2rem 0rem;
`;

export const Header = () => (
  <RootEl>
    <div className='container'>
      <h1>SDG Acceleration Simulator</h1>
      <H5>
        The Diagnostic Simulator provides policy insight on recovering better by assessing potential SDG acceleration pathways, gaps and key challenges, and alignment to current national priorities. The Simulator uses advanced machine learning to identify SDG gaps, priorities and potential pathways toward acceleration through an initial analysis of available national data and knowledge resources. Walk through a set of actionable accelerators unique for your country.
      </H5>
      <button type='button' className='primary'>Learn More About the Diagnostic Process</button>
    </div>
  </RootEl>
);
