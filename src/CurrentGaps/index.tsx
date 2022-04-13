import styled from 'styled-components';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageTitle } from '../Components/PageTitle';
import { DonutChartCard } from './DonutChartCard';
import { SDGGapsList } from './SDGGapsList';
import SDGList from '../Data/SDGGoalList.json';
import { CountryListType } from '../Types';
import { Nav } from '../Header/Nav';
import { Interlinkages } from './Interlinkages';
import { InfoIcon } from '../icons';
import { Tooltip } from '../Components/Tooltip';
import { IndicatorOverview } from './IndicatorOverview';

const CountrySDGGap:CountryListType[] = require('../Data/countrySDGGapData.json');

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 0 auto;
`;

const RowEl = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
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

export const CurrentGaps = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const SDGOptions = SDGList.map((d) => ({ label: `${d.Goal}: ${d['Goal Name']}` }));
  SDGOptions.unshift({ label: 'All SDG Status' });
  const countrySelected = useParams().country;
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
        <RowEl>
          <DonutChartCard
            title='SDG Gaps Overview'
            centralText='All SDG Status'
            selectedSDG='All SDG Status'
            data={CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data']}
          />
          <SDGGapsList
            data={CountrySDGGap[CountrySDGGap.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data']}
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
        <IndicatorOverviewEl>
          <H2>Indicator Overview</H2>
          <IndicatorOverview />
        </IndicatorOverviewEl>
      </RootEl>
    </>
  );
};
