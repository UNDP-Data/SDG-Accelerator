/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import sortBy from 'lodash.sortby';
import { json } from 'd3-request';
import {
  GoalStatusType, LanguageList, LinkageDataType, ScenarioDataType, TargetStatusWithDetailsType,
} from '../Types';

import '../style/tabStyle.css';
import '../style/selectStyle.css';
import '../style/modalStyle.css';
import '../style/radioStyle.css';
import { describeArc } from '../utils/getArc';
import { getSDGIcon } from '../utils/getSDGIcon';
import { DATASOURCELINK, SDG_COLOR_ARRAY, SDG_ICON_SIZE } from '../Constants';
import { MyDocument } from './Report';
import { InterlinkagesViz } from './InterlinkageVizForPdf';
import { LineChart } from './LineChartForPDF';

const LinkageData:LinkageDataType[] = require('../Data/linkages.json');

interface Props {
  docName: string[];
  nodeData: any;
  data: any;
  countryFullName: string;
  countrySelected: string;
  selectedTarget?: string;
  dataWithStatuses: any;
  sdgForInterlinkage: any;
  goalStatuses: GoalStatusType[];
  targetStatus: TargetStatusWithDetailsType[];
  generatePDFClicked: boolean;
  language: LanguageList;
}
interface WidthProps {
  width: string;
}

const GraphContainer = styled.div<WidthProps>`
  width: ${(props) => props.width};
`;

