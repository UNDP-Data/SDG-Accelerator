import { useEffect, useRef, useState } from 'react';
import Select from 'react-dropdown-select';
import ReactSlider from 'react-slider';
import styled from 'styled-components';
import { CaretDown, PauseIcon, PlayIcon } from '../../icons';
import { CountryListTypeSDGPush, SelectOption } from '../../Types';
import { Map } from './Map';

const SDGPushData: CountryListTypeSDGPush[] = require('../../Data/countrySDGPush.json');

interface Props {
  pageIndicator: string;
  indicatorOptions: SelectOption[];
}

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

const P = styled.p`
  font-weight: 1.6rem;
  color: var(--black-700);
  line-height: 2.4rem;
`;

const ButtonDiv = styled.div`
  margin: 2rem 0 0 -0.5rem;
`;

const TimeSliderUnitEl = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 2rem);
  font-size: 1.4rem;
  color: var(--black-550);
  padding: 1rem;
  position: relative;
  z-index: 100;
  background-color: var(--blue-very-light);
`;

const YearsEl = styled.div`
  margin: 0.2rem 1rem 0 1rem;
  color: var(--black-550);
`;

const StyledThumb = styled.div`
  padding: 0.1rem 1rem;
  font-size: 1.2rem;
  text-align: center;
  background-color: #fff;
  color: var(--blue-medium);
  font-weight: bold;
  box-shadow: var(--shadow);
  border-radius: 2rem;
  border: 1px solid var(--blue-medium);
  cursor: grab;
  margin-top: 0.9rem;
`;

const Thumb = (props: any, state: any) => {
  // eslint-disable-next-line react/destructuring-assignment
  const val = state.valueNow;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledThumb {...props}>
      {val}
    </StyledThumb>
  );
};

const Button = styled.button`
  background-color: transparent;
  border: 0;
`;

const SelectTitleText = styled.div`
  margin-right: 1rem;
`;

export const MapViz = (props: Props) => {
  const { pageIndicator, indicatorOptions } = props;
  const years = SDGPushData[0].Data[0].yearlyData.map((d) => d.year);
  const [play, setPlay] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [indicatorForMap, setIndicatorForMap] = useState(pageIndicator);
  // eslint-disable-next-line no-undef
  const timer: { current: NodeJS.Timeout | null } = useRef(null);
  useEffect(() => {
    if (play && years) {
      timer.current = setInterval(() => {
        setSelectedYear((prevCounter) => (prevCounter ? prevCounter === years[years.length - 1] ? years[0] : prevCounter + 1 : 2000));
      }, 1000);
    }

    if (!play && timer.current) clearInterval(timer.current);
  }, [play]);
  return (
    <>
      <FlexDiv>
        <SelectTitleText>Global Scenario With and Without SDG Push for</SelectTitleText>
        <Select
          options={indicatorOptions}
          className='selectDropDown'
          onChange={(el: any) => { setIndicatorForMap(el[0].label); }}
          values={[{ label: indicatorForMap }]}
          labelField='label'
          valueField='label'
          dropdownHeight='250px'
          dropdownPosition='auto'
          dropdownGap={2}
        />
        <IconEl>
          <CaretDown size={24} color='#110848' />
        </IconEl>
      </FlexDiv>
      <P>
        By using scenario modeling, the study shows how governments can make choices today that have the greatest potential to boost progress in the future, within planetary boundaries. The ‘SDG Push’ scenario outlines the impact of targeted policy interventions that can accelerate progress towards a more fair, resilient and green future
      </P>
      <ButtonDiv>
        <button type='button' className='secondary'>Learn More About SDG Push</button>
      </ButtonDiv>
      <Map
        data={SDGPushData}
        year={selectedYear}
        indicator={indicatorForMap}
      />
      <TimeSliderUnitEl>
        <Button type='button' onClick={() => { setPlay(!play); }}>
          {
            play
              ? <PauseIcon size={24} color='#018EFF' />
              : <PlayIcon size={24} color='#018EFF' />
          }
        </Button>
        <YearsEl>{years[0]}</YearsEl>
        <ReactSlider
          min={years[0]}
          max={years[years.length - 1]}
          step={1}
          value={selectedYear}
          className='horizontal-slider'
          trackClassName='year-slider-track'
          renderThumb={Thumb}
          onChange={(d) => { setSelectedYear(d); }}
        />
        <YearsEl>{years[years.length - 1]}</YearsEl>
      </TimeSliderUnitEl>
    </>
  );
};
