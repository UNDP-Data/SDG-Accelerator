import styled from 'styled-components';
import { Select } from 'antd';
import sortBy from 'lodash.sortby';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import IMAGES from '../img/images';
import { InterlinkageOverview } from './InterlinkageOverview';
import { SDG_COLOR_ARRAY } from '../Constants';
import { AccordionEl } from './Accordion';
import { ForceDirectedGraph } from './InterlinkageOverview/FDG';

const HeroImageEl = styled.div`
  background: url(${IMAGES.GlobalHomepageBG}) no-repeat center;
  background-size: cover;
  margin-top: 116px;
  padding: 10rem 3rem;
`;

const FirstColumn = styled.div`
  width: calc(66.66% - 0.5rem);
  min-width: 30rem;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
const SecondColumn = styled.div`
  width: calc(33.33% - 0.5rem);
  min-width: 20rem;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const GlobalHomePage = () => (
  <>
    <HeroImageEl className='undp-hero-image'>
      <div style={{ maxWidth: '47.5rem' }}>
        <h1 className='undp-typography'>SDG Push Diagnostic</h1>
        <p className='undp-typography'>
          The SDG Push Diagnostic reimagines and recalibrates how we determine, interrogate and advance development interventions that put countries on more stable footing.
        </p>
      </div>
    </HeroImageEl>
    <div className='flex-div gap-00' style={{ flexGrow: 1 }}>
      {
        Array.from(Array(17).keys()).map((d) => <div key={d} style={{ height: '1rem', backgroundColor: SDG_COLOR_ARRAY[d], flexGrow: 1 }} />)
      }
    </div>
    <div style={{ backgroundColor: 'var(--gray-100)', padding: '5rem 2rem' }}>
      <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem' }}>
        <SecondColumn className='undp-section-content'>
          <h2 className='undp-typography'>The Integrated SDG Insight reports</h2>
        </SecondColumn>
        <FirstColumn className='undp-section-content large-font'>
          The Diagnostic powers the Integrated SDG Insights which provide a strong evidence-base and relevant insights to support national ambition at the SDG Summit 2023.
        </FirstColumn>
      </div>
      <div className='max-width'>
        <div className='margin-bottom-07'>
          <AccordionEl
            title='What is distinct about the Integrated SDG Insight reports?'
            body={(
              <div className='flex-div flex-wrap' style={{ alignItems: 'stretch' }}>
                <FirstColumn>
                  <p className='undp-typography'>
                    The insights are unique — not a statistical gaps report or evaluation of development impact — but a playbook, showing the policy choices that build SDG pathways.
                  </p>
                  <p className='undp-typography'>
                    UNDP supported over 90+ countries to generate these insights to come to the SDG Summit with a high level of ambition — and evidence-based pathways to achieve it. These insights are a result of country-level and government consultation, data analysis, machine learning, interlinkage mapping, and generating futures scenarios.
                  </p>
                  <p className='undp-typography margin-bottom-00'>
                    It also includes national analysis of economic growth pathways and fiscal and financial constraints, providing insights that are grounded in the countries&apos; realities.
                  </p>
                </FirstColumn>
                <SecondColumn>
                  <div style={{ backgroundColor: 'var(--gray-200)', alignItems: 'center' }} className='flex-div'>
                    <div className='stat-card'>
                      <h2>
                        93
                      </h2>
                      <p>Countries supported by UNDP</p>
                    </div>
                  </div>
                </SecondColumn>
              </div>
            )}
          />
        </div>
        <div className='margin-bottom-07'>
          <AccordionEl
            title='How SDG interlinkages helped to chart integrated SDG pathways?'
            body={(
              <div className='flex-div flex-wrap' style={{ alignItems: 'stretch' }}>
                <p className='undp-typography'>
                  Building from national trends and priorities, SDG interlinkages help to chart integrated SDG pathways that reflect policy choices with the most potential to accelerate the SDGs.
                </p>
                <p className='undp-typography'>
                  SDG interlinkages reveal how actions directed towards one SDG can impact others. Uncovering and understanding these interactions can help to achieve the 2030 Agenda for Sustainable Development and navigating trade-offs.
                </p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
    <div style={{ padding: '5rem 2rem' }}>
      <div>
        <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem' }}>
          <SecondColumn className='undp-section-content'>
            <h3 className='undp-typography margin-bottom-00'>Emerging Global Pattern</h3>
          </SecondColumn>
          <FirstColumn className='undp-section-content large-font'>
            Across 90+ reports, common SDG targets emerged as key entry points where investment in one SDG can unlock progress on others. The visuals below shows the key SDG targets and the combination of policy choices that can re-balance social, environmental, and economic achievements.
          </FirstColumn>
        </div>
        <div className='max-width'>
          <ForceDirectedGraph />
        </div>
      </div>
    </div>
    <div style={{ padding: '0 2rem 5rem 2rem' }}>
      <div>
        <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem' }}>
          <SecondColumn className='undp-section-content'>
            <h3 className='undp-typography margin-bottom-00'>Regional and Income Group Comparisons</h3>
          </SecondColumn>
          <FirstColumn className='undp-section-content large-font'>
            Explore the full dataset by region and income classification to show unique entry points for integrated SDG pathways.
          </FirstColumn>
        </div>
        <div className='max-width'>
          <InterlinkageOverview />
        </div>
      </div>
    </div>
    <div style={{ backgroundColor: 'var(--blue-600)', padding: '5rem 2rem' }}>
      <div className='max-width'>
        <div className='flex-div flex-wrap margin-bottom-09' style={{ padding: '0 1rem', color: 'var(--white)' }}>
          <SecondColumn className='undp-section-content'>
            <h2 className='undp-typography margin-bottom-00'>SDG Push Diagnostics Features</h2>
          </SecondColumn>
          <FirstColumn className='undp-section-content'>
            The SDG Push Diagnostic provides a dynamic visualization of the development landscape to help countries chart acceleration pathways through their policy choices. It integrates multiple data sources to establish a rapid landscape analysis that showcases SDG trends, national priorities, interlinkages, and potential futures.
          </FirstColumn>
        </div>
        <div className='margin-bottom-07'>
          <AccordionEl
            title='SDG Trends'
            body={(
              <div className='flex-div gap-07'>
                <div style={{ width: 'calc(66.66% - 2rem)' }}>
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
                  <p className='label margin-top-07'>Select a country to explore SDG trends </p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
                  >
                    {
                    sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                  }
                  </Select>
                </div>
                <div style={{ width: '33.33%' }}>
                  <img alt='sgd trends' src={IMAGES.imgO1} style={{ width: '100%' }} />
                </div>
              </div>
          )}
          />
        </div>
        <div className='margin-bottom-07'>
          <AccordionEl
            title='National Priorities'
            body={(
              <div className='flex-div gap-07'>
                <div style={{ width: 'calc(66.66% - 2rem)' }}>
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
                  <p className='label margin-top-07'>Select a country to explore national priorities</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/current-priorities`, '_self'); }}
                  >
                    {
                  sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                }
                  </Select>
                </div>
                <div style={{ width: '33.33%' }}>
                  <img alt='Future Scenarios' src={IMAGES.img02} style={{ width: '100%' }} />
                </div>
              </div>
          )}
          />
        </div>
        <div className='margin-bottom-07'>
          <AccordionEl
            title='SDG Interlinkages'
            body={(
              <div className='flex-div gap-07'>
                <div style={{ width: 'calc(66.66% - 2rem)' }}>
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
                  <p className='label margin-top-07'>Select a country to explore SDG interlinkages</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/synergies-and-tradeoffs`, '_self'); }}
                  >
                    {
                  sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                }
                  </Select>
                </div>
                <div style={{ width: '33.33%' }}>
                  <img alt='interlinkages' src={IMAGES.img04} style={{ width: '100%' }} />
                </div>
              </div>
          )}
          />
        </div>
        <div className='margin-bottom-07'>
          <AccordionEl
            title='Future Scenarios'
            body={(
              <div className='flex-div gap-07'>
                <div style={{ width: 'calc(66.66% - 2rem)' }}>
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
                  <p className='label margin-top-07'>Select a country to explore future scenarios</p>
                  <Select
                    style={{ width: '100%' }}
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/future-scenarios`, '_self'); }}
                  >
                    {
                  sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                }
                  </Select>
                </div>
                <div style={{ width: '33.33%' }}>
                  <img alt='future scenarios' src={IMAGES.img03} style={{ width: '100%' }} />
                </div>
              </div>
          )}
          />
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