export const ReportEl = (props: Props) => {
  const {
    docName,
    nodeData,
    data,
    countryFullName,
    countrySelected,
    selectedTarget,
    dataWithStatuses,
    sdgForInterlinkage,
    goalStatuses,
    targetStatus,
    generatePDFClicked,
    language,
  } = props;

  const gapDiv = useRef<HTMLDivElement>(null);
  const prioritiesDiv = useRef<HTMLDivElement>(null);
  const gapPrioritiesMatrixDiv = useRef<HTMLDivElement>(null);
  const interlinkagesDiv = useRef<HTMLDivElement>(null);
  const gapPrioritiesMatrixSvg = useRef<SVGSVGElement>(null);
  const futureScenarioDiv = useRef<HTMLDivElement>(null);

  const onTrack = sortBy(goalStatuses.filter((d) => d.status === 'On Track'), 'goal');
  const identifiedGap = sortBy(goalStatuses.filter((d) => d.status === 'Identified Gap'), 'goal');
  const forReview = sortBy(goalStatuses.filter((d) => d.status === 'For Review'), 'goal');
  const gapsNA = sortBy(goalStatuses.filter((d) => !d.status), 'goal');

  const gridSize = 600;
  const margin = 20;
  const cellSize = (gridSize - margin) / 4;
  const nodeRadius = 15;
  const statusArray = ['Identified Gap', 'For Review', 'On Track', 'Gaps NA'];
  const priorityArray = ['High', 'Medium', 'Low', 'No Mention'];
  const [fsData, setFSData] = useState<undefined | ScenarioDataType[]>(undefined);
  useEffect(() => {
    json(`${DATASOURCELINK}/data/ScenarioData/${countrySelected}.json`, (err: any, d: ScenarioDataType[]) => {
      if (err) throw err;
      setFSData(d);
    });
  }, [countrySelected]);
  return (
    <div>
      {
        gapDiv && prioritiesDiv && gapPrioritiesMatrixDiv && gapPrioritiesMatrixSvg && nodeData && interlinkagesDiv && futureScenarioDiv && sdgForInterlinkage && selectedTarget
          ? (
            <PDFDownloadLink
              document={(
                <MyDocument
                  countryName={countryFullName}
                  gapDiv={gapDiv.current as HTMLDivElement}
                  prioritiesDiv={prioritiesDiv.current as HTMLDivElement}
                  gapPrioritiesMatrixDiv={gapPrioritiesMatrixDiv.current as HTMLDivElement}
                  interlinkagesDiv={interlinkagesDiv.current as HTMLDivElement}
                  futureScenarioDiv={futureScenarioDiv.current as HTMLDivElement}
                  dataWithStatus={dataWithStatuses}
                  sdgForInterlinkage={sdgForInterlinkage}
                  selectedTarget={selectedTarget}
                  docName={docName}
                  language={language}
                />
              )}
              fileName={`${countrySelected}_Summary.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({
                url,
              }) => (!url
                ? (
                  <div style={{
                    width: '100%', marginTop: 'var(--spacing-07)', height: '250px', backgroundColor: 'var(--gray-200)', paddingTop: '50px',
                  }}
                  >
                    <div className='undp-loader' style={{ margin: 'auto' }} />
                    <h6 className='undp-typography margin-top-05' style={{ textAlign: 'center' }}>Loading PDF... Please wait it might take some time</h6>
                  </div>
                )
                : (
                  <div style={{
                    width: '100%', marginTop: 'var(--spacing-07)', height: '250px', backgroundColor: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  >
                    <button type='button' className='undp-button button-arrow button-primary'>Download Report</button>
                  </div>
                ))}
            </PDFDownloadLink>
          ) : (
            <>
              {
                generatePDFClicked
                  ? (
                    <div style={{
                      width: '100%', height: '250px', marginTop: 'var(--spacing-07)', backgroundColor: 'var(--gray-200)', paddingTop: '50px',
                    }}
                    >
                      <div className='undp-loader' style={{ margin: 'auto' }} />
                      <h6 className='undp-typography margin-top-05' style={{ textAlign: 'center' }}>Generating PDF</h6>
                    </div>
                  ) : null
              }
            </>
          )
      }
      <div style={{ height: '0', overflow: 'hidden' }}>
        <div className='max-width' style={{ padding: 'var(--spacing-09)', minWidth: '1372px' }} ref={gapDiv}>
          <div style={{ padding: 'var(--spacing-09)' }}>
            <h2 className='undp-typography'>Current Gaps</h2>
            <div className='flex-div margin-top-07 flex-wrap' style={{ gap: '2rem' }}>
              <GraphContainer width='calc(40% - 1rem)'>
                <svg
                  width='100%'
                  style={{
                    margin: '0 auto', display: 'flex', justifyContent: 'center',
                  }}
                  viewBox='0 0 360 360'
                >
                  <path
                    d={describeArc(180, 180, 140, 0, 360 * (onTrack.length / (17)))}
                    fill='none'
                    strokeWidth={50}
                    style={{ stroke: 'var(--dark-green)' }}
                  />
                  <path
                    d={describeArc(180, 180, 140, 360 * (onTrack.length / (17)), 360 * ((onTrack.length + forReview.length) / (17)))}
                    fill='none'
                    strokeWidth={50}
                    style={{ stroke: 'var(--dark-yellow)' }}
                  />
                  <path
                    d={describeArc(180, 180, 140, 360 * ((onTrack.length + forReview.length) / (17)), 360 * ((onTrack.length + forReview.length + identifiedGap.length) / 17))}
                    fill='none'
                    strokeWidth={50}
                    style={{ stroke: 'var(--dark-red)' }}
                  />
                  <path
                    d={describeArc(180, 180, 140, 360 * ((onTrack.length + forReview.length + identifiedGap.length) / 17), 360)}
                    fill='none'
                    strokeWidth={50}
                    style={{ stroke: 'var(--gray-600)' }}
                  />
                  <text
                    x={180}
                    y={180}
                    textAnchor='middle'
                    style={{ fontFamily: 'proxima-nova' }}
                    fontWeight='bold'
                    fontSize='60px'
                    dy={10}
                  >
                    {17}
                  </text>
                  <text
                    x={180}
                    y={180}
                    textAnchor='middle'
                    style={{ fontFamily: 'proxima-nova' }}
                    fontWeight='bold'
                    fontSize='20px'
                    dy={35}
                  >
                    SDGs
                  </text>
                </svg>
              </GraphContainer>
              <GraphContainer width='calc(60% - 1rem)'>
                <div className='margin-bottom-09'>
                  <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-green)' }}>
                    <span className='bold'>
                      {onTrack.length > 0 ? onTrack.length : 'No'}
                      {' '}
                      {onTrack.length > 1 ? 'SDGs' : 'SDG'}
                    </span>
                    {' '}
                    On Track
                  </h4>
                  <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>The country is on track to fulfil the SDG by 2030</p>
                  <div className='sdg-icon-group'>
                    <div className='sdg-icon-container'>
                      {
                        onTrack.map((d, i: number) => (
                          <div key={i}>
                            {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                <div className='margin-bottom-09'>
                  <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-yellow)' }}>
                    <span className='bold'>
                      {forReview.length > 0 ? forReview.length : 'No'}
                      {' '}
                      {forReview.length > 1 ? 'SDGs' : 'SDG'}
                    </span>
                    {' '}
                    For Review
                  </h4>
                  <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>With current progress the country will miss the SDG by 2030 by a small margin</p>
                  <div className='sdg-icon-group'>
                    <div className='sdg-icon-container'>
                      {
                        forReview.map((d, i: number) => (
                          <div key={i}>
                            {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                <div className='margin-bottom-09'>
                  <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-red)' }}>
                    <span className='bold'>
                      {identifiedGap.length}
                      {' '}
                      SDG
                    </span>
                    {' '}
                    Identified Gaps
                  </h4>
                  <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>With current progress the country will miss the SDG by 2030 by a large margin</p>
                  <div className='sdg-icon-group'>
                    <div className='sdg-icon-container'>
                      {
                        identifiedGap.map((d, i: number) => (
                          <div key={i}>
                            {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--gray-600)' }}>
                    <span className='bold'>
                      {gapsNA.length}
                      {' '}
                      SDG
                    </span>
                    {' '}
                    Gaps NA
                  </h4>
                  <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Country doesn’t have enough data to identify the progress of the SDG</p>
                  <div className='sdg-icon-group'>
                    <div className='sdg-icon-container'>
                      {
                        gapsNA.map((d, i: number) => (
                          <div key={i}>
                            {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </GraphContainer>
            </div>
          </div>
        </div>
        {
          data && dataWithStatuses
            ? (
              <>
                <div ref={prioritiesDiv} className='max-width margin-top-00' style={{ padding: 'var(--spacing-09)', minWidth: '1372px' }}>
                  <div className='max-width' style={{ padding: 'var(--spacing-09)' }}>
                    <h2 className='undp-typography'>
                      Current Priorities Based on
                      {' '}
                      {docName}
                    </h2>
                    <div className='flex-div margin-top-07 flex-wrap' style={{ gap: '2rem' }}>
                      <GraphContainer width='calc(40% - 1rem)'>
                        <svg width='calc(100% - 20px)' viewBox='0 0 360 360'>
                          <path
                            d={describeArc(180, 180, 140, 0, 360 * (data.filter((d: any) => d.category === 'high').length / (17)))}
                            fill='none'
                            strokeWidth={50}
                            style={{ stroke: 'var(--blue-700)' }}
                          />
                          <path
                            d={describeArc(180, 180, 140, 360 * (data.filter((d: any) => d.category === 'high').length / (17)), 360 * ((data.filter((d: any) => d.category === 'high').length + data.filter((d: any) => d.category === 'medium').length) / (17)))}
                            fill='none'
                            strokeWidth={50}
                            style={{ stroke: 'var(--blue-400)' }}
                          />
                          <path
                            d={describeArc(180, 180, 140, 360 * ((data.filter((d: any) => d.category === 'high').length + data.filter((d: any) => d.category === 'medium').length) / (17)), 360 * ((data.filter((d: any) => d.category === 'high').length + data.filter((d: any) => d.category === 'medium').length + data.filter((d: any) => d.category === 'low' && d.importance !== 0).length) / 17))}
                            fill='none'
                            strokeWidth={50}
                            style={{ stroke: 'var(--blue-200)' }}
                          />
                          <path
                            d={describeArc(180, 180, 140, 360 * ((data.filter((d: any) => d.category === 'high').length + data.filter((d: any) => d.category === 'medium').length + data.filter((d: any) => d.category === 'low' && d.importance !== 0).length) / 17), 360)}
                            fill='none'
                            strokeWidth={50}
                            style={{ stroke: 'var(--gray-400)' }}
                          />
                          <text
                            x={180}
                            y={180}
                            textAnchor='middle'
                            style={{ fontFamily: 'proxima-nova' }}
                            fontWeight='bold'
                            fontSize='60px'
                            dy={10}
                          >
                            {17}
                          </text>
                          <text
                            x={180}
                            y={180}
                            textAnchor='middle'
                            style={{ fontFamily: 'proxima-nova' }}
                            fontWeight='bold'
                            fontSize='20px'
                            dy={35}
                          >
                            SDGs
                          </text>
                        </svg>
                      </GraphContainer>
                      <GraphContainer width='calc(60% - 1rem)'>
                        <div className='margin-bottom-09'>
                          <h4 className='undp-typography margin-bottom-03' style={{ color: 'var(--blue-700)' }}>
                            <span className='bold'>
                              {data.filter((d: any) => d.category === 'high').length > 0 ? data.filter((d: any) => d.category === 'high').length : 'No'}
                              {' '}
                              {data.filter((d: any) => d.category === 'high').length > 1 ? 'SDGs' : 'SDG'}
                            </span>
                            {' '}
                            High Priority
                          </h4>
                          <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Click on the icons to see key features for the SDG</p>
                          <div className='sdg-icon-group'>
                            <div className='sdg-icon-container'>
                              {
                                data.filter((d: any) => d.category === 'high').map((d: any, i: number) => (
                                  <div key={i}>
                                    {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                                  </div>
                                ))
                            }
                            </div>
                          </div>
                        </div>
                        <div className='margin-bottom-09'>
                          <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--blue-400)' }}>
                            <span className='bold'>
                              {data.filter((d: any) => d.category === 'medium').length > 0 ? data.filter((d: any) => d.category === 'medium').length : 'No'}
                              {' '}
                              {data.filter((d: any) => d.category === 'medium').length > 1 ? 'SDGs' : 'SDG'}
                            </span>
                            {' '}
                            Medium Priority
                          </h4>
                          <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Click on the icons to see key features for the SDG</p>
                          <div className='sdg-icon-group'>
                            <div className='sdg-icon-container'>
                              {
                                data.filter((d: any) => d.category === 'medium').map((d: any, i: number) => (
                                  <div key={i}>
                                    {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                                  </div>
                                ))
                            }
                            </div>
                          </div>
                        </div>
                        <div className='margin-bottom-09'>
                          <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--blue-200)' }}>
                            <span className='bold'>
                              {data.filter((d: any) => d.category === 'low' && d.importance !== 0).length > 0 ? data.filter((d: any) => d.category === 'low' && d.importance !== 0).length : 'No'}
                              {' '}
                              {data.filter((d: any) => d.category === 'low' && d.importance !== 0).length > 1 ? 'SDGs' : 'SDG'}
                            </span>
                            {' '}
                            Low Priority
                          </h4>
                          <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Click on the icons to see key features for the SDG</p>
                          <div className='sdg-icon-group'>
                            <div className='sdg-icon-container'>
                              {
                                data.filter((d: any) => d.category === 'low' && d.importance !== 0).map((d: any, i: number) => (
                                  <div key={i}>
                                    {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                                  </div>
                                ))
                            }
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className='undp-typography margin-bottom-03' style={{ color: 'var(--gray-400)' }}>
                            <span className='bold'>
                              {data.filter((d: any) => d.importance === 0).length > 0 ? data.filter((d: any) => d.importance === 0).length : 'No'}
                              {' '}
                              {data.filter((d: any) => d.importance === 0).length > 1 ? 'SDGs' : 'SDG'}
                            </span>
                            {' '}
                            Not Mentioned
                          </h4>
                          <div className='sdg-icon-group'>
                            <div className='sdg-icon-container'>
                              {
                                data.filter((d: any) => d.importance === 0).map((d: any, i: number) => (
                                  <div key={i}>
                                    {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                                  </div>
                                ))
                            }
                            </div>
                          </div>
                        </div>
                      </GraphContainer>
                    </div>
                  </div>
                </div>
                <div ref={gapPrioritiesMatrixDiv} className='max-width flex-div' style={{ gap: '2rem', padding: 'var(--spacing-09)', minWidth: '1372px' }}>
                  <div className='flex-div margin-top-07 flex-wrap' style={{ gap: '2rem', width: '100%', padding: 'var(--spacing-09)' }}>
                    <GraphContainer width='100%'>
                      {
                        nodeData
                          ? (
                            <svg ref={gapPrioritiesMatrixSvg} width='calc(100% - 20px)' viewBox={`0 0 ${gridSize + 1} ${gridSize + 1}`}>
                              {
                                priorityArray.map((d, i) => (
                                  <text
                                    key={i}
                                    fontSize={14}
                                    dy={10}
                                    y={0}
                                    x={(i * cellSize) + margin + (cellSize / 2)}
                                    textAnchor='middle'
                                    fontWeight='bold'
                                    style={{ fontFamily: 'proxima-nova', fill: `${d === 'High' ? 'var(--blue-700)' : d === 'Medium' ? 'var(--blue-400)' : d === 'Low' ? 'var(--blue-200)' : 'var(--gray-400)'}` }}
                                  >
                                    { d === 'No Mention'.toUpperCase() ? d : `${d} Priority`.toUpperCase()}
                                  </text>
                                ))
                            }
                              {
                                statusArray.map((d, i) => (
                                  <g
                                    transform={`translate(0,${(i * cellSize) + margin + (cellSize / 2)})`}
                                    key={i}
                                  >
                                    <text
                                      fontSize={14}
                                      x={0}
                                      y={0}
                                      dy={14}
                                      transform='rotate(-90)'
                                      fontWeight='bold'
                                      textAnchor='middle'
                                      style={{ fontFamily: 'proxima-nova', fill: `${d === 'Identified Gap' ? 'var(--dark-red)' : d === 'On Track' ? 'var(--dark-green)' : d === 'For Review' ? 'var(--dark-yellow)' : 'var(--gray-500)'}` }}
                                    >
                                      {d.toUpperCase()}
                                    </text>
                                  </g>
                                ))
                            }
                              <g transform={`translate(${margin}, ${margin})`}>
                                <rect
                                  x={0}
                                  y={0}
                                  width={cellSize * 4}
                                  height={cellSize * 4}
                                  fillOpacity={0}
                                  stroke='#EDEFF0'
                                  strokeWidth={0.5}
                                />
                                <rect
                                  x={0}
                                  y={0}
                                  width={cellSize * 4}
                                  height={cellSize}
                                  fillOpacity={0.25}
                                  fill='#EDEFF0'
                                />
                                <rect
                                  y={cellSize * 2}
                                  x={0}
                                  width={cellSize * 4}
                                  height={cellSize}
                                  fillOpacity={0.25}
                                  fill='#EDEFF0'
                                />
                                <rect
                                  x={0}
                                  y={0}
                                  height={cellSize * 4}
                                  width={cellSize}
                                  fillOpacity={0.25}
                                  fill='#EDEFF0'
                                />
                                <rect
                                  x={cellSize * 2}
                                  y={0}
                                  height={cellSize * 4}
                                  width={cellSize}
                                  fillOpacity={0.25}
                                  fill='#EDEFF0'
                                />
                                {
                                priorityArray.map((_d, i) => (
                                  <g key={i}>
                                    {
                                        statusArray.map((_l, j) => (
                                          <rect
                                            key={j}
                                            x={i * cellSize}
                                            y={j * cellSize}
                                            width={cellSize}
                                            height={cellSize}
                                            fillOpacity={0}
                                            fill='#fff'
                                            stroke='#EDEFF0'
                                            strokeWidth={1}
                                          />
                                        ))
                                    }
                                  </g>
                                ))
                                }
                                <rect
                                  x={0}
                                  y={0}
                                  width={cellSize * 4}
                                  height={cellSize * 4}
                                  fillOpacity={0}
                                  stroke='#EDEFF0'
                                  strokeWidth={1}
                                />
                                {
                                nodeData.map((d: any, i: number) => (
                                  <g
                                    key={i}
                                    transform={`translate(${d.x},${d.y})`}
                                    style={{ cursor: 'default' }}
                                  >
                                    <circle
                                      cx={0}
                                      cy={0}
                                      r={nodeRadius}
                                      fill={SDG_COLOR_ARRAY[d.sdg - 1]}
                                    />
                                    <text
                                      fontSize={12}
                                      x={0}
                                      y={0}
                                      dy={3}
                                      textAnchor='middle'
                                      style={{ fontFamily: 'proxima-nova' }}
                                      fill='#fff'
                                    >
                                      {d.sdg}
                                    </text>
                                  </g>
                                ))
                                }
                              </g>
                            </svg>
                          )
                          : (
                            <div style={{
                              width: '100%', height: '780px', backgroundColor: 'var(--gray-100)', paddingTop: '360px',
                            }}
                            >
                              <div className='undp-loader' style={{ margin: 'auto' }} />
                            </div>
                          )
                      }
                    </GraphContainer>
                  </div>
                </div>
              </>
            )
            : null
        }
        {
          selectedTarget
            ? (
              <div ref={interlinkagesDiv} className='max-width' style={{ minWidth: '1372px' }}>
                <InterlinkagesViz
                  selectedTarget={selectedTarget}
                  data={targetStatus}
                  LinkageData={LinkageData}
                />
              </div>
            ) : null
        }
        {
          fsData
            ? (
              <div ref={futureScenarioDiv} className='max-width' style={{ minWidth: '1372px' }}>
                <LineChart data={fsData.filter((series) => series.indicator === 'Poverty <$1.90 per day (number of people)')} />
              </div>
            ) : null
        }
      </div>
    </div>
  );
};
