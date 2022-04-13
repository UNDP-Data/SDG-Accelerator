import styled from 'styled-components';
import { Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { json } from 'd3-request';
import { useParams } from 'react-router-dom';
import { PageTitle } from '../Components/PageTitle';
import { SDGGOALSFORFUTURESCENARIO } from '../Constants';
import { ScenarioLineChartsEl } from './ScenarioLineChartsEl';
import { Nav } from '../Header/Nav';
import { ScenarioDataType } from '../Types';

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

export const FutureScenariosList = () => {
  const [data, setData] = useState<any | ScenarioDataType[]>(undefined);
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  const countrySelected = useParams().country;
  useEffect(() => {
    json('../../data/ScenarioData/ScenarioData.json', (err: any, d: ScenarioDataType[]) => {
      if (err) throw err;
      setData(d.filter((el: any) => el.country === countrySelected));
    });
  }, [countrySelected]);
  return (
    <>
      <Nav
        pageURL='/future-scenarios'
      />
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
          <Tabs type='card' size='small' onChange={(key) => { setSelectedSDG(key); }}>
            {
              SDGGOALSFORFUTURESCENARIO.map((d) => (
                <Tabs.TabPane tab={d} key={d}>
                  {
                    data || data?.length === 0
                      ? (
                        <ScenarioLineChartsEl
                          data={data}
                          selectedSDG={selectedSDG}
                        />
                      )
                      : <Spin size='large' />
                  }
                </Tabs.TabPane>
              ))
            }
          </Tabs>
        </RootEl>
      </div>
    </>
  );
};
