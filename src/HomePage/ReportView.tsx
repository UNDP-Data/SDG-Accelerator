/* eslint-disable camelcase */
import { Tabs } from 'antd';
import { queue } from 'd3-queue';
import { json } from 'd3-request';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'd3-format';
import UNDPColorModule from 'undp-viz-colors';
import IMAGES from '../img/images';
import {
  GoalStatusType,
  LinkageDataType, ScenarioDataType, TargetStatusType, TargetStatusWithDetailsType, dataForReportType,
} from '../Types';
import { SectionCard } from './SectionCard';
import { SectionDiv } from './SectionDiv';
import { DATASOURCELINK } from '../Constants';
import { SDGTargetsGapVisualization } from '../CurrentGaps/SDGTargetsGapVisualization';
import { VNRAnalysis } from '../Priorities/VNRAnalysis';
import { InterlinkagesViz } from '../Interlinkages/InterlinkageViz';
import { LinkageData2023 } from '../Data/linkages';
import { SDGList } from '../Data/SDGGoalList';
import { LineChart } from '../FutureScenarios/LineChart';
import { GDPGraph } from './ReportComponents/GDPGraph';
import { PeopleGraph } from './ReportComponents/PeopleGraph';
import { PlanetGraph } from './ReportComponents/PlanetGraph';
import { FiscalGraph } from './ReportComponents/FiscalGraph';

