import { useState } from 'react';
import Select from 'react-dropdown-select';
import styled from 'styled-components';
import { CaretDown } from '../../icons';
import { CountryListTypeSDGPush, SelectOption } from '../../Types';
import { LineChart } from './LineChart';

const SDGPushData: CountryListTypeSDGPush[] = require('../../Data/countrySDGPush.json');
const WorldSDGPushData: CountryListTypeSDGPush = require('../../Data/worldSDGPush.json');

interface Props {
  pageIndicator: string;
  indicatorOptions: SelectOption[];
}

const RootEl = styled.div`
  display: flex;
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

const ColumnEl = styled.div`
  width: 50%;
  &:first-of-type {
    width: calc(50% - 2rem);
    padding-right: 2rem;
  }
`;

interface ColorProps {
  color: string;
}

const KeyEl = styled.div<ColorProps>`
  color: ${(props) => props.color};
  margin: 2rem 0 0.5rem 0;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.6rem;
`;

const ColorCircle = styled.div<ColorProps>`
  background-color: ${(props) => props.color};
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 0.7rem;
`;

const SelectTitleText = styled.div`
  margin-right: 1rem;
`;

export const LineChartViz = (props: Props) => {
  const { pageIndicator, indicatorOptions } = props;
  const [indicatorForLineChart, setIndicatorForLineChart] = useState(pageIndicator);
  const [country, setCountry] = useState('World');
  const countryList = SDGPushData.map((d) => (
    {
      label: d['Country or Area'],
    }
  )).sort((a, b) => a.label.localeCompare(b.label));
  countryList.unshift({ label: 'World' });
  return (
    <RootEl>
      <ColumnEl>
        <LineEl />
        <FlexDiv>
          <SelectTitleText>Country Wide Gaps for</SelectTitleText>
          <Select
            options={indicatorOptions}
            className='selectDropDown'
            onChange={(el: any) => { setIndicatorForLineChart(el[0].label); }}
            values={[{ label: indicatorForLineChart }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#212121' />
          </IconEl>
          <SelectTitleText>for</SelectTitleText>
          <Select
            options={countryList}
            className='selectDropDown'
            onChange={(el: any) => { setCountry(el[0].label); }}
            values={[{ label: country }]}
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
        <div>
          <KeyEl color='var(--accent-green)'>
            <ColorCircle color='var(--accent-green)' />
            <div>With SDG Push</div>
          </KeyEl>
          <div className='italics'>
            The ‘SDG Push’ scenario outlines the impact of targeted policy interventions that can accelerate progress towards a more fair, resilient and green future.
          </div>
          <KeyEl color='var(--accent-red)'>
            <ColorCircle color='var(--accent-red)' />
            <div>Without SDG Push</div>
          </KeyEl>
          <div className='italics'>
            The ‘Without SDG Push’ scenario outlines the changes without any targeted policy interventions.
          </div>
        </div>
      </ColumnEl>
      <ColumnEl>
        <LineChart
          data={country === 'World' ? WorldSDGPushData : SDGPushData[SDGPushData.findIndex((d) => d['Country or Area'] === country)]}
          indicator={indicatorForLineChart}
        />
      </ColumnEl>
    </RootEl>
  );
};
