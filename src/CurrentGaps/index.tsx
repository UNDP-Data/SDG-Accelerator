import styled from 'styled-components';
import { Select } from 'antd';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { SDGGOALS, TargetIndicatorCount } from '../Constants';
import { SDGGapsData } from './SDGGapsData';
import { GoalStatusType, StatusesType, TimeSeriesDataTypeWithStatusCode } from '../Types';
import IMAGES from '../img/images';
import { SDGGoalGapList } from './SDGGoalGapList';

interface Props {
  goalStatuses: GoalStatusType[];
  statuses: StatusesType;
  countryData: TimeSeriesDataTypeWithStatusCode[];
  countryFullName: string;
  countryCode: string;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) rgba(0, 0, 0, 0.3) no-repeat center;
  background-size: cover;
  background-blend-mode: multiply;
  margin-top: 7.1875rem;
`;

const StatCardsContainer = styled.div`
  width: 'calc(33.33% - 0.667rem)';
  min-width: 15rem !important;
  flex-grow: 1;
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

  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            SDG Trends for
            {' '}
            {countryFullName}
          </h1>
          <h5 className='undp-typography'>
            Progress on the 17 SDGs are tracked through 169 sub-targets, which in turn are measured using
            {' '}
            <a href='https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf' target='_blank' rel='noreferrer' className='undp-style italics' style={{ color: 'var(--white)' }}>232 unique indicators</a>
            .
            <br />
            <br />
            Understanding how countries perform against these provides a comprehensive assessment of the current trends and the baseline landscape against which to build SDG policy pathways.
            <br />
            <br />
            Countries SDG trends are based on
            {' '}
            <a href='https://unstats.un.org/sdgs/dataportal' style={{ color: 'var(--white' }} target='_blank' rel='noreferrer' className='undp-style italics'>data</a>
            {' '}
            and
            {' '}
            <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' style={{ color: 'var(--white' }} target='_blank' rel='noreferrer' className='undp-style italics'>methodology</a>
            {' '}
            from the UN Statistics Division. Additional data may be added to address gaps at government request, to provide a comprehensive landscape for identification of SDG policy pathways.
            <br />
            <br />
            <span className='italics'>
              To request the inclusion of additional national data contact
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
        </div>
      </HeroImageEl>
      <div className=' margin-top-00' style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-09)' }}>
        <div className='max-width' style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-09)' }}>
          <h2 className='undp-typography'>SDG Trends</h2>
          <div className='margin-top-07 margin-bottom-05'>
            The SDG Trends assessment is based on currently available data in the
            {' '}
            <a href='https://unstats.un.org/sdgs/dataportal' className='undp-style' target='_blank' rel='noreferrer'>UN Stats SDG Data Portal</a>
            {' '}
            and methodology as per the
            {' '}
            <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' className='undp-style' target='_blank' rel='noreferrer'>SDG Progress Chart 2022 Technical Note</a>
            . Additional data may be added to address gaps at a government&apos;s request, providing a comprehensive landscape for identification of SDG policy pathways.
          </div>
          <SDGGoalGapList goalStatuses={goalStatuses} />
        </div>
      </div>
      <div className='margin-top-13 max-width-1440' style={{ padding: '0 1rem' }}>
        <Select
          value={selectedSDG}
          className='undp-select-no-background'
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
                {goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status ? goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status === 'Identified Gap' ? 'Off Track' : goalStatuses[goalStatuses.findIndex((d) => `SDG ${d.goal}` === selectedSDG.split(':')[0])].status : 'trend NA'}
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
