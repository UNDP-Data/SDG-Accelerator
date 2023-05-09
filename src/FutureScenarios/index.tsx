import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { json } from 'd3-request';
import { DATASOURCELINK, SCENARIOINDICATORBASEDONSDG, SDGGOALSFORFUTURESCENARIO } from '../Constants';
import { ScenarioDataType } from '../Types';
import IMAGES from '../img/images';

import { LineChart } from './LineChart';

interface Props {
  countryCode: string
  countryFullName: string;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) rgba(0, 0, 0, 0.3) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const FutureScenariosList = (props: Props) => {
  const { countryFullName, countryCode } = props;
  const [data, setData] = useState<any | ScenarioDataType[]>(undefined);
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  useEffect(() => {
    json(`${DATASOURCELINK}/data/ScenarioData/${countryCode}.json`, (err: any, d: ScenarioDataType[]) => {
      if (err) throw err;
      setData(d);
    });
  }, [countryCode]);
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            Showing Future Scenario for
            {' '}
            {countryFullName}
          </h1>
          <h5 className='undp-typography'>
            In the SDG Push we will be identifying accelerators.
            {' '}
            <a href='https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf' target='_blank' rel='noreferrer' className='undp-style dark-bg red-underline'>UNDP&apos;s flagship publication</a>
            {' '}
            presents one such scenario (governance, social protection, green economy, and digitalisation) at the global level that can put us back on track to recover better.
          </h5>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div flex-wrap' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>SDG Push Scenario</h2>
          </div>
          <div className='undp-section-content'>
            The Future Scenarios outlines projections based on accelerators in the areas of Governance, Social Protection, Green Economy and Digital Disruption.
            <br />
            <br />
            UNDP&apos;s
            {' '}
            <a href='https://data.undp.org/wp-content/uploads/2021/04/Leaving-No-One-Behind-COVID-impact-on-the-SDGs-second-flagship-2.pdf' target='_blank' className='undp-style dark-bg' rel='noreferrer'>flagship study</a>
            , conducted with the Pardee Center for International Futures at the University of Denver, assesses the impact of three different COVID-19 scenarios on the SDGs, capturing the multidimensional effects of the pandemic over the next decades. The findings show that while COVID-19 can lead to severe long-term impacts, a set of ambitious but feasible integrated SDG investments can help the world exceed the development trajectory we were on before the pandemic.
            <br />
            <br />
            These SDG Investments, detailed below, are aimed at narrowing the gaps identified in the ‘Current SDG Gaps’ page. Their projected impact over the coming decades is visualized here as the “SDG Push” scenario.
          </div>
        </div>
      </div>
      <div className='margin-top-13 max-width-1440' style={{ padding: '0 1rem' }}>
        <h3 className='undp-typography bold margin-bottom-07'>Future Scenarios</h3>
        {
          data ? (
            <>
              <div className='flex-div margin-bottom-09 flex-wrap'>
                {
                  SDGGOALSFORFUTURESCENARIO.map((d, i) => (
                    <button
                      type='button'
                      className={`undp-tab-radio ${d === selectedSDG ? 'selected' : ''}`}
                      key={i}
                      onClick={() => { setSelectedSDG(d); }}
                    >
                      {d}
                    </button>
                  ))
                }
              </div>
              {
                SCENARIOINDICATORBASEDONSDG[SCENARIOINDICATORBASEDONSDG.findIndex((d) => d.SDG === selectedSDG)].indicators.map((d, i) => (
                  <div key={i}>
                    <LineChart data={data.filter((series: any) => series.indicator === d)} />
                  </div>
                ))
              }
            </>
          )
            : (
              <div style={{ margin: '10rem auto 3rem auto', minHeight: '30rem' }}>
                <div className='undp-loader' style={{ margin: 'auto' }} />
              </div>
            )
        }
      </div>
    </>
  );
};
