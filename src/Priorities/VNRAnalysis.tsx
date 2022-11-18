/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { SDG_ICON_SIZE } from '../Constants';
import { getSDGIcon } from '../utils/getSDGIcon';

import '../style/chipStyle.css';
import '../style/tabStyle.css';
import '../style/selectStyle.css';

interface Props {
  data: any;
  goalStatuses: any;
  document: string;
}

interface HeightProps {
  height: number;
}

const SDGIconsEl = styled.div<HeightProps>`
  height: ${(props) => `${props.height}px`};
`;

const ColorKeyBox = styled.div`
  width: 1rem;
  height: 1rem;
`;

const getSDGs = (priority: any, gaps: any) => {
  const arr: string[] = [];
  priority.forEach((d: any) => {
    if (gaps.findIndex((el: any) => `${el.goal}` === `${d.sdg}`) !== -1) {
      arr.push(`SDG ${d.sdg}`);
    }
  });
  return arr;
};

export const VNRAnalysis = (props: Props) => {
  const {
    data,
    document,
    goalStatuses,
  } = props;
  const [selectedSDG, setSelectedSDG] = useState<any>(null);
  const dataWithStatuses = data.map((d: any) => ({ ...d, status: goalStatuses.filter((el: any) => `${el.goal}` === `${d.sdg}`)[0].status }));
  const medium = data.filter((d: any) => d.category === 'medium');
  const low = data.filter((d: any) => d.category === 'low' && d.salience !== 0);
  const high = data.filter((d: any) => d.category === 'high');
  const noMetion = data.filter((d: any) => d.salience === 0);
  const onTrack = goalStatuses.filter((d: any) => d.status === 'On Track');
  const identifiedGap = goalStatuses.filter((d: any) => d.status === 'Identified Gap');
  const forReview = goalStatuses.filter((d: any) => d.status === 'For Review');
  const noOfRowForIcons = Math.ceil(Math.max(high.length, medium.length, low.length, noMetion.length) / 3);
  const prioritiesBasedOnGaps = {
    high: {
      onTrack: getSDGs(high, onTrack),
      identifiedGap: getSDGs(high, identifiedGap),
      forReview: getSDGs(high, forReview),
    },
    medium: {
      onTrack: getSDGs(medium, onTrack),
      identifiedGap: getSDGs(medium, identifiedGap),
      forReview: getSDGs(medium, forReview),
    },
    low: {
      onTrack: getSDGs(low, onTrack),
      identifiedGap: getSDGs(low, identifiedGap),
      forReview: getSDGs(low, forReview),
    },
    noMetion: {
      onTrack: getSDGs(noMetion, onTrack),
      identifiedGap: getSDGs(noMetion, identifiedGap),
      forReview: getSDGs(noMetion, forReview),
    },
  };
  return (
    <>
      <div className='undp-hero-section-gray'>
        <h2 className='undp-typography' style={{ textAlign: 'center' }}>
          Current Priorities Based on
          {' '}
          {document}
        </h2>
        <div className='flex-div max-width-1440' style={{ gap: '2rem' }}>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  high.map((d: any, i: number) => (
                    <div key={i} onClick={() => { setSelectedSDG(d); }} style={{ cursor: 'pointer' }}>
                      {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{high.length}</h2>
            <h4 className='undp-typography'>High Priority</h4>
            <p className='undp-typography margin-top-07'>High priority SDGs based on gaps</p>
            <h6 className='undp-typography margin-top-05'>On Track</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.high.onTrack.length > 0
                  ? prioritiesBasedOnGaps.high.onTrack.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-green'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>For Review</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.high.forReview.length > 0
                  ? prioritiesBasedOnGaps.high.forReview.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-yellow'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>Identified Gap</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.high.identifiedGap.length > 0
                  ? prioritiesBasedOnGaps.high.identifiedGap.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-red'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
          </div>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  medium.map((d: any, i: number) => (
                    <div key={i} onClick={() => { setSelectedSDG(d); }} style={{ cursor: 'pointer' }}>
                      {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{medium.length}</h2>
            <h4 className='undp-typography'>Medium Priority</h4>
            <p className='undp-typography margin-top-07'>Medium priority SDGs based on gaps</p>
            <h6 className='undp-typography margin-top-05'>On Track</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.medium.onTrack.length > 0
                  ? prioritiesBasedOnGaps.medium.onTrack.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-green'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>For Review</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.medium.forReview.length > 0
                  ? prioritiesBasedOnGaps.medium.forReview.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-yellow'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>Identified Gap</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.medium.identifiedGap.length > 0
                  ? prioritiesBasedOnGaps.medium.identifiedGap.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-red'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
          </div>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  low.map((d: any, i: number) => (
                    <div key={i} onClick={() => { setSelectedSDG(d); }} style={{ cursor: 'pointer' }}>
                      {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{low.length}</h2>
            <h4 className='undp-typography'>Low Priority</h4>
            <p className='undp-typography margin-top-07'>Low priority SDGs based on gaps</p>
            <h6 className='undp-typography margin-top-05'>On Track</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.low.onTrack.length > 0
                  ? prioritiesBasedOnGaps.low.onTrack.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-green'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>For Review</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.low.forReview.length > 0
                  ? prioritiesBasedOnGaps.low.forReview.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-yellow'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>Identified Gap</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.low.identifiedGap.length > 0
                  ? prioritiesBasedOnGaps.low.identifiedGap.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-red'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
          </div>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  noMetion.map((d: any, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.sdg}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{noMetion.length}</h2>
            <h4 className='undp-typography'>No Mention</h4>
            <p className='undp-typography margin-top-07'>Not mentioned SDGs based on gaps</p>
            <h6 className='undp-typography margin-top-05'>On Track</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.noMetion.onTrack.length > 0
                  ? prioritiesBasedOnGaps.noMetion.onTrack.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-green'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>For Review</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.noMetion.forReview.length > 0
                  ? prioritiesBasedOnGaps.noMetion.forReview.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-yellow'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
            <h6 className='undp-typography margin-top-09'>Identified Gap</h6>
            <div className='flex-div flex-wrap' style={{ gap: '0.5rem' }}>
              {
                prioritiesBasedOnGaps.noMetion.identifiedGap.length > 0
                  ? prioritiesBasedOnGaps.noMetion.identifiedGap.map((d: any, i: number) => (
                    <div key={i} className='undp-chip undp-chip-small undp-chip-dark-red'>
                      {d}
                    </div>
                  )) : <div className='small-font italics' style={{ opacity: '0.6' }}>No SDGs</div>
              }
            </div>
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
