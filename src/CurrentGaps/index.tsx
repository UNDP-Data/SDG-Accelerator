import styled from 'styled-components';
import { Select } from 'antd';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { SDGGOALS, TargetIndicatorCount } from '../Constants';
import { SDGGapsData } from './SDGGapsData';
import { DownloadImage } from '../utils/DownloadImage';
import {
  GoalStatusType, TargetStatusType, StatusesType, TimeSeriesDataTypeWithStatusCode,
} from '../Types';
import IMAGES from '../img/images';
import { SDGTargetsGapVisualization } from './SDGTargetsGapVisualization';
import { GoalLevelGapVisualization } from './GoalLevelGapVisualization';

interface Props {
  goalStatuses: GoalStatusType[];
  targetStatuses: TargetStatusType[];
  statuses: StatusesType;
  countryData: TimeSeriesDataTypeWithStatusCode[];
  countryFullName: string;
  countryCode: string;
  trendsByGoals?: boolean;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.greenHeroImage}) rgba(0, 0, 0, 0.3) no-repeat center;
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
    targetStatuses,
    trendsByGoals,
  } = props;
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <div className='undp-breadcrumb-light margin-bottom-10'>
            <a href='../'>
              SDG Push Diagnostics
            </a>
            <div className='divider'>/</div>
            <a href='./'>
              {countryFullName}
            </a>
            <div className='divider'>/</div>
            <span>
              Current Gaps
            </span>
          </div>
          <h1 className='undp-typography'>
            SDG Trends:
            <br />
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
                countryCode === 'EGY'
                || countryCode === 'NPL'
                || countryCode === 'IDN'
                || countryCode === 'MNG'
                || countryCode === 'JOR'
                || countryCode === 'TTO'
                || countryCode === 'ECU'
                || countryCode === 'VNM' ? (
                  <>
                    <br />
                    <br />
                    <NavLink style={{ color: 'var(--white' }} className='undp-style' to={`../../${countryCode}WithCountryGovInput/sdg-trends`}>
                      Click here
                    </NavLink>
                    {' '}
                    to see the analysis after national level dialogue.
                  </>
                  ) : null
              }
              {
                countryCode.includes('WithCountryGovInput') ? (
                  <>
                    <br />
                    <br />
                    <NavLink style={{ color: 'var(--white' }} className='undp-style' to={`../../${countryCode.replaceAll('WithCountryGovInput', '')}/sdg-trends`}>
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
      <div className=' margin-top-00' style={{ backgroundColor: 'var(--gray-200)' }}>
        <div className='max-width' style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-09)' }}>

          <div className='flex-div flex-wrap margin-top-00'>
            <div className='margin-top-00 margin-bottom-00' style={{ width: trendsByGoals ? '100%' : 'calc(50% - 0.5rem)' }}>
              <h2 className='undp-typography'>SDG Trends</h2>
              <div className='margin-bottom-07'>
                The SDG Trends assessment is based on currently available data in the
                {' '}
                <a href='https://unstats.un.org/sdgs/dataportal' className='undp-style' target='_blank' rel='noreferrer'>UN Stats SDG Data Portal</a>
                {' '}
                and methodology as per the
                {' '}
                <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' className='undp-style' target='_blank' rel='noreferrer'>SDG Progress Chart 2022 Technical Note</a>
                .
                <br />
                <br />
                Additional data may be added to address gaps at a government&apos;s request, providing a comprehensive landscape for identification of SDG policy pathways.
                <br />
                <br />
                {
                  trendsByGoals ? null : (
                    <>
                      The SDG targets are organized according to the
                      {' '}
                      <span className='bold'>5 P&apos;s</span>
                      {' '}
                      of sustainable development.
                      <br />
                      <br />
                      <p className='undp-typography italics' style={{ color: 'var(--gray-600)' }}>
                        The size of the pie chart is determined by the number of SDG targets used to measure each P:
                        {' '}
                        <span className='bold' style={{ color: 'var(--gray-700)' }}>People</span>
                        {' '}
                        (47 targets),
                        {' '}
                        <span className='bold' style={{ color: 'var(--gray-700)' }}>Peace</span>
                        {' '}
                        (12 targets),
                        {' '}
                        <span className='bold' style={{ color: 'var(--gray-700)' }}>Planet</span>
                        {' '}
                        (46 targets),
                        {' '}
                        <span className='bold' style={{ color: 'var(--gray-700)' }}>Prosperity</span>
                        {' '}
                        (45 targets) and
                        {' '}
                        <span className='bold' style={{ color: 'var(--gray-700)' }}>Partnership</span>
                        {' '}
                        (19 targets).
                      </p>
                    </>
                  )
                }
              </div>
              <button
                className='undp-button tertiary-button flex-div gap-03'
                type='button'
                style={{ color: 'var(--blue-600)', padding: 0 }}
                onClick={() => { if (ref) { DownloadImage(ref, 'Trends Chart'); } }}
              >
                <Download strokeWidth={2} size={20} />
                Download Trends as Image
              </button>
            </div>
            {
              trendsByGoals ? <GoalLevelGapVisualization targetStatuses={targetStatuses} setRef={setRef} width='100%' />
                : <SDGTargetsGapVisualization targetStatuses={targetStatuses} setRef={setRef} width='calc(50% - 0.5rem)' />

            }
          </div>
        </div>
      </div>
      <div className='margin-top-07 max-width-1440' style={{ padding: '0 1rem' }}>
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
