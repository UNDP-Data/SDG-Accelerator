import styled from 'styled-components';
import { useState } from 'react';
import { Select } from 'antd';
import sortBy from 'lodash.sortby';
import { NavLink } from 'react-router-dom';
import { getSDGIcon } from '../utils/getSDGIcon';
import { SDGGOALS, SDG_ICON_SIZE, TargetIndicatorCount } from '../Constants';
import { SDGGapsData } from './SDGGapsData';
import Background from '../img/UNDP-hero-image.png';
import '../style/statCardStyle.css';
import { describeArc } from '../utils/getArc';
import { GoalStatusType, StatusesType, TimeSeriesDataTypeWithStatusCode } from '../Types';

interface Props {
  goalStatuses: GoalStatusType[];
  statuses: StatusesType;
  countryData: TimeSeriesDataTypeWithStatusCode[];
  countryFullName: string;
  countryCode: string;
}

const HeroImageEl = styled.div`
  background: url(${Background}) rgba(0, 0, 0, 0.3) no-repeat center;
  background-size: cover;
  background-blend-mode: multiply;
  margin-top: 7.1875rem;
`;

const StatCardsContainer = styled.div`
  width: 'calc(33.33% - 0.667rem)';
  min-width: 15rem !important;
  flex-grow: 1;
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

export const CurrentGaps = (props: Props) => {
  const {
    goalStatuses,
    statuses,
    countryData,
    countryFullName,
    countryCode,
  } = props;
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  const onTrack = sortBy(goalStatuses.filter((d) => d.status === 'On Track'), 'goal');
  const identifiedGap = sortBy(goalStatuses.filter((d) => d.status === 'Identified Gap'), 'goal');
  const forReview = sortBy(goalStatuses.filter((d) => d.status === 'For Review'), 'goal');
  const gapsNA = sortBy(goalStatuses.filter((d) => !d.status), 'goal');

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
            Progress on the 17 SDGs are tracked through 169 sub-targets, which in turn are measured using
            {' '}
            <a href='https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf' target='_blank' rel='noreferrer' className='undp-style dark-bg red-underline'>232 unique indicators</a>
            .
            <br />
            <br />
            Understanding how countries perform against these provides a comprehensive assessment of the current trends and the baseline landscape against which to build the SDG Push.
            <br />
            <br />
            <span className='italics'>
              The gaps and trends can be customized to support national level dialogue using national data by contacting
              {' '}
              <a className='undp-style' style={{ color: 'var(--white' }} href='mailto:data@undp.org' target='_blank' rel='noreferrer'>data@undp.org</a>
              .
              {
                countryCode === 'IDN' ? (
                  <>
                    <br />
                    <br />
                    <NavLink style={{ color: 'var(--white' }} className='undp-style' to='../../sdg-push-diagnostic/IDNWithCountryGovInput/sdg-trends'>
                      Click here
                    </NavLink>
                    {' '}
                    to see the analysis after national level dialogue.
                  </>
                ) : null
              }
              {
                countryCode === 'IDNWithCountryGovInput' ? (
                  <>
                    <br />
                    <br />
                    <NavLink style={{ color: 'var(--white' }} className='undp-style' to='../../sdg-push-diagnostic/IDN/sdg-trends'>
                      Click here
                    </NavLink>
                    {' '}
                    to see the analysis without national level dialogue.
                  </>
                ) : null
              }
            </span>
          </h5>
          <h3 className='undp-typography margin-top-09'>
            For
            {' '}
            <span className='bold'>{countryFullName}</span>
            , out of 17 SDG goals,
            {' '}
            <span className='bold' style={{ color: 'var(--dark-green)' }}>
              {goalStatuses.filter((d) => d.status === 'On Track').length}
              {' '}
              are On Track,
            </span>
            <span className='bold' style={{ color: 'var(--dark-yellow)' }}>
              {' '}
              {goalStatuses.filter((d) => d.status === 'For Review').length}
              {' '}
              are For Review
            </span>
            {' '}
            and,
            <span className='bold' style={{ color: 'var(--dark-red)' }}>
              {' '}
              {goalStatuses.filter((d) => d.status === 'Identified Gap').length}
              {' '}
              are Identified Gaps
            </span>
          </h3>
        </div>
      </HeroImageEl>
      <div
        className='margin-top-07 margin-bottom-07 bold'
        style={{
          padding: 'var(--spacing-07)', backgroundColor: 'var(--blue-100)', marginLeft: 'var(--spacing-07)', marginRight: 'var(--spacing-07)',
        }}
      >
        Disclaimer
        <br />
        <br />
        For the diagnostics and the insights report to be useful for policy inference, engagement with relevant member state is critical. The results here only presents an initial draft diagnostics of the state of SDGs in a country.
        The SDG Trends assessment is based on currently available data in the
        {' '}
        <a href='https://unstats.un.org/sdgs/dataportal' className='undp-style' target='_blank' rel='noreferrer'>UN Stats SDG Data Portal</a>
        {' '}
        and methodology as per the
        {' '}
        <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' className='undp-style' target='_blank' rel='noreferrer'>SDG Progress Chart 2022 Technical Note</a>
        .
        Engagement with National Statistics Offices and country Government are required to ensure the latest SDG data and national methodologies are incorporated and updated.
      </div>
      <div className=' margin-top-00' style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-09)' }}>
        <div className='max-width' style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-09)' }}>
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
      <div className='margin-top-13 max-width-1440' style={{ padding: '0 1rem' }}>
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
                  goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status === 'On Track'
                    ? 'green-text'
                    : goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status === 'For Review'
                      ? 'yellow-text'
                      : goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status === 'Identified Gap'
                        ? 'red-text'
                        : ''
                  }
              >
                {goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status ? goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status : 'Gap NA'}
              </h2>
              <p>SDG Trend</p>
            </div>
          </div>
          <StatCardsContainer>
            <div className='stat-card'>
              <h2>
                {TargetIndicatorCount[TargetIndicatorCount.findIndex((d) => `SDG ${d.sdg}` === selectedSDG.split(':')[0])].noOfTargets}
              </h2>
              <p>No. of Targets</p>
            </div>
          </StatCardsContainer>
          <StatCardsContainer>
            <div className='stat-card'>
              <h2>
                {TargetIndicatorCount[TargetIndicatorCount.findIndex((d) => `SDG ${d.sdg}` === selectedSDG.split(':')[0])].noOfIndicators}
              </h2>
              <p>No. of indicators</p>
            </div>
          </StatCardsContainer>
          <StatCardsContainer>
            <div className='stat-card'>
              <h2>
                {goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].noOfIndicatorsWithData}
              </h2>
              <p>No. of indicators with methodology and data</p>
            </div>
          </StatCardsContainer>
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
