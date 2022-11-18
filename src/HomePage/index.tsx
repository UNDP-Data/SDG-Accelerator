import styled from 'styled-components';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Select } from 'antd';
import sortBy from 'lodash.sortby';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import '../style/heroSections.css';
import SDGTrends from '../img/01.png';
import PrioritiesImg from '../img/02.png';
import FutureImg from '../img/03.png';
import InterlinkagesImg from '../img/04.png';
import Background from '../img/UNDP-hero-image.png';
import GIZLogo from '../img/gizLogo.png';

interface Props {
  countryCode?: string;
  countryFullName?: string;
}

const HeroImageEl = styled.div`
  background: url(${Background}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const HomePage = (props: Props) => {
  const {
    countryCode,
    countryFullName,
  } = props;
  const [selectedCountry, setSelectedCountry] = useState('Afghanistan');
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            {
              countryFullName ? `SDG Push Diagnostic for ${countryFullName}` : 'SDG Push Diagnostic'
            }
          </h1>
          <h5 className='undp-typography'>
            The SDG Push Diagnostic is a key element of the
            {' '}
            <a href='https://sdgintegration.undp.org/sdg-acceleration-diagnostic' className='undp-style' target='_blank' style={{ color: 'var(--white)' }} rel='noreferrer'>SDG Push</a>
            , a process that combines analytical capabilities with qualitative methods to assess context, options, and bottlenecks to determine effective policy choices, investments and pathways.
          </h5>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section-blue'>
        <div className='max-width flex-div' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>What is SDG Push</h2>
          </div>
          <div className='undp-section-content'>
            <span className='bold'>Despite these extremely challenging realities, the Sustainable Development Goals (SDGs) 2030 Agenda remains more relevant than ever.</span>
            {' '}
            It is the world’s first and only globally agreed systems agenda, designed for precisely the kinds of intersecting crises we face today. The latest SDG progress report shows virtually all the SDGs are moving in the reverse direction. As we reach the mid-point for achieving the SDGs, a refresh of our approach to achieving the SDGs is needed.
            <br />
            <br />
            SDG Push provides a systems-level approach to generate evidence-based policy accelerators using the latest technologies and best practices in integrated analytics, sensemaking, sustainable finance and futures modelling.
          </div>
        </div>
      </div>
      <div className='margin-top-13 margin-bottom-13 max-width'>
        <div className='undp-section margin-bottom-13'>
          <div>
            <h4 className='undp-typography margin-top-09'>SDG Trends</h4>
            <p className='undp-typography large-font'>
              Use this tool to get a country overview of which SDGs are on-track or lagging behind in reaching the 2030 targets.
              <br />
              <br />
              Powered by data, explore each of the 17 SDG and related 169 sub-targets trends through interactive, easy-to-use visualisations of the
              {' '}
              <a href='https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf' target='_blank' rel='noreferrer' className='undp-style'>232 unique indicators</a>
              .
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic/${countryCode}/sdg-trends`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore SDG Trends
                  </button>
                </NavLink>
              ) : null
            }
          </div>
          <div>
            <img alt='sgd trends' src={SDGTrends} style={{ width: '100%' }} />
          </div>
        </div>
        <div className='undp-section margin-bottom-13'>
          <div>
            <img alt='Future Scenarios' src={PrioritiesImg} style={{ width: '100%' }} />
          </div>
          <div>
            <h4 className='undp-typography margin-top-09'>Current Priorities</h4>
            <p className='undp-typography large-font'>
              Use a custom-built Natural Language Processing Tool, to analyze countries’ latest
              {' '}
              <a href='https://sustainabledevelopment.un.org/vnrs/' target='_blank' rel='noreferrer' className='undp-style'>Voluntary National Reviews</a>
              {' '}
              and discover which SDGs feature most prominently as a priority.
              <br />
              <br />
              Or upload your own document to compare its SDG relevance.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic/${countryCode}/current-priorities`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Current Priorities
                  </button>
                </NavLink>
              ) : null
            }
          </div>
        </div>
        <div className='undp-section margin-bottom-13'>
          <div>
            <h4 className='undp-typography margin-top-09'>Future Scenarios</h4>
            <p className='undp-typography large-font'>
              Use interactive visualisations to simulate ambitious yet feasible set of SDG accelerators across governance, social protection, green recovery, and digitalization for your country of interest.
              <br />
              <br />
              Based in the recent
              {' '}
              <a href='https://data.undp.org/wp-content/uploads/2021/04/Leaving-No-One-Behind-COVID-impact-on-the-SDGs-second-flagship-2.pdf' target='_blank' className='undp-style' rel='noreferrer'>flagship publication</a>
              , explore future trajectories and scenarios that can put us back on track to recover better from the COVID-19 pandemic
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic/${countryCode}/future-scenarios`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Future Scenarios
                  </button>
                </NavLink>
              ) : null
            }
          </div>
          <div>
            <img alt='future scenarios' src={FutureImg} style={{ width: '100%' }} />
          </div>
        </div>
        <div className='undp-section'>
          <div>
            <img alt='sinterlinkages' src={InterlinkagesImg} style={{ width: '100%' }} />
          </div>
          <div>
            <h4 className='undp-typography margin-top-09'>SDG Interlinkages</h4>
            <p className='undp-typography large-font'>
              The SDGs do not exist in silos, understanding how the goals are interconnected, both positively and negatively, is essential to understanding the mechanisms for achieving the targets.
              <br />
              <br />
              Examine how the 169 targets are interconnected and how this relates to the SDGs that are not on track to reach the 2030 goals.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic/${countryCode}/synergies-and-tradeoffs`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Interlinkages
                  </button>
                </NavLink>
              ) : null
            }
          </div>
        </div>
      </div>
      {
        countryCode ? null : (
          <div style={{ padding: 'var(--spacing-09) 1rem', backgroundColor: 'var(--gray-200)', borderTop: '1px solid var(--gray-400)' }}>
            <div className='max-width'>
              <h2 className='undp-typography'>Select a country</h2>
              <p className='undp-typography large-font'>Select a country and use this tool to get country overview of which SDGs are on-track or lagging behind, analyze the countries&apos; latest VNRs, simulate ambitious yet feasible set of SDG accelerators and understanding how the goals are interconnected</p>
              <div className='flex-div'>
                <Select
                  className='undp-select'
                  placeholder='Select Year'
                  showSearch
                  value={selectedCountry}
                  onChange={(value) => { setSelectedCountry(value); }}
                  style={{ flexGrow: 1 }}
                >
                  {
                    sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                  }
                </Select>
                <NavLink
                  to={`../../sdg-push-diagnostic/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === selectedCountry)]['Alpha-3 code-1']}`}
                  style={{ color: 'var(--white)', textDecoration: 'none', flexShrink: 0 }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Country
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        )
      }
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>Get in touch</h2>
          </div>
          <div className='undp-section-content'>
            Want to upload your own data to power the Diagnostic?
            <br />
            Email
            {' '}
            <a href='mailto:data@undp.org' className='undp-style' style={{ color: 'var(--white)' }} target='_blank' rel='noreferrer'>data@undp.org</a>
            <br />
            <br />
            This tool is powered by the latest data available on
            {' '}
            <a href={countryCode ? `https://unstats.un.org/sdgs/dataportal/countryprofiles/${countryCode}` : 'https://unstats.un.org/sdgs/dataportal'} className='undp-style' style={{ color: 'var(--white)' }} target='_blank' rel='noreferrer'>UNStats</a>
            . The interlinkages visualization is powered by data available on
            {' '}
            <a href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-visualization' className='undp-style' style={{ color: 'var(--white)' }} target='_blank' rel='noreferrer'>KnowSDGs Platform by European Commission</a>
            .
            <br />
            <br />
            If you have additional or proxy data on the SDG indicators, get in touch and we can support in uploading the information to tailor the tool to meet the country needs and context.
          </div>
        </div>
      </div>
      <div style={{
        backgroundColor: 'var(--gray-200)',
        borderTop: '1px solid var(--gray-600)',
        padding: 'var(--spacing-09) var(--spacing-03)',
        textAlign: 'center',
      }}
      >
        <h6 className='undp-typography margin-bottom-07'>With the support of the German Federal Ministry for Economic Cooperation and Development</h6>
        <img alt='giz logo' src={GIZLogo} style={{ width: '250px', margin: 'auto' }} />
      </div>
    </>
  );
};
