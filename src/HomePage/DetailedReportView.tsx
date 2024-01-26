/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
import { Tabs } from 'antd';
import { queue } from 'd3-queue';
import { json } from 'd3-request';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { NavLink } from 'react-router-dom';
import IMAGES from '../img/images';
import {
  DetailedReportDataType,
  GoalStatusType,
  LinkageDataType,
  ScenarioDataType,
  TargetStatusType,
  TargetStatusWithDetailsType,
} from '../Types';
import { SectionCard } from './ReportComponents/SectionCard';
import { SectionDiv } from './ReportComponents/SectionDiv';
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
  reportData: DetailedReportDataType;
}

interface ScrollButtonProps {
  bottomMargin: string;
  disabled: boolean;
}

const ScrollButton = styled.div<ScrollButtonProps>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 2rem;
  background-color: var(--gray-400);
  position: fixed;
  right: 1rem;
  bottom: ${(props) => props.bottomMargin};
  z-index: 6;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  &:hover {
    background-color: var(--gray-500);
  }
`;

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const DetailedReportView = (props: Props) => {
  const {
    countryCode,
    targetStatuses,
    countryFullName,
    reportData,
    goalStatuses,
  } = props;
  const [scenarioData, setScenarioData] = useState<ScenarioDataType[] | undefined>(undefined);
  const [sectionNo, setSectionNo] = useState(0);
  const [priorityData, setPriorityData] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<TargetStatusWithDetailsType[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('0');
  const [error, setError] = useState<string | undefined>(undefined);
  const WrapperRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(
    'url(https://design.undp.org/static/media/arrow-right.125a0586.svg)',
  );
  useEffect(() => {
    setError(undefined);
    setPriorityData(null);
    queue()
      .defer(json, `${DATASOURCELINK}/PrioritiesData/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/ScenarioData/${countryCode}.json`)
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
            <br />
            {countryFullName}
          </h1>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section padding-top-13 padding-bottom-13'>
        <div
          className='max-width flex-div flex-wrap flex-space-around'
          style={{
            maxWidth: '100rem', margin: 'auto', justifyContent: 'space-between', padding: '0 var(--spacing-05)', gap: '4rem',
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
          className='margin-top-07 flex-div flex-wrap'
          style={{
            maxWidth: '100rem', margin: 'auto', gap: '1rem', padding: '0 var(--spacing-05)',
          }}
        >
          <SectionCard id='section1' cardTitle='SDG Moment' cardDescription='Sets the stage by considering economic growth as a catalyst for the SDG agenda.' cardIcon={IMAGES.iconSnapshot} />
          <SectionCard id='section2' cardTitle='SDG Trends' cardDescription="Leveraging UNDP's Data Futures Exchange's infrastructure with official UN statistics as the baseline data, member states can contribute data to generate meaningful insights." cardIcon={IMAGES.iconTrends} />
          <SectionCard id='section3' cardTitle='National Priorities' cardDescription='Utilizing custom-built machine learning, the report analyzes multiple reports and synthesizes the most significant national priorities.' cardIcon={IMAGES.iconPriorities} />
          <SectionCard id='section4' cardTitle='Interlinkages' cardDescription='Through data visualization, this section connects national priorities to the most relevant SDG targets and maps interconnections, aiding countries in considering various pathways.' cardIcon={IMAGES.iconInterlinkages} />
          <SectionCard id='section5' cardTitle='Futures' cardDescription="This section generates 'SDG Futures' using modeling analysis to demonstrate how UNDP's flagship report on SDG Push can enhance medium-term development trajectories." cardIcon={IMAGES.iconFutures} />
          <SectionCard id='section6' cardTitle='Fiscal/financial constraints' cardDescription="National insights via a dashboard that reflects a country's position in terms of both slow-moving indicators (debt-to-GDP ratios) and fast-moving indicators of fiscal/financial stress (bond spreads and credit ratings downgrades)." cardIcon={IMAGES.iconConstraints} />
          <SectionCard id='section7' cardTitle='SDG Stimulus' cardDescription='SDG Stimulus plan lays out a blueprint to provide the means to implement them through four key actions.' cardIcon={IMAGES.iconConstraints} />
        </div>
      </div>
      {reportData && priorityData && targetStatus && !error ? (
        <>
          <SectionDiv
            setSectionNo={setSectionNo}
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
                  <div className='flex-div flex-wrap gap-07 margin-top-09 margin-bottom-09'>
                    <div style={{ width: 'calc(33.33% - 1rem)', flexGrow: 1 }}>
                      {reportData.SDGMomentGDP.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                    </div>
                    <div style={{ width: 'calc(66.67% - 1rem)', flexGrow: 1, minWidth: '20rem' }}>
                      <GDPGraph countryCode={countryCode} />
                    </div>
                  </div>
                </div>
                {reportData.SDGMomentPeoplePlanet.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                <div className='flex-div flex-wrap gap-07 margin-bottom-09' style={{ alignItems: 'stretch' }}>
                  <PeopleGraph countryCode={countryCode} />
                  <PlanetGraph countryCode={countryCode} />
                </div>
                {reportData.SDGMomentConclusion.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                {
                  reportData.SDGMomentSubtext ? (
                    <ol style={{ paddingLeft: '1rem' }} className='margin-top-09'>
                      {reportData.SDGMomentSubtext.split('\n').map((d, i) => <li className='undp-typography small-font italics' key={i}>{d}</li>)}
                    </ol>
                  ) : null
                }
              </div>
            )}
            color='var(--white)'
            background='var(--blue-600)'
          />
          <SectionDiv
            setSectionNo={setSectionNo}
            sectionNo={2}
            sectionTitle='SDG Trends'
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
                  <NavLink
                    to={`../../${countryCode}/sdg-trends`}
                    style={{ color: 'var(--white)', textDecoration: 'none', flexShrink: 0 }}
                  >
                    <button type='button' className='undp-button button-primary button-arrow' style={{ color: 'var(--white)' }}>
                      Explore SDG Trends
                    </button>
                  </NavLink>
                </div>
                <div style={{ flexGrow: 1, width: 'calc(50% - 1rem)', minWidth: '22.5rem' }}>
                  <SDGTargetsGapVisualization width='100%' targetStatuses={targetStatuses} />
                </div>
              </div>
            )}
            color='var(--black)'
            background='var(--gray-200)'
          />
          <SectionDiv
            setSectionNo={setSectionNo}
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
                <div style={{ margin: 'var(--spacing-07) 0 0 var(--spacing-05)' }}>
                  <NavLink
                    to={`../../${countryCode}/current-priorities`}
                    style={{ color: 'var(--white)', textDecoration: 'none', flexShrink: 0 }}
                  >
                    <button type='button' className='undp-button button-primary button-arrow margin-top-07' style={{ color: 'var(--white)', marginLeft: '1rem' }}>
                      Explore Priorities
                    </button>
                  </NavLink>
                </div>
              </div>
            )}
            color='var(--black)'
            background='var(--white)'
          />
          <SectionDiv
            setSectionNo={setSectionNo}
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
                <ul>
                  {reportData.InterlinkageBulletPoints.split('\n').map((d, i) => <li key={i}>{d}</li>)}
                </ul>
                <img src={IMAGES.interlinkageImage} alt='Interlinkage' className='margin-bottom-09 margin-top-05 flex-div' style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%' }} />
                <Tabs
                  activeKey={activeTab}
                  className='undp-tabs'
                  onChange={(d) => { setActiveTab(d); }}
                  items={reportData.Interlinkages.map((interlinkage, i) => (
                    {
                      label: `Target ${interlinkage.Target}`,
                      key: `${i}`,
                      children: (
                        <div key={`${i}`}>
                          <p className='bold undp-typography'>
                            {interlinkage['Target Text']}
                          </p>
                          {interlinkage.Description.split('\n').map((d, j) => <p className='undp-typography' key={j}>{d}</p>)}

                          <div
                            style={{
                              cursor: `${cursor}, auto`,
                            }}
                            onClick={(e) => {
                              if (WrapperRef.current) {
                                if (e.clientX > window.innerWidth / 2) { WrapperRef.current.scrollBy(50, 0); } else WrapperRef.current.scrollBy(-50, 0);
                              }
                            }}
                            onMouseMove={(e) => {
                              if (e.clientX > window.innerWidth / 2) {
                                setCursor(
                                  'url(https://design.undp.org/static/media/arrow-right.125a0586.svg)',
                                );
                              } else {
                                setCursor(
                                  'url(https://design.undp.org/static/media/arrow-left.14de54ea.svg)',
                                );
                              }
                            }}
                          >
                            <div
                              ref={WrapperRef}
                              className='flex-div undp-scrollbar top-scrollbars'
                              style={{
                                gap: '2rem',
                                overflow: 'auto',
                                paddingBottom: '0.5rem',
                                scrollSnapType: 'x mandatory',
                                scrollPadding: '0',
                                scrollPaddingLeft: '0',
                              }}
                            >
                              <div
                                className='margin-top-09'
                                style={{
                                  width: '95%',
                                  flexShrink: 0,
                                  minWidth: '20rem',
                                  maxWidth: '75rem',
                                  backgroundColor: 'var(--gray-100)',
                                  scrollSnapAlign: 'start',
                                }}
                              >
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
                              <div
                                className='margin-top-09'
                                style={{
                                  width: '95%',
                                  flexShrink: 0,
                                  minWidth: '20rem',
                                  maxWidth: '75rem',
                                  backgroundColor: 'var(--gray-100)',
                                  scrollSnapAlign: 'start',
                                }}
                              >
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
                          </div>
                        </div>
                      ),
                    }))}
                />
                <div style={{ margin: 'var(--spacing-09) 0 0 0' }}>
                  <NavLink
                    to={`../../${countryCode}/synergies-and-tradeoffs`}
                    style={{ color: 'var(--white)', textDecoration: 'none', flexShrink: 0 }}
                  >
                    <button type='button' className='undp-button button-primary button-arrow' style={{ color: 'var(--white)' }}>
                      Explore All Interlinkages
                    </button>
                  </NavLink>
                </div>
              </div>
            )}
            color='var(--black)'
            background='var(--gray-200)'
          />
          <SectionDiv
            setSectionNo={setSectionNo}
            sectionNo={5}
            sectionTitle='Futures'
            contentDiv={(
              <div className='flex-div flex-wrap gap-07'>
                <div style={{ width: 'calc(33.33% - 1rem)', flexGrow: 1 }}>
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
                  <div style={{ margin: 'var(--spacing-09) 0 0 0' }}>
                    <NavLink
                      to={`../../${countryCode}/future-scenarios`}
                      style={{ color: 'var(--white)', textDecoration: 'none', flexShrink: 0 }}
                    >
                      <button type='button' className='undp-button button-primary button-arrow' style={{ color: 'var(--white)' }}>
                        Explore Future Scenarios
                      </button>
                    </NavLink>
                  </div>
                </div>
                <div style={{ width: 'calc(66.67% - 1rem)', flexGrow: 1, minWidth: '20rem' }}>
                  {
                    scenarioData ? (
                      <LineChart data={scenarioData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)')} />

                    ) : <div className='undp-loader' style={{ margin: 'auto' }} />
                  }
                </div>
              </div>
            )}
            color='var(--white)'
            background='var(--blue-600)'
          />
          <SectionDiv
            setSectionNo={setSectionNo}
            sectionNo={6}
            sectionTitle='Fiscal'
            contentDiv={(
              <div className='flex-div flex-wrap gap-07'>
                <div style={{ width: 'calc(33.33% - 1rem)', flexGrow: 1 }}>
                  {reportData.Fiscal.split('\n').map((d, i) => <p className='undp-typography' key={i}>{d}</p>)}
                </div>
                <div style={{
                  padding: '2rem',
                  width: 'calc(66.67% - 5rem)',
                  flexGrow: 1,
                  minWidth: '20rem',
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
            setSectionNo={setSectionNo}
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
      <ScrollButton
        bottomMargin='4rem'
        onClick={(e) => {
          e.preventDefault();
          if (sectionNo > 1) { window.location.href = `#section${sectionNo - 1}`; }
        }}
        disabled={sectionNo < 2}
      >
        <img
          src='https://design.undp.org/icons/chevron-up.svg'
          alt='down-up'
          style={{
            width: '1.5rem',
            marginLeft: '9px',
            marginTop: '12px',
          }}
        />
      </ScrollButton>
      <ScrollButton
        bottomMargin='1rem'
        disabled={sectionNo > 6}
        onClick={(e) => {
          e.preventDefault();
          if (sectionNo < 7) { window.location.href = `#section${sectionNo + 1}`; }
        }}
      >
        <img
          src='https://design.undp.org/icons/chevron-down.svg'
          alt='down-arrow'
          style={{
            width: '1.5rem',
            marginLeft: '9px',
            marginTop: '15px',
          }}
        />
      </ScrollButton>
    </>
  );
};
