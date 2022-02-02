import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import { Map } from './Map';
import { CaretDown } from '../../icons';
import { Banner } from '../../Components/Banner';
import { CountryListType, SDGListType } from '../../Types';

const SDGGoalList:SDGListType[] = require('../../Data/SDGGoalList.json');

interface Props {
  data: CountryListType[];
  selectedSDG: string;
  showMap: boolean;
}

const TitleEl = styled.div`
  margin: 5rem 0 0 0;
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
  margin-left: -1.5rem;
  margin-right: 1rem;
`;

const SelectTitleText = styled.div`
  margin-right: 1rem;
`;

export const MapViz = (props: Props) => {
  const { data, selectedSDG, showMap } = props;
  const [selectedOption, setSelectedOption] = useState<string>(selectedSDG === 'All SDG Status' ? 'SDG 1: No Poverty' : selectedSDG);
  const SDGOptionsAllSDG = selectedSDG === 'All SDG Status' ? SDGGoalList.map((d) => ({ label: `${d.Goal}: ${d['Goal Name']}` })) : null;
  const SDGOptions = [];
  if (selectedSDG !== 'All SDG Status') {
    const sdg = SDGGoalList[SDGGoalList.findIndex((d) => d.Goal === selectedSDG.split(':')[0])];
    SDGOptions.push({ label: `${sdg.Goal}: ${sdg['Goal Name']}` });
    const targets = sdg.Targets;
    targets.forEach((d) => {
      SDGOptions.push({ label: `${d.Target}: ${d['Target Description']}` });
      d.Indicators.forEach((el) => {
        SDGOptions.push({ label: `${el.Indicator}: ${el['Indicator Description']}` });
      });
    });
  }
  useEffect(() => {
    if (selectedSDG === 'All SDG Status') setSelectedOption('SDG 1: No Poverty');
    else setSelectedOption(selectedSDG);
  }, [selectedSDG]);
  return (
    <>
      <TitleEl>
        <LineEl />
        <FlexDiv>
          <SelectTitleText>Country Wide Gaps for</SelectTitleText>
          <Select
            options={SDGOptionsAllSDG || SDGOptions}
            className='selectDropDown'
            onChange={(el: any) => { setSelectedOption(el[0].label); }}
            values={[{ label: selectedOption }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            searchable
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#212121' />
          </IconEl>
        </FlexDiv>
      </TitleEl>
      {
        showMap
          ? (
            <Map
              data={data}
              selectedOption={selectedOption}
            />
          )
          : (
            <Banner
              color='red'
              content={(
                <>
                  <div style={{ textAlign: 'center' }}>This view is only available at the world level. To Switch to world view change the the country on the top of the page</div>
                </>
            )}
            />
          )
      }
    </>
  );
};
