/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import {
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import {
  SDGGOALS, SDG_COLOR_ARRAY,
} from '../Constants';
import { GoalStatusType } from '../Types';
import { SalienceGraph } from './SalienceGraph';
import { BubbleChart } from './BubbleChart';

interface Props {
  data: any;
  goalStatuses: GoalStatusType[];
  document: any;
  defaultDocs: boolean;
}

interface SDGHoveredProps {
  sdg: number;
  xPosition: number;
  yPosition: number;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 1000;
  font-size: 1rem;
  background-color: var(--gray-300);
  word-wrap: break-word;
  top: ${(props) => props.y - 17}px;
  left: ${(props) => props.x}px;
  transform: translate(-50%, -100%);
  padding: 1rem;
`;

interface WidthProps {
  width: string;
}

const GraphContainer = styled.div<WidthProps>`
  width: ${(props) => props.width};
  @media (max-width: 720px) {
    width: 100%;
  }
`;

const FileNameChip = styled.div`
  font-size: 1rem;
  padding: 0.5rem;
  background-color: var(--gray-300);
  font-weight: bold;
`;

export const VNRAnalysis = (props: Props) => {
  const {
    data,
    document,
    goalStatuses,
    defaultDocs,
  } = props;
  const [selectedSDG, setSelectedSDG] = useState<any>(null);
  const [hoveredSDG, setHoveredSDG] = useState<null | SDGHoveredProps>(null);
  const [nodeData, setNodeData] = useState<any>(null);
  const [showSalienceGraph, setShowSalienceGraph] = useState(false);
  const dataWithStatuses = data.map((d: any) => ({ ...d, category: d.importance === 0 ? 'No Mention' : d.category.charAt(0).toUpperCase() + d.category.slice(1), status: goalStatuses[goalStatuses.findIndex((el) => el.goal === d.sdg)].status || 'Gaps NA' }));
  const gridSize = 600;
  const margin = 20;
  const cellSize = (gridSize - margin) / 4;
  const nodeRadius = 15;
  const statusArray = ['Identified Gap', 'For Review', 'On Track', 'Gaps NA'];
  const priorityArray = ['High', 'Medium', 'Low', 'No Mention'];
  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(dataWithStatuses));
    forceSimulation(dataTemp)
      .force('charge', forceManyBody().strength(2.25))
      .force('y', forceX().strength(1).x((d: any) => (priorityArray.indexOf(d.category) * cellSize + (cellSize / 2))))
      .force('x', forceY().strength(1).y((d: any) => (statusArray.indexOf(d.status) * cellSize + (cellSize / 2))))
      .force('collision', forceCollide().radius(nodeRadius + 1))
      .tick(100)
      .on('end', () => { setNodeData(dataTemp); });
  }, [document]);
  return (
    <>
      <div className=' margin-top-00' style={{ padding: 'var(--spacing-13)', paddingBottom: 'var(--spacing-09)' }}>
        <div className='max-width-1440'>
          <div className='flex-div flex-vert-align-center flex-wrap'>
            <h2 className='undp-typography margin-bottom-00'>
              National Priorities Based on
            </h2>
            {defaultDocs ? (
              <>
                {document.map((d: any, i: number) => (d.link ? <FileNameChip key={i}><a href={d.link} target='_blank' rel='noreferrer' className='undp-style'>{d.name}</a></FileNameChip> : <FileNameChip key={i}>{d.name}</FileNameChip>))}
              </>
            ) : document.map((d: any, i: number) => <FileNameChip key={i}>{d}</FileNameChip>)}

          </div>
          <BubbleChart data={dataWithStatuses} setSelectedSDG={setSelectedSDG} />
        </div>
      </div>
      <div className=' margin-top-13 max-width-1440 flex-div margin-bottom-13' style={{ gap: '2rem', padding: '0 1rem' }}>
        <div className='flex-div margin-top-07 flex-wrap' style={{ gap: '2rem', width: '100%' }}>
          <GraphContainer width='calc(50% - 1rem)'>
            {
              nodeData
                ? (
                  <svg width='calc(100% - 20px)' viewBox={`0 0 ${gridSize + 1} ${gridSize + 1}`}>
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
                          style={{ fill: `${d === 'High' ? 'var(--blue-700)' : d === 'Medium' ? 'var(--blue-400)' : d === 'Low' ? 'var(--blue-200)' : 'var(--gray-400)'}` }}
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
                            style={{ fill: `${d === 'Identified Gap' ? 'var(--dark-red)' : d === 'On Track' ? 'var(--dark-green)' : d === 'For Review' ? 'var(--dark-yellow)' : 'var(--gray-500)'}` }}
                          >
                            {d === 'Identified Gap' ? 'OFF TRACK' : d === 'Gaps NA' ? 'TREND NA' : d.toUpperCase()}
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
                            onMouseEnter={(event) => {
                              setHoveredSDG({
                                sdg: d.sdg,
                                xPosition: event.clientX,
                                yPosition: event.clientY,
                              });
                            }}
                            onMouseLeave={() => { setHoveredSDG(null); }}
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
          <GraphContainer width='calc(50% - 1rem)'>
            <div className='flex-div flex-vert-align-center flex-wrap margin-bottom-07'>
              <h2 className='undp-typography margin-bottom-00'>
                Comparing SDG trends and SDG national priorities based on
              </h2>
              {defaultDocs ? (
                <>
                  {document.map((d: any, i: number) => (d.link ? <FileNameChip key={i}><a href={d.link} target='_blank' rel='noreferrer' className='undp-style'>{d.name}</a></FileNameChip> : <FileNameChip key={i}>{d.name}</FileNameChip>))}
                </>
              ) : document.map((d: any, i: number) => <FileNameChip key={i}>{d}</FileNameChip>)}
            </div>
            <p className='undp-typography'>
              This matrix maps the SDGs along two parameters
              <br />
              1. Their current trend status and
              <br />
              2. Their prominence referenced in documents
              <br />
              <br />
              Understanding which SDGs are off-track but potentially a low priority can provide an insightful starting point for national dialogues.
              <br />
              <br />
              <span className='italics small-font'>
                Disclaimer: The national priorities identified in the documents may not reflect the actual and complete priorities of the government. They are a starting point for further discussion. The SDG Trends assessment is based on currently available data in the
                {' '}
                <a href='https://unstats.un.org/sdgs/dataportal' className='undp-style' target='_blank' rel='noreferrer'>UN Stats SDG Data Portal</a>
                {' '}
                and methodology as per the
                {' '}
                <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' className='undp-style' target='_blank' rel='noreferrer'>SDG Progress Chart 2022 Technical Note</a>
                .
                Additional data may be added to address gaps at government request, to provide a comprehensive landscape for identification of SDG policy pathways.
              </span>
            </p>
          </GraphContainer>
        </div>
      </div>
      {
        showSalienceGraph
          ? (
            <SalienceGraph
              data={data}
              goalStatuses={goalStatuses}
            />
          ) : null
      }
      <div className='max-width-1440 margin-bottom-13' style={{ padding: '0 1rem' }}>
        <button type='button' className='undp-button button-primary' onClick={() => { setShowSalienceGraph(!showSalienceGraph); }}>{showSalienceGraph ? 'Hide details' : 'Explore in detail '}</button>
      </div>
      {
        hoveredSDG ? (
          <TooltipEl x={hoveredSDG.xPosition} y={hoveredSDG.yPosition}>
            <h6 className='undp-typography margin-bottom-01'>
              SDG
              {' '}
              {hoveredSDG.sdg}
            </h6>
            <p className='undp-typography margin-bottom-00'>{SDGGOALS[hoveredSDG.sdg - 1].split(': ')[1]}</p>
          </TooltipEl>
        ) : null
      }
      {
        selectedSDG
          ? (
            <Modal
              className='undp-modal'
              onCancel={() => { setSelectedSDG(null); }}
              onOk={() => { setSelectedSDG(null); }}
              title={selectedSDG ? `Most common words/phrases for SDG ${selectedSDG.sdg}` : ''}
              open={selectedSDG !== null}
            >
              <div className='flex-div flex-wrap margin-top-09' style={{ width: '0.75vw', minWidth: '40rem', maxWidth: '60rem' }}>
                {
                  selectedSDG.features.length > 0
                    ? selectedSDG.features.map((d: any, i: number) => <div key={i} className='undp-chip'>{d}</div>)
                    : 'No words/phrases available'
                }
              </div>
            </Modal>
          ) : null
      }
    </>
  );
};
