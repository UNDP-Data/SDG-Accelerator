import styled from 'styled-components';
import Select from 'react-dropdown-select';
import { useState } from 'react';
import sortBy from 'lodash.sortby';
import { PageTitle } from '../Components/PageTitle';
import { DonutChartCard } from './DonutChartCard';
import { SDGGapsList } from './SDGGapsList';
import { TargetGapsList } from './TargetGapsList';
import { TargetStatusCard } from './TargetStatusCard';
import { IndicatorStatusCard } from './IndicatorStatusCard';
import { CaretDown } from '../icons';
import { SectionTitle } from '../Components/SectionTitle';
import { Banner } from '../Components/Banner';
import SDGList from '../Data/SDGGoalList.json';
import { CountryListType, SDGStatusListType } from '../Types';
import { MapViz } from './MapViz';

const CountrySDGGap:CountryListType[] = require('../Data/countrySDGGapData.json');
const WorldSDGGap:SDGStatusListType[] = require('../Data/worldSdgGap.json');

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

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.4rem;
  flex-wrap: wrap;
`;
const IconEl = styled.div`
  height: 2.4rem;
  margin-left: -1.5rem;
  margin-right: 1rem;
`;

const SelectTitleText = styled.div`
  margin-right: 1rem;
`;

export const CurrentGaps = () => {
  const [selectedSDG, setSelectedSDG] = useState('All SDG Status');
  const [selectedCountry, setSelectedCountry] = useState('World');

  const SDGOptions = SDGList.map((d) => ({ label: `${d.Goal}: ${d['Goal Name']}` }));
  SDGOptions.unshift({ label: 'All SDG Status' });

  const countryOption = sortBy(CountrySDGGap.map((d) => ({ label: d['Country or Area'] })), 'label');
  countryOption.unshift({ label: 'World' });

  return (
    <>
      <PageTitle
        title='Current Gaps'
        description='Visualization of SDG gaps nationally allows for easy identification of where SDG goals are being left behind. Using up to date data, explore SDG progress in your country and which targets are at risk of not being met by 2030. These insights will be the basis for evidence-based, holistic dialogue at the national level.'
      />
      <RootEl>
        <FlexDiv>
          <SelectTitleText>Status of</SelectTitleText>
          <Select
            options={SDGOptions}
            className='selectDropDown'
            onChange={(el: any) => { setSelectedSDG(el[0].label); }}
            values={[{ label: selectedSDG }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#212121' />
          </IconEl>
          <SelectTitleText>in</SelectTitleText>
          <Select
            options={countryOption}
            className='selectDropDown'
            onChange={(el: any) => { setSelectedCountry(el[0].label); }}
            values={[{ label: selectedCountry }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#212121' />
          </IconEl>
        </FlexDiv>
        {
          selectedSDG !== 'All SDG Status' ? (
            <Banner
              color={selectedCountry === 'World'
                ? WorldSDGGap[WorldSDGGap.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Status === 'Identified Gap' ? 'red'
                  : WorldSDGGap[WorldSDGGap.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Status === 'On Track' ? 'green'
                    : 'yellow'
                : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data'][CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data'].findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Status === 'Identified Gap' ? 'red'
                  : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data'][CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data'].findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Status === 'On Track' ? 'green'
                    : 'yellow'}
              content={(
                <>
                  <span className='bold'>{selectedCountry}</span>
                  {' '}
                  is
                  {' '}
                  <span className='bold'>
                    {selectedCountry === 'World'
                      ? WorldSDGGap[WorldSDGGap.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Status : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data'][CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data'].findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Status}
                  </span>
                  {' '}
                  to achieve the
                  {' '}
                  <span className='bold'>{selectedSDG}</span>
                </>
            )}
            />
          ) : null
        }
        <RowEl>
          <DonutChartCard
            title={selectedSDG === 'All SDG Status' ? 'SDG Gaps Overview' : 'Target Gaps Overview'}
            centralText={selectedSDG === 'All SDG Status' ? 'SDG Goals' : 'Targets'}
            selectedSDG={selectedSDG}
            data={selectedCountry === 'World' ? WorldSDGGap : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data']}
          />
          {
            selectedSDG === 'All SDG Status'
              ? (
                <SDGGapsList
                  data={selectedCountry === 'World' ? WorldSDGGap : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data']}
                />
              )
              : (
                <TargetGapsList
                  selectedSDG={selectedSDG}
                  data={selectedCountry === 'World' ? WorldSDGGap : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data']}
                />
              )
          }
        </RowEl>
        {
            selectedSDG === 'All SDG Status'
              ? (
                <TargetStatusCard
                  data={selectedCountry === 'World' ? WorldSDGGap : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data']}
                  country={selectedCountry}
                  SDGOptions={SDGOptions}
                  setSelectedSDG={setSelectedSDG}
                />
              ) : (
                <>
                  <SectionTitle title={(
                    <>
                      All Target from
                      {' '}
                      <span className='bold'>{selectedSDG}</span>
                      {' '}
                      for
                      {' '}
                      <span className='bold'>{selectedCountry}</span>
                    </>
                    )}
                  />
                  <IndicatorStatusCard
                    data={selectedCountry === 'World' ? WorldSDGGap : CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data']}
                    selectedSDG={selectedSDG}
                  />
                </>
              )
        }
        <MapViz
          showMap={selectedCountry === 'World'}
          data={CountrySDGGap}
          selectedSDG={selectedSDG}
        />
      </RootEl>
    </>
  );
};
