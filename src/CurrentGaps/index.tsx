import styled from 'styled-components';
import { useState } from 'react';
import { Select } from 'antd';
import { getSDGIcon } from '../utils/getSDGIcon';
import { SDGGOALS, SDG_ICON_SIZE } from '../Constants';
import { SDGGapsData } from './SDGGapsData';
import Background from '../img/UNDP-hero-image.png';
import '../style/statCardStyle.css';

interface Props {
  goalStatuses: any;
  statuses: any;
  countryData: any;
  countryFullName: string;
}

const HeroImageEl = styled.div`
  background: url(${Background}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

interface HeightProps {
  height: number;
}

const SDGIconsEl = styled.div<HeightProps>`
  height: ${(props) => `${props.height}px`};
`;

export const CurrentGaps = (props: Props) => {
  const {
    goalStatuses,
    statuses,
    countryData,
    countryFullName,
  } = props;
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  const onTrack = goalStatuses.filter((d: any) => d.status === 'On Track');
  const identifiedGap = goalStatuses.filter((d: any) => d.status === 'Identified Gap');
  const forReview = goalStatuses.filter((d: any) => d.status === 'For Review');
  const gapsNA = goalStatuses.filter((d: any) => d.status === undefined);
  const noOfRowForIcons = Math.ceil(Math.max(onTrack.length, identifiedGap.length, forReview.length, gapsNA.length) / 3);
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            Showing current gaps for
            {' '}
            {countryFullName}
          </h1>
          <h5 className='undp-typography'>
            For
            {' '}
            <span className='bold'>{countryFullName}</span>
            , out of 17 SDG goals,
            {' '}
            <span className='bold'>
              {goalStatuses.filter((d: any) => d.status === 'On Track').length}
              {' '}
              are On Track,
            </span>
            <span className='bold'>
              {' '}
              {goalStatuses.filter((d: any) => d.status === 'Identified Gap').length}
              {' '}
              are Identified Gaps
            </span>
            {' '}
            and,
            <span className='bold'>
              {' '}
              {goalStatuses.filter((d: any) => d.status === 'For Review').length}
              {' '}
              are For Review
            </span>
          </h5>
          <button type='button' className='margin-top-09 undp-button button-primary button-arrow'>
            Download Report
          </button>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>SDG Trends</h2>
          </div>
          <div className='undp-section-content'>
            Use this tool to get a country overview of which SDGs are on-track or lagging behind in reaching the 2030 targets. Powered by data, explore each of the 17 SDG and related 169 sub-targets trends through interactive, easy-to-use visualisations of the
            {' '}
            <a href='https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf' target='_blank' rel='noreferrer' className='undp-style dark-bg red-underline'>232 unique indicators</a>
            .
          </div>
        </div>
        <div className='flex-div max-width-1440' style={{ gap: '2rem' }}>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  onTrack.map((d: any, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{onTrack.length}</h2>
            <h4 className='undp-typography'>On Track</h4>
            <p className='undp-typography'>The country is on track to fulfil the SDG by 2030</p>
          </div>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  forReview.map((d: any, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{forReview.length}</h2>
            <h4 className='undp-typography'>For Review</h4>
            <p className='undp-typography'>With current progress the country will miss the SDG by 2030 by a small margin</p>
          </div>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  identifiedGap.map((d: any, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{identifiedGap.length}</h2>
            <h4 className='undp-typography'>Identified Gaps</h4>
            <p className='undp-typography'>With current progress the country will miss the SDG by 2030 by a large margin</p>
          </div>
          <div className='stat-card-long'>
            <SDGIconsEl height={(noOfRowForIcons * SDG_ICON_SIZE) + ((noOfRowForIcons - 1) * 16)} className='sdg-icon-group'>
              <div className='sdg-icon-container'>
                {
                  gapsNA.map((d: any, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
              </div>
            </SDGIconsEl>
            <h2 className='undp-typography'>{gapsNA.length}</h2>
            <h4 className='undp-typography'>Gaps NA</h4>
            <p className='undp-typography'>Country doesn’t have enough data to identify the progress of the SDG</p>
          </div>
        </div>
      </div>
      <div className='margin-top-13 max-width-1440'>
        <Select
          value={selectedSDG}
          className='sdg-select'
          onChange={(d) => { setSelectedSDG(d); }}
        >
          {
            SDGGOALS.map((d, i) => (
              <Select.Option className='undp-select-option' value={d} key={i}>
                {d}
              </Select.Option>
            ))
          }
        </Select>
        <div className='flex-div margin-top-07 margin-bottom-07 flex-wrap'>
          <div style={{ width: '100%' }}>
            <div className='stat-card'>
              <h2
                className={
                  goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status === 'On Track'
                    ? 'green-text'
                    : goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status === 'For Review'
                      ? 'yellow-text'
                      : goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status === 'Identified Gap'
                        ? 'red-text'
                        : ''
                  }
              >
                {goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status ? goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status : 'Gap NA'}
              </h2>
              <p>SDG Trend</p>
            </div>
          </div>
          <div style={{ width: 'calc(33.33% - 0.667rem)' }}>
            <div className='stat-card'>
              <h2>
                {goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].noOfTargets}
              </h2>
              <p>No. of Targets</p>
            </div>
          </div>
          <div style={{ width: 'calc(33.33% - 0.667rem)' }}>
            <div className='stat-card'>
              <h2>
                {goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].noOfIndicators}
              </h2>
              <p>No. of indicators</p>
            </div>
          </div>
          <div style={{ width: 'calc(33.33% - 0.667rem)' }}>
            <div className='stat-card'>
              <h2>
                {goalStatuses[goalStatuses.findIndex((d: any) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].noOfIndicatorWithDataAndMethodology}
              </h2>
              <p>No. of indicators with methodology and data</p>
            </div>
          </div>
        </div>
        <SDGGapsData
          statusData={statuses}
          selectedSDG={selectedSDG}
          countryData={countryData}
        />
      </div>
    </>
  );
};
