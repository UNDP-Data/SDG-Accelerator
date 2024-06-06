import styled from 'styled-components';
import { Select } from 'antd';
import sortBy from 'lodash.sortby';
import TextTransition, { presets } from 'react-text-transition';
import { useState, useEffect } from 'react';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import IMAGES from '../img/images';
import { InterlinkageOverview } from './InterlinkageOverview';
import { SDG_COLOR_ARRAY } from '../Constants';
import { AccordionEl } from './Accordion';
import { ForceDirectedGraph } from './InterlinkageOverview/FDG';
import './HomePageStyle.css';

const FirstColumn = styled.div`
  width: 100%;
  max-width: 1024px;
  flex-grow: 1;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
const SecondColumn = styled.div`
  width: 100%;
  flex-grow: 1;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const AccordionColumn = styled.div`
  width: calc(66.66% - 2rem);
  @media (max-width: 720px) {
    width: 100%;
  }
`;

const AccordionImageColumn = styled.div`
  width: 33%;
  @media (max-width: 720px) {
    display: none;
  }
`;

const Button = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  background-color: var(--white);
  border: 0;
`;

export const GlobalHomePage = () => {
  const [index, setIndex] = useState(0);
  const countriesList = ['Everyone', 'South Africa', 'Kuwait', 'Nepal', 'Sri Lanka', 'Benin', 'Everyone', 'Gabon', 'Cuba', 'Botswana', 'Iran', 'Cabo Verde', 'Everyone', 'Gambia', 'Philippines', 'Iraq', 'Namibia', 'Malawi', 'Everyone', 'Kyrgyzstan', 'Lesotho', 'Senegal', 'Bangladesh', 'Serbia', 'Everyone', 'Cameroon', 'Djibouti', 'Bhutan', 'Egypt', 'Maldives'];

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((indx) => indx + 1),
      1000, // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
  return (
    <>
      <div className='background'>
        <div className='blob blob1' />
        <div className='blob blob2' />
        <div style={{
          maxWidth: '65rem',
          position: 'absolute',
          top: '0',
          height: 'calc(100vh - 1rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <div className='padding-left-09' style={{ color: 'var(--white)' }}>
            <h1 className='undp-typography' style={{ wordBreak: 'break-word', marginBottom: 0 }}>
              How is
            </h1>
            <h1 className='undp-typography' style={{ wordBreak: 'break-word', marginBottom: 0 }}>
              <TextTransition springConfig={presets.wobbly} inline>{countriesList[index % countriesList.length]}</TextTransition>
            </h1>
            <h1 className='undp-typography' style={{ wordBreak: 'break-word' }}>doing?</h1>
            <p className='undp-typography'>
              UNDP&apos;s Integrated SDG Insights explore how to achieve the SDGs by 2030. So that no one is left behind.
            </p>
            <Button onClick={() => { document.getElementById('section-2')?.scrollIntoView(); }} type='button'><img className='margin-top-02' width={24} src='https://design.undp.org/icons/chevron-down.svg' alt='icon' /></Button>
          </div>
        </div>
      </div>
      <div className='flex-div gap-00' style={{ flexGrow: 1 }}>
        {
        Array.from(Array(17).keys()).map((d) => <div key={d} style={{ height: '1rem', backgroundColor: SDG_COLOR_ARRAY[d], flexGrow: 1 }} />)
      }
      </div>
      <div id='section-2' className='padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--gray-700)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div style={{
          maxWidth: '1024px',
          margin: 'auto',
          textAlign: 'center',
          color: 'var(--white)',
        }}
        >
          <h2 className='undp-typography'>
            See how your country is doing
          </h2>
          <p className='undp-typography margin-bottom-07'>
            The SDG Push Diagnostic provides a dynamic visualization of the development landscape  to help countries chart acceleration pathways through their policy choices.
          </p>
          <Select
            style={{ width: '100%' }}
            className='undp-select'
            placeholder='Select Country'
            showSearch
            onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}`, '_self'); }}
          >
            {
            sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
          }
          </Select>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--blue-600)' }}>
        <div className='max-width'>
          <div className='flex-div flex-wrap margin-bottom-09' style={{ color: 'var(--white)' }}>
            <SecondColumn className='undp-section-content'>
              <h2 className='undp-typography margin-bottom-00'>SDG Push Diagnostic Features</h2>
            </SecondColumn>
            <FirstColumn className='undp-section-content'>
              The SDG Push Diagnostic provides a dynamic visualization of the development landscape to help countries chart acceleration pathways through their policy choices. It integrates multiple data sources to establish a rapid landscape analysis that showcases SDG trends, national priorities, interlinkages, and potential futures.
            </FirstColumn>
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='SDG Moment'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      Assesses challenges and opportunities in national growth trajectories with insights on environmental sustainability and inclusiveness.
                      <br />
                      <br />
                      <span className='bold'>Data Sources</span>
                      <br />
                      Future trajectories to 2025 are based on IMF-WEO GDP projections, distributions of per capita income or consumption from the World Bank, and CO2 emissions from the Global Carbon Budget 2022 and EDGAR (JRC and IEA).
                    </p>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='sgd moment' src={IMAGES.img06} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='SDG Trends'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
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
                    <p className='label margin-top-07'>Select a country or territory to explore SDG trends </p>
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
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='sgd trends' src={IMAGES.imgO1} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='National Priorities'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      Current priorities are analysed using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification. The training data is based on an improved
                      {' '}
                      <a href='https://zenodo.org/record/6831287#.ZGVpKHZBxhZ' target='_blank' rel='noreferrer' className='undp-style'>OSDG Community Dataset</a>
                      . It considers 100k+ terms, including phrases and expressions.
                      <br />
                      <br />
                      Explore the analysis of these priorities using Machine Learning by country.
                    </p>
                    <p className='label margin-top-07'>Select a country or territory to explore national priorities</p>
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
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='Future Scenarios' src={IMAGES.img02} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='SDG Interlinkages'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
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
                    <p className='label margin-top-07'>Select a country or territory to explore SDG interlinkages</p>
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
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='interlinkages' src={IMAGES.img04} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='Future Scenarios'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
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
                    <p className='label margin-top-07'>Select a country or territory to explore future scenarios</p>
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
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='future scenarios' src={IMAGES.img03} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='Finance & Stimulus'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      Provides insight into indicators of fiscal and financial stress with options (INFF) for stimulus and other means to accelerate progress.
                      <br />
                      <br />
                      <span className='bold'>Data Sources</span>
                      <br />
                      Most recent resource data from UNU-WIDER GRD (between 2018 and 2021), debt and revenue from IMF WEO (between 2020 and forecasts for 2023), external debt from IDS (2023), yields from Haver Analytics (8 June 2023), credit ratings from S&P, Moodys and FITCH (2023), and DSA ratings from World Bank/IMF (31 May 2023).
                    </p>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='finance and stimulus' src={IMAGES.img05} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--gray-100)' }}>
        <div className='flex-div flex-wrap margin-bottom-09 max-width'>
          <SecondColumn className='undp-section-content'>
            <h2 className='undp-typography'>The Integrated SDG Insight reports</h2>
          </SecondColumn>
          <FirstColumn className='undp-section-content large-font'>
            <p className='undp-typography'>
              The Diagnostic powers the Integrated SDG Insights which provide a strong evidence-base and relevant insights to support national ambition at the SDG Summit 2023.
            </p>
            <p className='undp-typography'>
              The methodology for the diagnostics can be found
              {' '}
              <a className='undp-style' href='https://sdgigeneralstorage.blob.core.windows.net/sdg-push/Methodology.pdf' target='_blank' rel='noreferrer'>here</a>
              .
            </p>
          </FirstColumn>
        </div>
        <div className='max-width'>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='What is distinct about the Integrated SDG Insight reports?'
              body={(
                <div className='flex-div flex-wrap gap-07' style={{ alignItems: 'stretch' }}>
                  <FirstColumn>
                    <p className='undp-typography'>
                      The insights are unique — not a statistical gaps report or evaluation of development impact — but a playbook, showing the policy choices that build SDG pathways.
                    </p>
                    <p className='undp-typography'>
                      UNDP supported 90+ countries to generate these insights to come to the SDG Summit with a high level of ambition — and evidence-based pathways to achieve it. These insights are a result of country-level and government consultation, data analysis, machine learning, interlinkage mapping, and generating futures scenarios.
                    </p>
                    <p className='undp-typography margin-bottom-00'>
                      It also includes national analysis of economic growth pathways and fiscal and financial constraints, providing insights that are grounded in the countries&apos; realities.
                    </p>
                  </FirstColumn>
                  <SecondColumn style={{ backgroundColor: 'var(--gray-200)', display: 'flex', alignItems: 'center' }}>
                    <div className='stat-card'>
                      <h2>
                        90+
                      </h2>
                      <p>Countries supported by UNDP</p>
                    </div>
                  </SecondColumn>
                </div>
            )}
            />
          </div>
          <div className='margin-bottom-05'>
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
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07'>
        <div>
          <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem' }}>
            <SecondColumn className='undp-section-content'>
              <h3 className='undp-typography margin-bottom-00'>Emerging Patterns</h3>
            </SecondColumn>
            <FirstColumn className='undp-section-content large-font'>
              Across 90+ reports, common SDG targets emerged as key entry points where investment in one SDG can unlock progress on others. The visuals below show the key SDG targets and the combination of policy choices that can re-balance social, environmental, and economic achievements.
            </FirstColumn>
          </div>
          <div style={{ padding: '0 1rem' }}>
            <div className='max-width'>
              <ForceDirectedGraph />
            </div>
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07'>
        <div>
          <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem' }}>
            <SecondColumn className='undp-section-content'>
              <h3 className='undp-typography margin-bottom-00'>Regional and Income Group Comparisons</h3>
            </SecondColumn>
            <FirstColumn className='undp-section-content large-font'>
              <p className='undp-typography'>
                Explore the full dataset by region and income classification to show unique entry points for integrated SDG pathways.
              </p>
              <p className='undp-typography italics'>
                Explore the secondary targets associated to each primary target by clicking on the primary target bubbles below.
                Click on the regions or income groups to see more detail of the countries analyzed within each group.
              </p>
            </FirstColumn>
          </div>
          <div className='max-width'>
            <InterlinkageOverview />
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--gray-700)' }}>
        <div style={{
          maxWidth: '1024px',
          margin: 'auto',
          textAlign: 'center',
          color: 'var(--white)',
        }}
        >
          <h2 className='undp-typography'>
            See how your country is doing
          </h2>
          <p className='undp-typography margin-bottom-07'>
            The SDG Push Diagnostic provides a dynamic visualization of the development landscape  to help countries chart acceleration pathways through their policy choices.
          </p>
          <Select
            style={{ width: '100%' }}
            className='undp-select'
            placeholder='Select Country'
            showSearch
            onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}`, '_self'); }}
          >
            {
            sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
          }
          </Select>
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
