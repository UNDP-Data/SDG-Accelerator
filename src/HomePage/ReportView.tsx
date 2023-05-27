import { Tabs } from 'antd';
import { queue } from 'd3-queue';
import { json } from 'd3-request';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'd3-format';
import IMAGES from '../img/images';
import {
  GoalStatusType, LinkageDataType, ScenarioDataType, TargetStatusType, TargetStatusWithDetailsType, dataForReportType,
} from '../Types';
import { SectionCard } from './SectionCard';
import { SectionDiv } from './SectionDiv';
import { DATASOURCELINK } from '../Constants';
import { SDGGoalGapList } from '../CurrentGaps/SDGGoalGapList';
import { VNRAnalysis } from '../Priorities/VNRAnalysis';
import { InterlinkagesViz } from '../Interlinkages/InterlinkageViz';
import { LinkageData2023 } from '../Data/linkages';
import { SDGList } from '../Data/SDGGoalList';
import { LineChart } from '../FutureScenarios/LineChart';

interface Props {
  countryCode: string;
  goalStatuses: GoalStatusType[];
  targetStatuses: TargetStatusType[];
  // eslint-disable-next-line no-unused-vars
  setError: (_d?: string) => void;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const ReportView = (props: Props) => {
  const {
    countryCode, goalStatuses, targetStatuses, setError,
  } = props;
  const [reportData, setReportData] = useState<
    dataForReportType | undefined
  >(undefined);
  const [scenarioData, setScenarioData] = useState<ScenarioDataType[] | undefined>(undefined);
  const [priorityData, setPriorityData] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<TargetStatusWithDetailsType[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('0');
  useEffect(() => {
    setReportData(undefined);
    setError(undefined);
    setPriorityData(null);
    queue()
      .defer(json, `${DATASOURCELINK}/data/ReportPages/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/data/PrioritiesData/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/data/ScenarioData/${countryCode}.json`)
      .await(
        (
          err: any,
          data: dataForReportType,
          d: any,
          scenarioDataFromFile: ScenarioDataType[],
        ) => {
          if (err) { setError('Error loading files'); }
          setReportData(data);
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
          <SectionCard id='section1' cardTitle='Growth Pathways' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconSnapshot} />
          <SectionCard id='section2' cardTitle='SDG Trends' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconTrends} />
          <SectionCard id='section3' cardTitle='National Priorities' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconPriorities} />
          <SectionCard id='section4' cardTitle='Interlinkages' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconInterlinkages} />
          <SectionCard id='section5' cardTitle='Futures' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconFutures} />
          <SectionCard id='section6' cardTitle='Fiscal/financial constraints' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconConstraints} />
        </div>
      </div>
      {reportData && priorityData && targetStatus ? (
        <>
          <SectionDiv
            sectionNo={1}
            sectionTitle='Growth Pathways'
            contentDiv={(
              <div>
                {reportData['Growth Pathways'].split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
              </div>
            )}
            color='var(--white)'
            background='var(--blue-600)'
          />
          <SectionDiv
            sectionNo={2}
            sectionTitle='Trends'
            contentDiv={(
              <div>
                {reportData.Trends.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                <SDGGoalGapList goalStatuses={goalStatuses} />
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
                {reportData['National Priorities'].split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
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
                  SDG Interlinkages show how actions directed towards one SDG can influence the others. Uncovering and understanding these interactions helps achieving the 2030 Agenda, avoiding the unintended deterioration of any SDGs.
                </p>
                <p className='undp-typography'>
                  The following pages provide insights into the pathways with the most potential to accelerate the SDGs. Building from the national priorities analyzed for South Africa and most critical SDG gaps and enablers, the following section explores the SDG interlinkages of economic growth, income equality, renewable energy and a just transition, combined with effective institutions as key policy areas for acceleration.
                </p>
                <p className='undp-typography'>
                  Interlinkage analysis includes both synergies with positive multiplier effects and trade offs which can prevent effective policy implementation.
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
                                backgroundColor: 'var(--dark-green)', color: 'var(--white)', fontWeight: 'bold', textAlign: 'center',
                              }}
                              >
                                Synergies
                              </div>
                              <div style={{ padding: 'var(--spacing-05)' }}>
                                <InterlinkagesViz
                                  selectedTarget={`Target ${interlinkage.Target}`}
                                  linkageType='synergies'
                                  data={targetStatus}
                                  linkageData={LinkageData2023 as LinkageDataType[]}
                                />
                              </div>
                            </div>
                          </div>
                          <div className='margin-top-09'>
                            <div style={{ backgroundColor: 'var(--white)' }}>
                              <div style={{
                                backgroundColor: 'var(--dark-red)', color: 'var(--white)', fontWeight: 'bold', textAlign: 'center',
                              }}
                              >
                                Trade-Offs
                              </div>
                              <div style={{ padding: 'var(--spacing-05)' }}>
                                <InterlinkagesViz
                                  selectedTarget={`Target ${interlinkage.Target}`}
                                  linkageType='tradeOffs'
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
                {reportData.Futures.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
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
                {reportData.Fiscal.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
              </div>
            )}
            color='var(--black)'
            background='var(--white)'
          />
        </>
      )
        : (
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
