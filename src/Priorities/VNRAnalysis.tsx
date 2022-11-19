/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import {
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import { SDGGOALS, SDG_COLOR_ARRAY, SDG_ICON_SIZE } from '../Constants';
import { getSDGIcon } from '../utils/getSDGIcon';
import { describeArc } from '../utils/getArc';

import '../style/chipStyle.css';
import '../style/tabStyle.css';
import '../style/selectStyle.css';

interface Props {
  data: any;
  goalStatuses: any;
  document: string;
}

interface SDGHoveredProps {
  sdg: number;
  xPosition: number;
  yPosition: number;
}

const ColorKeyBox = styled.div`
  width: 1rem;
  height: 1rem;
`;
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

export const VNRAnalysis = (props: Props) => {
  const {
    data,
    document,
    goalStatuses,
  } = props;
  const [selectedSDG, setSelectedSDG] = useState<any>(null);
  const [hoveredSDG, setHoveredSDG] = useState<null | SDGHoveredProps>(null);
  const [nodeData, setNodeData] = useState<any>(null);
  const dataWithStatuses = data.map((d: any) => ({ ...d, category: d.salience === 0 ? 'No Mention' : d.category.charAt(0).toUpperCase() + d.category.slice(1), status: goalStatuses.filter((el: any) => `${el.goal}` === `${d.sdg}`)[0].status ? goalStatuses.filter((el: any) => `${el.goal}` === `${d.sdg}`)[0].status : 'Gap NA' }));
  const medium = data.filter((d: any) => d.category === 'medium');
  const low = data.filter((d: any) => d.category === 'low' && d.salience !== 0);
  const high = data.filter((d: any) => d.category === 'high');
  const noMetion = data.filter((d: any) => d.salience === 0);
  const gridSize = 780;
  const margin = 20;
  const cellSize = (gridSize - margin) / 4;
  const nodeRadius = 15;
  const statusArray = ['Identified Gap', 'For Review', 'On Track', 'Gap NA'];
  const priorityArray = ['High', 'Medium', 'Low', 'No Mention'];
  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(dataWithStatuses));
    forceSimulation(dataTemp)
      .force('charge', forceManyBody().strength(2.25))
      // .force('center', d3.forceCenter(centre.x, centre.y))
      .force('y', forceX().strength(1).x((d: any) => (priorityArray.indexOf(d.category) * cellSize + (cellSize / 2))))
      .force('x', forceY().strength(1).y((d: any) => (statusArray.indexOf(d.status) * cellSize + (cellSize / 2))))
      .force('collision', forceCollide().radius(nodeRadius + 1))
      .tick(100)
      .on('end', () => { setNodeData(dataTemp); });
  }, [document]);
  return (
    <>
      <div className=' margin-top-00' style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-13)' }}>
        <div className='max-width-1440'>
          <h2 className='undp-typography'>
            Current Priorities Based on
            {' '}
            {document}
          </h2>
          <div className='flex-div margin-top-07' style={{ gap: '2rem' }}>
            <div style={{ width: 'calc(40% - 1rem)' }}>
              <svg width='calc(100% - 20px)' viewBox='0 0 360 360'>
                <path
                  d={describeArc(180, 180, 140, 0, 360 * (high.length / (17)))}
                  fill='none'
                  strokeWidth={50}
                  style={{ stroke: 'var(--blue-700)' }}
                />
                <path
                  d={describeArc(180, 180, 140, 360 * (high.length / (17)), 360 * ((high.length + medium.length) / (17)))}
                  fill='none'
                  strokeWidth={50}
                  style={{ stroke: 'var(--blue-400)' }}
                />
                <path
                  d={describeArc(180, 180, 140, 360 * ((high.length + medium.length) / (17)), 360 * ((high.length + medium.length + low.length) / 17))}
                  fill='none'
                  strokeWidth={50}
                  style={{ stroke: 'var(--blue-200)' }}
                />
                <path
                  d={describeArc(180, 180, 140, 360 * ((high.length + medium.length + low.length) / 17), 360)}
                  fill='none'
                  strokeWidth={50}
                  style={{ stroke: 'var(--gray-400)' }}
                />
                <text
                  x={180}
                  y={180}
                  textAnchor='middle'
                  fontFamily='proxima-nova'
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
                  fontFamily='proxima-nova'
                  fontWeight='bold'
                  fontSize='20px'
                  dy={35}
                >
                  SDGs
                </text>
              </svg>
            </div>
            <div style={{ width: 'calc(60% - 1rem)' }}>
              <div className='margin-bottom-09'>
                <h4 className='undp-typography margin-bottom-03' style={{ color: 'var(--blue-700)' }}>
                  <span className='bold'>
                    {high.length > 0 ? high.length : 'No'}
                    {' '}
                    {high.length > 1 ? 'SDGs' : 'SDG'}
                  </span>
                  {' '}
                  High Priority
                </h4>
                <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Click on the icons to see key features for the SDG</p>
                <div className='sdg-icon-group'>
                  <div className='sdg-icon-container'>
                    {
                      high.map((d: any, i: number) => (
                        <div key={i} onClick={() => { setSelectedSDG(d); }} style={{ cursor: 'pointer' }}>
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
                    {medium.length > 0 ? medium.length : 'No'}
                    {' '}
                    {medium.length > 1 ? 'SDGs' : 'SDG'}
                  </span>
                  {' '}
                  Medium Priority
                </h4>
                <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Click on the icons to see key features for the SDG</p>
                <div className='sdg-icon-group'>
                  <div className='sdg-icon-container'>
                    {
                      medium.map((d: any, i: number) => (
                        <div key={i} onClick={() => { setSelectedSDG(d); }} style={{ cursor: 'pointer' }}>
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
                    {low.length > 0 ? low.length : 'No'}
                    {' '}
                    {low.length > 1 ? 'SDGs' : 'SDG'}
                  </span>
                  {' '}
                  Low Priority
                </h4>
                <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Click on the icons to see key features for the SDG</p>
                <div className='sdg-icon-group'>
                  <div className='sdg-icon-container'>
                    {
                      low.map((d: any, i: number) => (
                        <div key={i} onClick={() => { setSelectedSDG(d); }} style={{ cursor: 'pointer' }}>
                          {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              <div>
                <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--gray-400)' }}>
                  <span className='bold'>
                    {noMetion.length > 0 ? noMetion.length : 'No'}
                    {' '}
                    {noMetion.length > 1 ? 'SDGs' : 'SDG'}
                  </span>
                  {' '}
                  Not Mentioned
                </h4>
                <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Click on the icons to see key features for the SDG</p>
                <div className='sdg-icon-group'>
                  <div className='sdg-icon-container'>
                    {
                      noMetion.map((d: any, i: number) => (
                        <div key={i} onClick={() => { setSelectedSDG(d); }} style={{ cursor: 'pointer' }}>
                          {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' margin-top-13 max-width-1440 flex-div' style={{ gap: '2rem' }}>
        <div className='flex-div margin-top-07' style={{ gap: '2rem', width: '100%' }}>
          <div style={{ width: 'calc(66.67% - 1rem)' }}>
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
          </div>
          <div style={{ width: 'calc(33.33% - 1rem)' }}>
            <h2 className='undp-typography'>
              Current Priorities Based on
              {' '}
              {document}
              {' '}
              and SDG gaps
            </h2>
            <p className='undp-typography'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nisi vestibulum, ultricies mi vel, efficitur purus. Vivamus ipsum nisl, rhoncus eget egestas a, pulvinar in dolor. Vivamus ut egestas nunc. Suspendisse nec rhoncus mauris. Proin malesuada ligula quis est porta hendrerit.
            </p>
          </div>
        </div>
      </div>
      <div className='max-width-1440 margin-top-13 margin-bottom-13'>
        <h3 className='undp-typography bold'>
          Relative Salience Based on
          {' '}
          {document}
        </h3>
        <p className='undp-typography'>
          Relative Salience is a measure of the amount of text content linked to each SDG as compared to the Goal, which is the most salient in the text. Relative Salience can help to understand which of the SDGs covered in the document receive most attention and which ones are only briefly treated.
        </p>
        <div className='flex-div flex-vert-align-center' style={{ gap: '2rem' }}>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--dark-green' }} />
            <p className='small-font'>On track</p>
          </div>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--dark-yellow' }} />
            <p className='small-font'>For review</p>
          </div>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--dark-red' }} />
            <p className='small-font'>Identified gap</p>
          </div>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--gray-400' }} />
            <p className='small-font'>Gaps NA</p>
          </div>
        </div>
        <svg width='100%' viewBox='0 0 1280 430' style={{ marginBottom: '4rem' }}>
          <rect
            x={0}
            width={1280}
            y={400 - (375 * 0.25)}
            height={(375 * 0.25) + 10}
            fill='#F7F7F7'
          />
          <rect
            x={0}
            width={1280}
            y={0}
            height={(375 * 0.25) + 10}
            fill='#F7F7F7'
          />
          <g
            transform={`translate(0,${((375 * 0.25) + 10) / 2})`}
          >
            <text
              fontSize={12}
              x={0}
              y={0}
              dy={12}
              transform='rotate(-90)'
              textAnchor='middle'
              fill='#55606E'
            >
              High Priority
            </text>
          </g>
          <g
            transform='translate(0,210)'
          >
            <text
              fontSize={12}
              x={0}
              y={0}
              dy={12}
              transform='rotate(-90)'
              textAnchor='middle'
              fill='#55606E'
            >
              Medium Priority
            </text>
          </g>
          <g
            transform={`translate(0,${(400 - (375 * 0.125))})`}
          >
            <text
              fontSize={12}
              x={0}
              y={0}
              dy={12}
              transform='rotate(-90)'
              textAnchor='middle'
              fill='#55606E'
            >
              Low Priority
            </text>
          </g>
          {
            dataWithStatuses.map((d:any, i: number) => (
              <g
                key={i}
                transform={`translate(${i * 75},10)`}
              >
                <circle
                  cx={37.5}
                  r={15}
                  cy={400 - (375 * d.salience)}
                  fill={d.status === 'On Track' ? '#59BA47' : d.status === 'For Review' ? '#FBC412' : d.status === 'Identified Gap' ? '#D12800' : '#A9B1B7'}
                />
                <line
                  strokeWidth={2}
                  width={45}
                  x1={37.5}
                  x2={37.5}
                  y1={400 - (375 * d.salience)}
                  y2={400}
                  stroke={d.status === 'On Track' ? '#59BA47' : d.status === 'For Review' ? '#FBC412' : d.status === 'Identified Gap' ? '#D12800' : '#A9B1B7'}
                />
                <text
                  x={37.5}
                  y={400 - (375 * d.salience)}
                  dy={-20}
                  fill={d.status === 'On Track' ? '#59BA47' : d.status === 'For Review' ? '#FBC412' : d.status === 'Identified Gap' ? '#D12800' : '#A9B1B7'}
                  fontSize={12}
                  textAnchor='middle'
                >
                  {(d.salience).toFixed(3)}
                </text>
                <text
                  x={37.5}
                  y={400}
                  dy={20}
                  fill='#212121'
                  fontSize={16}
                  textAnchor='middle'
                >
                  SDG
                  {' '}
                  {d.sdg}
                </text>
                {

                }
              </g>
            ))
          }
        </svg>
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
                  selectedSDG.features.map((d: any, i: number) => <div key={i} className='undp-chip'>{d}</div>)
                }
              </div>
            </Modal>
          ) : null
      }
    </>
  );
};
