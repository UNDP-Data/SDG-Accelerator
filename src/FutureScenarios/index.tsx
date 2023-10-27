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
          <div className='undp-breadcrumb-light margin-bottom-10'>
            <a href='../'>
              SDG Push Diagnostics
            </a>
            <div className='divider'>/</div>
            <a href='./'>
              {countryFullName}
            </a>
            <div className='divider'>/</div>
            <span>
              Future Scenario
            </span>
          </div>
          <h1 className='undp-typography'>
            Showing Future Scenario for
            {' '}
            {countryFullName}
          </h1>
          <h5 className='undp-typography'>
            SDG Push identifies national
            {' '}
            <a href='https://sdgintegration.undp.org/covid-impact-low-and-medium-hdi-groups' style={{ color: 'var(--white)' }} target='_blank' className='undp-style' rel='noreferrer'>SDG insights based on integrated accelerators</a>
            {' '}
            across Governance, Social Protection, Green Economy and Digital Disruption.
            <br />
            <br />
            Based on the systems model of
            {' '}
            <a href='https://korbel.du.edu/pardee/international-futures-platform' style={{ color: 'var(--white)' }} target='_blank' className='undp-style' rel='noreferrer'>international futures</a>
            , SDG Push models the impact that incorporating SDG Push accelerators in development can make, providing valuable insights into systems interactions across the SDGs.
          </h5>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div flex-wrap' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>SDG Push Scenario</h2>
          </div>
          <div className='undp-section-content'>
            The Future Scenarios provide projections based on accelerators in governance, social protection, green economy, and digital disruption.
            {' '}
            <a href='https://data.undp.org/wp-content/uploads/2021/04/Leaving-No-One-Behind-COVID-impact-on-the-SDGs-second-flagship-2.pdf' target='_blank' className='undp-style dark-bg' rel='noreferrer'>UNDP&apos;s flagship study</a>
            , conducted with the
            {' '}
            <a href='https://korbel.du.edu/pardee/international-futures-platform' target='_blank' className='undp-style dark-bg' rel='noreferrer'>Pardee Center for International Futures</a>
            {' '}
            at the University of Denver, assesses the
            {' '}
            <a href='https://sdgintegration.undp.org/covid-impact-low-and-medium-hdi-groups' target='_blank' className='undp-style dark-bg' rel='noreferrer'>long-term impact of three COVID-19 scenarios on the SDGs</a>
            .
            <br />
            <br />
            It captures the multifaceted effects of the pandemic over the next decades. The findings reveal that although COVID-19 can have significant long-term consequences, a set of ambitious yet achievable integrated SDG investments can surpass the development trajectory before the pandemic. These SDG Investments, outlined below, aim to address the gaps identified on the &apos;SDG Trends&apos; page. Their projected impact in the upcoming decades is illustrated as the &apos;SDG Push&apos; scenario.
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
