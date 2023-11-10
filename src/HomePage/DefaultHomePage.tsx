import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Select } from 'antd';
import sortBy from 'lodash.sortby';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import IMAGES from '../img/images';
import { InterlinkageOverview } from './InterlinkageOverview';
import { COUNTRIES_WITH_REPORT } from '../Constants';

interface Props {
  countryCode?: string;
  countryFullName?: string;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

const H2 = styled.h2`
  margin-bottom: var(--spacing-13);
  @media (max-width: 720px) {
    margin-bottom: var(--spacing-11) !important;
  }
`;

export const DefaultHomePage = (props: Props) => {
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
            SDG Push reimagines and recalibrates how we determine, interrogate and advance development interventions that put countries on more stable footing. The Diagnostic powers &lsquo;Integrated SDG Insights&lsquo; reports which provide a strong evidence-base and relevant insights to support national ambition at the SDG Summit 2023.
          </h5>
          {
            countryCode
              ? COUNTRIES_WITH_REPORT.indexOf(countryCode.replaceAll('WithCountryGovInput', '')) !== -1
                ? (
                  <a
                    href={`https://sdgigeneralstorage.blob.core.windows.net/sdg-push/InsightReports/UNDP%20-%20SDG%20${countryCode.replaceAll('WithCountryGovInput', '')}.pdf`}
                    target='_blank'
                    className='undp-button button-arrow button-primary margin-top-07'
                    style={{ width: 'fit-content', textDecoration: 'none' }}
                    rel='noreferrer'
                  >
                    Read the Integrated SDG Insights Report
                  </a>
                ) : null : (
                  <div className='margin-top-09'>
                    <p className='label margin-bottom-03'>Select a country to find out more</p>
                    <Select
                      className='undp-select'
                      placeholder='Select a country to find out more'
                      showSearch
                      onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1'] === 'IDN' ? 'IDNWithCountryGovInput' : CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
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
                  The SDG Push Diagnostic provides a dynamic visualization of the development landscape to help countries chart acceleration pathways through their policy choices. It integrates multiple data sources to establish a rapid landscape analysis that showcases SDG trends, national priorities, interlinkages, and potential futures.
                  <br />
                  <br />
                  The diagnostic is the foundation for country-specific &lsquo;Integrated SDG Insights&lsquo; reports. By mapping national priorities against current SDG trends and exploring interlinkages across SDGs, it can help countries consider where policy choices could have the biggest multiplier effect or trade-off.
                </div>
              </div>
            </div>
          )
      }
      {
        countryCode ? null
          : (
            <InterlinkageOverview />
          )
      }
      <div className='margin-top-13 margin-bottom-13 max-width'>
        <H2 className='undp-typography margin-bottom-07' style={{ padding: '0rem 1rem' }}>SDG Push Diagnostics Features</H2>
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
              Understanding how countries perform against these provides an assessment of SDG progress and the baseline landscape against which to build SDG policy pathways.
              <br />
              <br />
              Countries SDG trends are based on
              {' '}
              <a href='https://unstats.un.org/sdgs/dataportal' target='_blank' rel='noreferrer' className='undp-style'>data</a>
              {' '}
              and
              {' '}
              <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' target='_blank' rel='noreferrer' className='undp-style'>methodology</a>
              {' '}
              from the UN Statistics Division. Additional data may be added to address gaps at government request, to provide a comprehensive landscape for identification of SDG policy pathways.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../${countryCode}/sdg-trends`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore SDG Trends
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to explore SDG trends </p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
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
            <img alt='sgd trends' src={IMAGES.imgO1} style={{ width: '100%' }} />
          </div>
        </div>
        <div className='undp-section margin-bottom-13 image-left margin-top-07'>
          <div>
            <img alt='Future Scenarios' src={IMAGES.img02} style={{ width: '100%' }} />
          </div>
          <div>
            <h4 className='undp-typography margin-top-05'>National Priorities</h4>
            <p className='undp-typography large-font'>
              Current priorities are analysed using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification. The training data is based on an improved
              {' '}
              <a href='https://zenodo.org/record/6831287#.ZGVpKHZBxhZ' target='_blank' rel='noreferrer' className='undp-style'>OSDG Community Dataset</a>
              {' '}
              from UNDP IICPSD SDG AI Lab. It considers 100k+ terms, including phrases and expressions.
              <br />
              <br />
              Explore the analysis of these priorities using Machine Learning by country.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../${countryCode}/current-priorities`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore National Priorities
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to explore national priorities</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/current-priorities`, '_self'); }}
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
        <div className='undp-section image-right margin-bottom-13'>
          <div>
            <h4 className='undp-typography margin-top-05'>SDG Interlinkages</h4>
            <p className='undp-typography large-font'>
              The SDGs do not exist in silos. Understanding the interactions across social, economic and environmental elements of sustainable development is essential to move the needle on the SDGs. SDG Interlinkages show how actions directed towards one SDG can influence the others. Uncovering and understanding these interactions helps in achieving the 2030 Agenda - avoiding the unintended deterioration of the SDGs and their 169 associated targets.
              <br />
              <br />
              The target-level interlinkages are based on the latest available methodology by the
              {' '}
              <a href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-targets' target='_blank' rel='noreferrer' className='undp-style'>KnowSDGs Platform by European Commission</a>
              . A first literature review (
              <a href='https://publications.jrc.ec.europa.eu/repository/handle/JRC115163' target='_blank' rel='noreferrer' className='undp-style'>Miola et al., 2019</a>
              ) was updated and expanded in
              {' '}
              <a href='https://knowsdgs.jrc.ec.europa.eu/intro-interlinkages' target='_blank' rel='noreferrer' className='undp-style'>2021-2022</a>
              {' '}
              by a team of researchers who retrieved and analysed all relevant scientific and grey literature* on SDG interlinkages, both in Scopus and Google Scholar.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../${countryCode}/synergies-and-tradeoffs`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Interlinkages
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to explore SDG interlinkages</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/synergies-and-tradeoffs`, '_self'); }}
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
            <img alt='interlinkages' src={IMAGES.img04} style={{ width: '100%' }} />
          </div>
        </div>
        <div className='undp-section image-left'>
          <div>
            <img alt='future scenarios' src={IMAGES.img03} style={{ width: '100%' }} />
          </div>
          <div>
            <h4 className='undp-typography margin-top-05'>Future Scenarios</h4>
            <p className='undp-typography large-font'>
              SDG Push identifies national
              {' '}
              <a href='https://sdgintegration.undp.org/covid-impact-low-and-medium-hdi-groups' target='_blank' className='undp-style' rel='noreferrer'>SDG insights based on integrated accelerators</a>
              {' '}
              across Governance, Social Protection, Green Economy and Digital Disruption.
              <br />
              <br />
              Based on the systems model of
              {' '}
              <a href='https://korbel.du.edu/pardee/international-futures-platform' target='_blank' className='undp-style' rel='noreferrer'>international futures</a>
              , SDG Push models the impact that incorporating SDG Push accelerators in development can make, providing valuable insights into systems interactions across the SDGs.
            </p>
            {
              countryCode ? (
                <NavLink
                  to={`../../${countryCode}/future-scenarios`}
                  style={{ color: 'var(--white)', textDecoration: 'none' }}
                >
                  <button type='button' className='undp-button button-primary button-arrow'>
                    Explore Future Scenarios
                  </button>
                </NavLink>
              ) : (
                <>
                  <p className='label margin-top-07'>Select a country to explore future scenarios</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/future-scenarios`, '_self'); }}
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
                  onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1'] === 'IDN' ? 'IDNWithCountryGovInput' : CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
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
            <a href={countryCode ? `https://unstats.un.org/sdgs/dataportal/countryprofiles/${countryCode === 'IDNWithCountryGovInput' ? 'IDN' : countryCode}` : 'https://unstats.un.org/sdgs/dataportal'} className='undp-style dark-bg' target='_blank' rel='noreferrer'>UNStats</a>
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
        <img alt='giz logo' src={IMAGES.gizLogo} style={{ width: '250px', margin: 'auto' }} />
      </div>
    </>
  );
};
