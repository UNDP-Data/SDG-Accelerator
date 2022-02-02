import { useState } from 'react';
import Select from 'react-dropdown-select';
import styled from 'styled-components';
import { CaretDown } from '../../icons';
import { CountryListTypeSDGPush, SelectOption } from '../../Types';
import { DumbellChart } from './DumbellChart';

const SDGPushData: CountryListTypeSDGPush[] = require('../../Data/countrySDGPush.json');
const WorldSDGPushData: CountryListTypeSDGPush = require('../../Data/worldSDGPush.json');

interface Props {
  pageIndicator: string;
  indicatorOptions: SelectOption[];
}

interface SortOptionsType {
  label: 'Country Name' | 'Changes With and Without SDG Push' | 'Value With SDG Push' | 'Value Without SDG Push';
}

const RootEl = styled.div`
  margin: 7rem 0 0 0;
`;

const LineEl = styled.div`
  width: 5rem;
  height: 0.2rem;
  margin-bottom: 1rem;
  background-color: var(--primary-blue);
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.4rem;
  flex-wrap: wrap;
`;

const IconEl = styled.div`
  height: 2.4rem;
  margin-left: -1.9rem;
  margin-right: 1rem;
`;

const SelectTitleText = styled.div`
  margin-right: 1rem;
`;

export const DumbellChartViz = (props: Props) => {
  const { pageIndicator, indicatorOptions } = props;
  const sortingOptions: SortOptionsType[] = [
    {
      label: 'Country Name',
    },
    {
      label: 'Changes With and Without SDG Push',
    },
    {
      label: 'Value With SDG Push',
    },
    {
      label: 'Value Without SDG Push',
    },
  ];
  const years = SDGPushData[0].Data[0].yearlyData.map((d) => ({ label: d.year }));
  const [selectedYear, setSelectedYear] = useState<number>(years[0].label);
  const [sortedBy, setSortedBy] = useState<'Country Name' | 'Changes With and Without SDG Push' | 'Value With SDG Push' | 'Value Without SDG Push'>(sortingOptions[0].label);
  const [indicatorForDumbellChart, setIndicatorForDumbellChart] = useState(pageIndicator);

  return (
    <RootEl>
      <LineEl />
      <FlexDiv>
        <SelectTitleText>Changes in</SelectTitleText>
        <Select
          options={indicatorOptions}
          className='selectDropDown'
          onChange={(el: any) => { setIndicatorForDumbellChart(el[0].label); }}
          values={[{ label: indicatorForDumbellChart }]}
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
          options={years}
          className='selectDropDown'
          onChange={(el: any) => { setSelectedYear(el[0].label); }}
          values={[{ label: selectedYear }]}
          labelField='label'
          valueField='label'
          dropdownHeight='250px'
          dropdownPosition='auto'
          dropdownGap={2}
        />
        <IconEl>
          <CaretDown size={24} color='#212121' />
        </IconEl>
        <SelectTitleText>sorted by</SelectTitleText>
        <Select
          options={sortingOptions}
          className='selectDropDown'
          onChange={(el: any) => { setSortedBy(el[0].label); }}
          values={[{ label: sortedBy }]}
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
      <DumbellChart
        data={SDGPushData}
        worldData={WorldSDGPushData}
        indicator={indicatorForDumbellChart}
        year={selectedYear}
        sortedBy={sortedBy}
      />
    </RootEl>
  );
};
