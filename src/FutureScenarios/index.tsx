import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PageTitle } from '../Components/PageTitle';
import { FUTURESCENARIOINDICATORS } from '../Constants';
import { getSDGIcon } from '../utils/getSDGIcon';

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 0 auto;
`;

const CardEl = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  margin-bottom: 2rem;
  font-size: 1.6rem;
`;

const ButtonDiv = styled.div`
  margin: 2rem 0 0 -0.5rem;
`;

const TitleEl = styled.div`
  font-size: 2.4rem;
  margin: 3rem 0 1rem 0;
`;

const LinkEl = styled.div`
  padding: 0 1rem 0 0;
  height: 6.4rem;
  margin: 2rem 0;
  background-color: var(--black-200);
  color: var(--black-700);
  &:hover {
    color: var(--primary-blue);
  }
  display: flex;
  align-items: center;
  font-size: 1.6rem;
`;

const LinkText = styled.div`
  margin-left: 2rem;
`;

export const FutureScenariosList = () => (
  <div>
    <PageTitle
      title='Future Scenarios'
      description='Using futures modelling, assess potential pathways for COVID-19 recovery through the SDG-Push scenario and projected progress towards SDG priority areas through targeted policy interventions.'
    />
    <RootEl>
      <CardEl>
        <div className='bold'>Assessing impact on SDGs with or without SDG Push</div>
        <br />
        <>The Future Scenarios outlines projections based on SDG Priorities analyzed in the areas of Governance, Social Protection, Green Economy and Digital Disruption. UNDP’s flagship study, conducted with the Pardee Center for International Futures at the University of Denver, assesses the impact of three different COVID-19 scenarios on the SDGs, capturing the multidimensional effects of the pandemic over the next decades. The findings show that while COVID-19 can lead to severe long-term impacts, a set of ambitious but feasible integrated SDG investments can help the world exceed the development trajectory we were on before the pandemic. These SDG Investments, detailed in the ‘SDG Priorities’ page, are aimed at narrowing the gaps identified in the ‘Current SDG Gaps’ page. Their projected impact over the coming decades is visualized here as the “SDG Push” scenario.  </>
        <ButtonDiv>
          <button type='button' className='secondary'>Read More</button>
        </ButtonDiv>
      </CardEl>
      <>
        <TitleEl>
          All Available Indicators
        </TitleEl>
        {
          FUTURESCENARIOINDICATORS.map((d, i) => (
            <Link to={`/future-scenarios/${d.ID}`} key={i}>
              <LinkEl>
                {getSDGIcon(d.Goal, 64)}
                <LinkText>{d.Indicator}</LinkText>
              </LinkEl>
            </Link>
          ))
        }
      </>
    </RootEl>
  </div>
);

export const FutureScenariosViz = () => (
  <div>
    <PageTitle
      title='Future Scenarios'
      description='Using futures modelling, assess potential pathways for COVID-19 recovery through the SDG-Push scenario and projected progress towards SDG priority areas through targeted policy interventions.'
    />
  </div>
);
