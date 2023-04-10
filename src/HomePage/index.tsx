import styled from 'styled-components';
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

const H2 = styled.h2`
  margin-bottom: var(--spacing-05);
  @media (max-width: 720px) {
    margin-bottom: var(--spacing-11) !important;
  }
`;

export const HomePage = (props: Props) => {
  const {
    countryCode,
    countryFullName,
  } = props;
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
            The
            {' '}
            <a href='https://sdgintegration.undp.org/sdg-push' className='undp-style dark-bg red-underline' target='_blank' rel='noreferrer'>SDG Push</a>
            {' '}
            reimagines and recalibrates how we determine, interrogate and advance development interventions that put countries on more stable footing. The SDG Push Diagnostic is a key element of the SDG Push.
          </h5>
          {
            countryCode ? null : (
              <div className='flex-div margin-top-09'>
                <Select
                  className='undp-select'
                  placeholder='Select a country'
                  showSearch
                  onChange={(value) => { window.open(`../../sdg-push-diagnostic-test/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
                  style={{ flexGrow: 1 }}
                >
                  {
                    sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                  }
                </Select>
              </div>
            )
          }
        </div>
      </HeroImageEl>
      {
        countryCode ? null
          : (
            <div className='undp-hero-section-blue'>
              <div className='max-width flex-div flex-wrap' style={{ padding: '0 1rem' }}>
                <div className='undp-section-content'>
                  <h2 className='undp-typography'>What does the SDG Push Diagnostic do?</h2>
                </div>
                <div className='undp-section-content'>
                  The SDG Push Diagnostic provides a dynamic visualization of the development landscape. It integrates multiple data sources and digital innovation to establish a rapid landscape analysis – SDG trends, current priorities, potential futures, and interlinkages.
                  <br />
                  <br />
                  Use the custom built tools below, to establish a rapid baseline with data-powered visualizations, a natural language processing tool, futures scenarios and mapping interlinkages.
                </div>
              </div>
            </div>
          )
      }
      <div className='margin-top-13 margin-bottom-13 max-width'>
        <H2 className='undp-typography' style={{ padding: '0rem 1rem' }}>SDG push Diagnostics Features</H2>
        <div className='undp-section margin-bottom-13 image-right'>
          <div>
            <h4 className='undp-typography margin-top-05'>SDG Trends</h4>
            <p className='undp-typography large-font'>
              Progress on the 17 SDGs are tracked through 169 sub-targets, which in turn are measured using
              {' '}
              <a href='https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf' target='_blank' rel='noreferrer' className='undp-style'>232 unique indicators</a>
              .
              <br />
              <br />
              Understanding how countries perform against these provides a comprehensive assessment of the current trends and the baseline landscape against which to build the SDG Push.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic-test/${countryCode}/sdg-trends`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore SDG Trends
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to explore their SDG trends</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../sdg-push-diagnostic-test/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
                  >
                    {
                      sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                    }
                  </Select>
                </>
              )
            }
          </div>
          <div>
            <img alt='sgd trends' src={SDGTrends} style={{ width: '100%' }} />
          </div>
        </div>
        <div className='undp-section margin-bottom-13 image-left'>
          <div>
            <img alt='Future Scenarios' src={PrioritiesImg} style={{ width: '100%' }} />
          </div>
          <div>
            <h4 className='undp-typography margin-top-05'>Current Priorities</h4>
            <p className='undp-typography large-font'>
              Documents such as National Development Plans and
              {' '}
              <a href='https://sustainabledevelopment.un.org/vnrs/' target='_blank' rel='noreferrer' className='undp-style'>Voluntary National Reviews (VNRs)</a>
              {' '}
              indicate priorities of the government that can be mapped to the SDGs. These priorities are important as we develop the SDG Push interventions by country.
              <br />
              <br />
              Explore the analysis of these priorities using Machine Learning by country.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic-test/${countryCode}/current-priorities`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Current Priorities
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to analyze their current priorities</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../sdg-push-diagnostic-test/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/current-priorities`, '_self'); }}
                  >
                    {
                      sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                    }
                  </Select>
                </>
              )
            }
          </div>
        </div>
        <div className='undp-section margin-bottom-13 image-right'>
          <div>
            <h4 className='undp-typography margin-top-05'>Future Scenarios</h4>
            <p className='undp-typography large-font'>
              In the SDG Push we will be identifying potential accelerators.
              {' '}
              <a href='https://data.undp.org/wp-content/uploads/2021/04/Leaving-No-One-Behind-COVID-impact-on-the-SDGs-second-flagship-2.pdf' target='_blank' className='undp-style' rel='noreferrer'>UNDP&apos;s flagship publication</a>
              {' '}
              presents one such scenario (governance, social protection, green economy, and digitalisation) at the global level that can put us back on track to recover better.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic-test/${countryCode}/future-scenarios`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Future Scenarios
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to explore their future scenarios</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../sdg-push-diagnostic-test/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/future-scenarios`, '_self'); }}
                  >
                    {
                      sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                    }
                  </Select>
                </>
              )
            }
          </div>
          <div>
            <img alt='future scenarios' src={FutureImg} style={{ width: '100%' }} />
          </div>
        </div>
        <div className='undp-section image-left'>
          <div>
            <img alt='sinterlinkages' src={InterlinkagesImg} style={{ width: '100%' }} />
          </div>
          <div>
            <h4 className='undp-typography margin-top-05'>SDG Interlinkages</h4>
            <p className='undp-typography large-font'>
              The SDGs do not exist in silos. Understanding the interactions across social, economic, political, health and environmental developments is essential to move the needle on the SDGs.
              <br />
              <br />
              Examine how the 169 targets are interconnected and how this relates to the SDGs that are not on track to reach the 2030 goals.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../sdg-push-diagnostic-test/${countryCode}/synergies-and-tradeoffs`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Interlinkages
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to explore their SDG interlinkages</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../sdg-push-diagnostic-test/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/synergies-and-tradeoffs`, '_self'); }}
                  >
                    {
                      sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                    }
                  </Select>
                </>
              )
            }
          </div>
        </div>
      </div>
      {
        countryCode ? null : (
          <div style={{ padding: 'var(--spacing-09) 1rem', backgroundColor: 'var(--gray-200)', borderTop: '1px solid var(--gray-400)' }}>
            <div className='max-width'>
              <h2 className='undp-typography'>Select a country</h2>
              <p className='undp-typography large-font'>
                Select a country and use this tool to get country overview of which SDGs are on-track or lagging behind, analyze the countries&apos; latest VNRs (or upload your own reports), simulate ambitious yet feasible set of SDG accelerators and understanding how the goals are interconnected
              </p>
              <div className='flex-div'>
                <Select
                  className='undp-select'
                  showSearch
                  placeholder='Select a country'
                  onChange={(value) => { window.open(`../../sdg-push-diagnostic-test/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
                  style={{ flexGrow: 1 }}
                >
                  {
                    sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                  }
                </Select>
              </div>
            </div>
          </div>
        )
      }
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div flex-wrap' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>Get in touch</h2>
          </div>
          <div className='undp-section-content'>
            Want to upload your own data to power the Diagnostic?
            <br />
            Email
            {' '}
            <a href='mailto:data@undp.org' className='undp-style dark-bg' target='_blank' rel='noreferrer'>data@undp.org</a>
            <br />
            <br />
            This tool is powered by the latest data available on
            {' '}
            <a href={countryCode ? `https://unstats.un.org/sdgs/dataportal/countryprofiles/${countryCode}` : 'https://unstats.un.org/sdgs/dataportal'} className='undp-style dark-bg' target='_blank' rel='noreferrer'>UNStats</a>
            . The interlinkages visualization is powered by data available on
            {' '}
            <a href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-visualization' className='undp-style dark-bg' target='_blank' rel='noreferrer'>KnowSDGs Platform by European Commission</a>
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