interface Props {
  countryCode: string;
  targetStatuses: TargetStatusType[];
  countryFullName: string;
  goalStatuses: GoalStatusType[];
  reportData: dataForReportType;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const ReportView = (props: Props) => {
  const {
    countryCode, targetStatuses, countryFullName, reportData, goalStatuses,
  } = props;
  const [scenarioData, setScenarioData] = useState<ScenarioDataType[] | undefined>(undefined);
  const [priorityData, setPriorityData] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<TargetStatusWithDetailsType[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('0');
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    setError(undefined);
    setPriorityData(null);
    queue()
      .defer(json, `${DATASOURCELINK}/data/PrioritiesData/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/data/ScenarioData/${countryCode}.json`)
      .await(
        (
          err: any,
          d: any,
          scenarioDataFromFile: ScenarioDataType[],
        ) => {
          if (err) { setError('Error loading files'); }
          setPriorityData({ mode: 'defaultDocs', data: d.sdgs, documents: d.doc_name });

          const targetStatusTemp: TargetStatusWithDetailsType[] = [];
          SDGList.forEach((goal) => {
            goal.Targets.forEach((target) => {
              const status = targetStatuses.findIndex((el) => `Target ${el.target}` === target.Target) !== -1 ? targetStatuses[targetStatuses.findIndex((el) => `Target ${el.target}` === target.Target)].status : null;
              targetStatusTemp.push({
                goal: goal.Goal,
                target: target.Target,
                description: target['Target Description'],
                status,
              });
            });
          });
          setTargetStatus(targetStatusTemp);
          setScenarioData(scenarioDataFromFile);
        },
      );
  }, [countryCode]);
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            Integrated SDG Insights
          </h1>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section padding-top-13 padding-bottom-13'>
        <div
          className='max-width flex-div flex-wrap flex-space-around'
          style={{
            maxWidth: '70rem', margin: 'auto', justifyContent: 'space-between', padding: '2rem 0rem', gap: '4rem',
          }}
        >
          <div className='undp-section-content' style={{ width: 'calc(40% - 2rem)', minWidth: '20rem', flexGrow: 1 }}>
            <h3 className='undp-typography'>What are the Integrated SDG Insights?</h3>
          </div>
          <div className='undp-section-content' style={{ width: 'calc(60% - 2rem)', minWidth: '20rem', flexGrow: 1 }}>
            This report provides an integrated analysis of SDG trends, national priorities and explores critical SDG interlinkages to inform policy pathways and development choices. The insights support Member State preparation for the SDG Summit and builds towards effective policy implementation in the second half of the 2030 Agenda.
          </div>
        </div>
        <div
          className='max-width-1280 flex-div flex-wrap'
          style={{
            maxWidth: '70rem', margin: 'auto', gap: '1rem',
          }}
        >
          <SectionCard id='section1' cardTitle='SDG Moment' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconSnapshot} />
          <SectionCard id='section2' cardTitle='SDG Trends' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconTrends} />
          <SectionCard id='section3' cardTitle='National Priorities' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconPriorities} />
          <SectionCard id='section4' cardTitle='Interlinkages' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconInterlinkages} />
          <SectionCard id='section5' cardTitle='Futures' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconFutures} />
          <SectionCard id='section6' cardTitle='Fiscal/financial constraints' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconConstraints} />
          <SectionCard id='section7' cardTitle='SDG Stimulus' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconConstraints} />
        </div>
      </div>
      {reportData && priorityData && targetStatus && !error ? (
        <>
          <SectionDiv
            sectionNo={1}
            sectionTitle='SDG Moment'
            contentDiv={(
              <div>
                <div>
                  <p className='undp-typography'>
                    Economic growth serves as an enabler for the SDGs in the short term, while over time
                    {' '}
                    <span className='bold'>the SDG agenda itself becomes a catalyst for inclusive and low-carbon growth pathways.</span>
                  </p>
                  {reportData.SDGMoment.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                </div>
                <GDPGraph countryCode={countryCode} />
                <div className='flex-div flex-wrap gap-05' style={{ alignItems: 'stretch' }}>
                  <PeopleGraph countryCode={countryCode} />
                  <PlanetGraph countryCode={countryCode} />
                </div>
              </div>
            )}
            color='var(--white)'
            background='var(--blue-600)'
          />
          <SectionDiv
            sectionNo={2}
            sectionTitle='Trends'
            contentDiv={(
              <div className='flex-div flex-wrap gap-07'>
                <div style={{ flexGrow: 1, width: 'calc(50% - 1rem)', minWidth: '20rem' }}>
                  <p className='undp-typography'>
                    {countryFullName}
                    &apos;s SDG trends are calculated using data and methodology from the UN Statistics Division. SDG progress tracking follows
                    {' '}
                    <a href='https://unstats.un.org/sdgs/dataportal' target='_blank' className='undp-style' rel='noreferrer'>UN Stats</a>
                    {' '}
                    standards and
                    {' '}
                    <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' target='_blank' className='undp-style' rel='noreferrer'>methodology</a>
                    , and is aligned with country profiles.
                  </p>
                  {reportData.Trends ? reportData.Trends.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>) : null}
                </div>
                <div style={{ flexGrow: 1, width: 'calc(50% - 1rem)', minWidth: '20rem' }}>
                  <SDGTargetsGapVisualization targetStatuses={targetStatuses} />
                </div>
              </div>
            )}
            color='var(--black)'
            background='var(--gray-200)'
          />
          <SectionDiv
            sectionNo={3}
            sectionTitle='National Priorities'
            contentDiv={(
              <div>
                <p className='undp-typography'>
                  {countryFullName}
                  &apos;s
                  {' '}
                  national priorities are generated using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification. It considers 100k+ terms, including phrases and expressions.
                </p>
                <VNRAnalysis
                  data={priorityData.data}
                  goalStatuses={goalStatuses}
                  document={priorityData.documents}
                  defaultDocs
                  onlyBubbleChart
                />
              </div>
            )}
            color='var(--black)'
            background='var(--white)'
          />
          <SectionDiv
            sectionNo={4}
            sectionTitle='Interlinkages'
            contentDiv={(
              <div>
                <p className='undp-typography'>
                  SDG Interlinkages reveal how actions directed towards one SDG can impact others. Uncovering and understanding these interactions can help
                  {' '}
                  {countryFullName}
                  {' '}
                  to achieve the 2030 Agenda and navigate trade-offs.
                </p>
                <p className='undp-typography'>
                  Based on a global framework for interlinkages,
                  {' '}
                  {countryFullName}
                  &apos;s SDG progress is color coded at the target level.
                </p>
                <p className='undp-typography'>
                  Building from national priorities, the following pathways reflect policy investments with the most potential to accelerate the SDGs for
                  {' '}
                  {countryFullName}
                </p>
                <img src={IMAGES.interlinkageImage} alt='Interlinkage' className='margin-bottom-09' />
                <Tabs
                  activeKey={activeTab}
                  className='undp-tabs'
                  onChange={(d) => { setActiveTab(d); }}
                  items={reportData.Interlinkages.map((interlinkage, i) => (
                    {
                      label: `Insight ${i + 1}`,
                      key: `${i}`,
                      children: (
                        <div key={`${i}`}>
                          <h3 className='undp-typography'>
                            Target
                            {' '}
                            {interlinkage.Target}
                          </h3>
                          <p className='bold undp-typography'>
                            {interlinkage['Target Text']}
                          </p>
                          {interlinkage.Description.split('\n').map((d, j) => <p className='undp-typography' key={j}>{d}</p>)}
                          <div className='margin-top-09'>
                            <div style={{ backgroundColor: 'var(--white)' }}>
                              <div style={{
                                backgroundColor: interlinkage.LinkageType[0] === 'synergies' ? 'var(--dark-green)' : interlinkage.LinkageType[0] === 'tradeOffs' ? 'var(--dark-red)' : 'var(--gray-600)', color: 'var(--white)', fontWeight: 'bold', textAlign: 'center',
                              }}
                              >
                                {
                                  interlinkage.LinkageType[0] === 'synergies' ? 'Synergies' : interlinkage.LinkageType[0] === 'tradeOffs' ? 'Trade-Offs' : 'Not Specified'
                                }
                              </div>
                              <div style={{ padding: 'var(--spacing-05)' }}>
                                <InterlinkagesViz
                                  selectedTarget={`Target ${interlinkage.Target}`}
                                  linkageType={interlinkage.LinkageType[0]}
                                  data={targetStatus}
                                  linkageData={LinkageData2023 as LinkageDataType[]}
                                />
                              </div>
                            </div>
                          </div>
                          <div className='margin-top-09'>
                            <div style={{ backgroundColor: 'var(--white)' }}>
                              <div style={{
                                backgroundColor: interlinkage.LinkageType[1] === 'synergies' ? 'var(--dark-green)' : interlinkage.LinkageType[1] === 'tradeOffs' ? 'var(--dark-red)' : 'var(--gray-600)', color: 'var(--white)', fontWeight: 'bold', textAlign: 'center',
                              }}
                              >
                                {
                                  interlinkage.LinkageType[1] === 'synergies' ? 'Synergies' : interlinkage.LinkageType[1] === 'tradeOffs' ? 'Trade-Offs' : 'Not Specified'
                                }
                              </div>
                              <div style={{ padding: 'var(--spacing-05)' }}>
                                <InterlinkagesViz
                                  selectedTarget={`Target ${interlinkage.Target}`}
                                  linkageType={interlinkage.LinkageType[1]}
                                  data={targetStatus}
                                  linkageData={LinkageData2023 as LinkageDataType[]}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    }))}
                />
              </div>
            )}
            color='var(--black)'
            background='var(--gray-200)'
          />
          <SectionDiv
            sectionNo={5}
            sectionTitle='Futures'
            contentDiv={(
              <div>
                <p className='undp-typography'>
                  The &apos;SDG Push&apos; is a futures scenario based on 48 integrated accelerators in the areas of Governance, Social Protection, Green Economy and Digital Disruption. It uses national data to explore the impact on human development in 2030 and to 2050 across key SDG indicators.
                </p>
                <p className='undp-typography'>
                  Incorporating &apos;SDG Push&apos; accelerators into development interventions in
                  {' '}
                  {countryFullName}
                  {' '}
                  can reduce the number of people living in poverty over time.
                </p>
                {
                  scenarioData ? (
                    <>
                      <div className='margin-top-09 margin-bottom-09'>
                        <div className='undp-table-head'>
                          <div style={{ width: 'calc(50% - 2rem)', color: 'var(--black)', padding: '1rem' }} className='undp-table-head-cell undp-sticky-head-column'>
                            People living in poverty
                          </div>
                          <div style={{ width: 'calc(25% - 2rem)', color: 'var(--black)', padding: '1rem' }} className='undp-table-head-cell undp-sticky-head-column align-right'>
                            By 2030
                          </div>
                          <div style={{ width: 'calc(25% - 2rem)', color: 'var(--black)', padding: '1rem' }} className='undp-table-head-cell undp-sticky-head-column align-right'>
                            by 2050
                          </div>
                        </div>
                        <div className='undp-table-row' style={{ backgroundColor: 'transparent', color: 'var(--white)' }}>
                          <div
                            style={{
                              width: 'calc(50% - 2rem)', padding: '1rem', backgroundColor: 'transparent', color: 'var(--white)',
                            }}
                            className='undp-table-row-cell'
                          >
                            Without SDG Push
                          </div>
                          <div
                            style={{
                              width: 'calc(25% - 2rem)', padding: '1rem', backgroundColor: 'transparent', color: 'var(--white)',
                            }}
                            className='undp-table-row-cell align-right'
                          >
                            {format('~s')(scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'COVID Baseline' scenario")[0].data[scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'COVID Baseline' scenario")[0].data.findIndex((d) => d.year === 2030)].value).replace('G', 'B')}
                          </div>
                          <div
                            style={{
                              width: 'calc(25% - 2rem)', padding: '1rem', backgroundColor: 'transparent', color: 'var(--white)',
                            }}
                            className='undp-table-row-cell align-right'
                          >
                            {format('~s')(scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'COVID Baseline' scenario")[0].data[scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'COVID Baseline' scenario")[0].data.findIndex((d) => d.year === 2050)].value).replace('G', 'B')}
                          </div>
                        </div>
                        <div className='undp-table-row' style={{ backgroundColor: 'transparent', color: 'var(--white)' }}>
                          <div
                            style={{
                              width: 'calc(50% - 2rem)', padding: '1rem', backgroundColor: 'transparent', color: 'var(--white)',
                            }}
                            className='undp-table-row-cell'
                          >
                            With SDG Push
                          </div>
                          <div
                            style={{
                              width: 'calc(25% - 2rem)', padding: '1rem', backgroundColor: 'transparent', color: 'var(--white)',
                            }}
                            className='undp-table-row-cell align-right'
                          >
                            {format('~s')(scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'SDG Push' scenario")[0].data[scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'SDG Push' scenario")[0].data.findIndex((d) => d.year === 2030)].value).replace('G', 'B')}
                          </div>
                          <div
                            style={{
                              width: 'calc(25% - 2rem)', padding: '1rem', backgroundColor: 'transparent', color: 'var(--white)',
                            }}
                            className='undp-table-row-cell align-right'
                          >
                            {format('~s')(scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'SDG Push' scenario")[0].data[scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)' && series.scenario === "'SDG Push' scenario")[0].data.findIndex((d) => d.year === 2050)].value).replace('G', 'B')}
                          </div>
                        </div>
                      </div>
                      <LineChart data={scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)')} />
                    </>
                  ) : <div className='undp-loader' style={{ margin: 'auto' }} />
                }
              </div>
            )}
            color='var(--white)'
            background='var(--blue-600)'
          />
          <SectionDiv
            sectionNo={6}
            sectionTitle='Fiscal'
            contentDiv={(
              <div>
                <div>
                  {reportData.Fiscal.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                </div>
                <div style={{
                  padding: '2rem',
                  backgroundColor: UNDPColorModule.graphBackgroundColor,
                }}
                >
                  <FiscalGraph countryCode={countryCode} />
                </div>
              </div>
            )}
            color='var(--black)'
            background='var(--white)'
          />
          <SectionDiv
            sectionNo={7}
            sectionTitle='SDG Stimulus'
            contentDiv={(
              <>
                <p className='undp-typography'>
                  Countries are facing reduced fiscal space and high debt levels, rising interest rates, and increasing exposure to climate-related shocks. The acceleration pathways here identified need the appropriate means of implementation to move from aspiration to reality. The
                  {' '}
                  <a href='https://www.un.org/sustainabledevelopment/wp-content/uploads/2023/02/SDG-Stimulus-to-Deliver-Agenda-2030.pdf' target='_blank' className='undp-style' rel='noreferrer'>SG’s SDG Stimulus plan</a>
                  {' '}
                  lays out a blueprint to provide the means to implement them through four key actions:
                </p>
                <ul>
                  <li>
                    Provide liquidity to support recovery in the near term.
                  </li>
                  <li>
                    Enhance debt relief for vulnerable countries.
                  </li>
                  <li>
                    Better leverage lending
                  </li>
                  <li>
                    Align financial flows with the SDGs and Paris Agreement, according to country-level priorities and needs, for example through the rollout of the UN INFFs
                  </li>
                </ul>
                <div>
                  {reportData.SDGStimulus.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                </div>
                {
                  reportData.SDGStimulusBulletPoints ? (
                    <ul>
                      {reportData.SDGStimulusBulletPoints.split('\n').map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  ) : null
                }
              </>
            )}
            color='var(--black)'
            background='var(--gray-200)'
          />
        </>
      )
        : error ? <h3 className='undp-typography'>There is some error loading data. Please refresh the page or try again later</h3> : (
          <div style={{
            height: '200px', backgroundColor: 'var(--gray-100)', paddingTop: '80px',
          }}
          >
            <div className='undp-loader' style={{ margin: 'auto' }} />
          </div>
        )}
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
