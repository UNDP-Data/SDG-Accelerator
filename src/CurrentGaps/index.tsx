import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select } from 'antd';
import { PageTitle } from '../Components/PageTitle';
import { DonutChartCard } from './DonutChartCard';
import { SDGGapsList } from './SDGGapsList';
import { CountryListType } from '../Types';
import { Nav } from '../Header/Nav';
import { Interlinkages } from './Interlinkages';
import { CaretDown, InfoIcon } from '../icons';
import { Tooltip } from '../Components/Tooltip';
import { IndicatorOverview } from './IndicatorOverview';
import { getSDGIcon } from '../utils/getSDGIcon';
import { COUNTRYOPTION, SDGGOALS } from '../Constants';
import { Tag } from '../Components/Tag';

const CountrySDGGap:CountryListType[] = require('../Data/countrySDGGapData.json');

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 0 auto;
`;

const RowEl = styled.div`
  margin-top: 2rem;
  display: flex;
  background-color: var(--black-200);
  align-items: stretch;
`;

const TitleEl = styled.div`
  margin: 4rem 0 0 0;
  display: flex;
  align-items: center;
`;

const IconEl = styled.div`
  margin-left: 1rem; 
`;

const IndicatorOverviewEl = styled.div`
  margin-top: 5rem;
`;

const H2 = styled.h2`
  margin-bottom: 2rem;
`;

const SummaryEl = styled.div`
  padding: 2rem;
  background-color: var(--blue-bg);
  border: 1px solid var(--primary-blue);
  border-radius: 2px;
  font-size: 2rem;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  margin: -2rem -2rem 2rem -2rem;
  padding: 2rem;
  background-color: var(--black-300);
  position: sticky;
  z-index: 100;
  top: 5rem;
`;

const DropdownEl = styled.div`
  margin-left: 2rem;
`;

interface ColorProps {
  fill: string;
}

const TargetBox = styled.div<ColorProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.8rem;
  height: 4.8rem;
  font-size: 1.6rem;
  font-weight: 500;
  margin-right: 1rem;
  text-align: center;
  background-color: ${(props) => props.fill};
`;

const TargetListEl = styled.div`
  display: flex;
`;

const ContainerEl = styled.div`
  background-color: var(--black-200);
  padding: 2rem 2rem 0 2rem;

`;

export const CurrentGaps = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  const goalDetailDiv = useRef(null);

  const countrySelected = useParams().country;
  const countryFullName = COUNTRYOPTION[COUNTRYOPTION.findIndex((d) => d.code === countrySelected)].countryName;
  const selectedSDGData = CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data'][CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data'].findIndex((d) => d.Goal === selectedSDG.split(':')[0])];
  return (
    <>
      <Nav
        pageURL='/current-sdg-gaps'
      />
      <PageTitle
        title='Current Gaps'
        description='Visualization of SDG gaps nationally allows for easy identification of where SDG goals are being left behind. Using up to date data, explore SDG progress in your country and which targets are at risk of not being met by 2030. These insights will be the basis for evidence-based, holistic dialogue at the national level.'
      />
      <RootEl>
        <SummaryEl>
          For
          {' '}
          <span className='bold'>{countryFullName}</span>
          , out of 17 SDG goals,
          {' '}
          <span className='bold'>
            {CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data'].filter((d) => d.Status === 'On Track').length}
            {' '}
            are On Track,
            {' '}
            {CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data'].filter((d) => d.Status === 'Identified Gap').length}
            {' '}
            are Identified Gaps and,
            {' '}
            {CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data'].filter((d) => d.Status === 'For Review').length}
            {' '}
            are For Review
          </span>
        </SummaryEl>
        <RowEl>
          <DonutChartCard
            centralText='All SDG Status'
            data={CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data']}
          />
          <SDGGapsList
            data={CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data']}
            setSelectedSDG={setSelectedSDG}
            divRef={goalDetailDiv}
          />
        </RowEl>
        <>
          <TitleEl>
            <h2>Target Overview</h2>
            <div onMouseEnter={() => { setShowPopUp(true); }} onMouseLeave={() => { setShowPopUp(false); }}>
              <IconEl>
                <InfoIcon
                  size={18}
                />
              </IconEl>
              {
                showPopUp
                  ? (
                    <Tooltip
                      text='Identify which targets have the biggest effect on other SDG targets, and explore which targets to pursue which have the highest positive interlinkage (“synergy”) with other SDG targets. This is an exercise in understanding how we can speed development forward in a positive and sustainable manner based on the identified gaps and priorities.'
                    />
                  ) : null
              }
            </div>
          </TitleEl>
          <Interlinkages
            selectedCountry={CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['Country or Area']}
          />
        </>
        <IndicatorOverviewEl ref={goalDetailDiv}>
          <H2>SDG Overview</H2>
          <ContainerEl>
            <FlexDiv>
              {getSDGIcon(selectedSDG.split(':')[0], 80)}
              <DropdownEl>
                <Select
                  value={selectedSDG}
                  className='SDGSelector'
                  onChange={(d) => { setSelectedSDG(d); }}
                  suffixIcon={<div style={{ marginTop: '-0.2rem' }}><CaretDown size={24} /></div>}
                >
                  {
                    SDGGOALS.map((d, i) => (
                      <Select.Option value={d} key={i}>
                        {d}
                      </Select.Option>
                    ))
                  }
                </Select>
                <Tag
                  backgroundColor={selectedSDGData.Status === 'On Track' ? 'var(--accent-green)' : selectedSDGData.Status === 'Identified Gap' ? 'var(--accent-red)' : 'var(--accent-yellow)'}
                  text={selectedSDGData.Status}
                  fontColor={selectedSDGData.Status === 'For Review' ? 'var(--black)' : 'var(--white)'}
                  margin='0.5rem 0 0 0'
                />
              </DropdownEl>
            </FlexDiv>
            <SummaryEl style={{ marginBottom: '4rem' }}>
              <h3>Status of Targets</h3>
              <TargetListEl>
                {
                  selectedSDGData.Targets.map((d) => (
                    <TargetBox
                      fill={d.Status === 'On Track' ? '#C5EFC4' : d.Status === 'Identified Gap' ? '#FEC8C4' : '#FEE697'}
                    >
                      {d.Target.split(' ')[1]}
                    </TargetBox>
                  ))
                }
              </TargetListEl>
            </SummaryEl>
            <IndicatorOverview
              selectedSDG={selectedSDG}
            />
          </ContainerEl>
        </IndicatorOverviewEl>
      </RootEl>
    </>
  );
};
