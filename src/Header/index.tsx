import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { HEADERCARDOPTION } from '../Constants';
import { CardButton } from '../Components/CardButton';
import { GIZLogo } from '../icons';

const RootEl = styled.div`
  background-color: var(--blue-bg);
  padding: 5rem 3rem 3rem 3rem;
`;

const NavBarEl = styled.div`
  background-color: var(--black-100);
  border-bottom: 1px solid var(--black-500);
`;

const ContainerEl = styled.div`
  display: flex;
  max-width: 128rem;
  margin: auto;
`;

interface NavElProps {
  selected?: boolean;
}

const NavEl = styled.div<NavElProps>`
  font-size: 1.8rem;
  font-weight: normal;
  padding: 1.5rem 0 1rem 0;
  margin: 0 1.5rem;
  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
  cursor: pointer;
  &:hover {
    color: var(--primary-blue)
  }
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
            HEADERCARDOPTION.map((d) => (
              <CardButton
                title={d.title}
                body={d.body}
                link={d.link}
                cardWidth={`${100 / HEADERCARDOPTION.length}%`}
              />
            ))
          }
        </CardContainer>
      </div>
    </RootEl>
    <NavBarEl>
      <ContainerEl>
        <NavEl>
          <NavLink
            to='/'
            style={({ isActive }) => ({
              paddingBottom: isActive ? '8px' : '',
              borderBottom: isActive ? '#006EB5 solid 3px' : '',
              color: !isActive ? 'var(--primaty-blue)' : '',
            })}
          >
            Current SDG Gaps
          </NavLink>
        </NavEl>
        <NavEl>
          <NavLink
            to='/sdg-priorities'
            style={({ isActive }) => ({
              paddingBottom: isActive ? '8px' : '',
              borderBottom: isActive ? '#006EB5 solid 3px' : '',
              color: !isActive ? 'var(--primaty-blue)' : '',
            })}
          >
            SDG Priorities
          </NavLink>
        </NavEl>
        <NavEl>
          <NavLink
            to='/target-interlinkages'
            style={({ isActive }) => ({
              paddingBottom: isActive ? '8px' : '',
              borderBottom: isActive ? '#006EB5 solid 3px' : '',
              color: !isActive ? 'var(--primaty-blue)' : '',
            })}
          >
            Target Interlinkages
          </NavLink>
        </NavEl>
        <NavEl>
          <NavLink
            to='/future-scenarios'
            style={({ isActive }) => ({
              paddingBottom: isActive ? '8px' : '',
              borderBottom: isActive ? '#006EB5 solid 3px' : '',
              color: !isActive ? 'var(--primaty-blue)' : '',
            })}
          >
            Future Scenarios
          </NavLink>
        </NavEl>
      </ContainerEl>
    </NavBarEl>
  </>
);
