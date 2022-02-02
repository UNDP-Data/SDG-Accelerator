import { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import { CaretDown } from '../icons';
import { Banner } from '../Components/Banner';
import { Tag } from '../Components/Tag';
import { SDGStatusListType, DropdownOptionTypes } from '../Types';

interface Props {
  country: string;
  setSelectedSDG: any;
  SDGOptions: DropdownOptionTypes[];
  data: SDGStatusListType[];
}
const RootEl = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  margin-bottom: 2rem;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.4rem;
  flex-wrap: wrap;
`;

const TitleEl = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const IconEl = styled.div`
  height: 2.4rem;
  margin-left: -1.5rem;
  margin-right: 1rem;
`;

const TargetListEl = styled.div`
  background-color: var(--black-100);
  border: 1px solid var(--black-300);
  border-radius: 2px;
  margin: 1rem 0;
  font-size: 1.6rem;
  color: var(--black-700);
  padding: 1.5rem 2rem;
`;

const ListHeadEl = styled.div`
  display: flex;
  align-items: center;
`;

const H4 = styled.h4`
  margin:0;
`;

const ListBodyEl = styled.div`
  margin-top: 1.5rem;
`;

const SelectTitleText = styled.div`
  margin-right: 1rem;
`;

export const TargetStatusCard = (props: Props) => {
  const {
    data,
    country,
    SDGOptions,
    setSelectedSDG,
  } = props;
  const [selectedSDGForModule, setSelectedSDGForModule] = useState('SDG 1: No Poverty');
  const selectedSDGStatus = data[data.findIndex((d) => d.Goal === selectedSDGForModule.split(':')[0])].Status;
  return (
    <RootEl>
      <TitleEl>
        <FlexDiv>
          <SelectTitleText>Target Overview for</SelectTitleText>
          <Select
            options={SDGOptions.slice(1, -1)}
            className='selectDropDown'
            onChange={(el: any) => { setSelectedSDGForModule(el[0].label); }}
            values={[{ label: selectedSDGForModule }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#212121' />
          </IconEl>
          <div>
            for
            {' '}
            <span className='bold'>{country}</span>
          </div>
        </FlexDiv>
        <button className='secondary' type='button' onClick={() => setSelectedSDG(selectedSDGForModule)}>Learn More</button>
      </TitleEl>
      <>
        <Banner
          color={selectedSDGStatus === 'On Track' ? 'green' : selectedSDGStatus === 'Identified Gap' ? 'red' : 'yellow'}
          content={(
            <>
              <span className='bold'>{country}</span>
              {' '}
              is
              {' '}
              <span className='bold'>{selectedSDGStatus}</span>
              {' '}
              to achieve the
              {' '}
              <span className='bold'>{selectedSDGForModule}</span>
            </>
          )}
        />
        {
          data[data.findIndex((d) => d.Goal === selectedSDGForModule.split(':')[0])].Targets.map((d, i) => (
            <TargetListEl key={i}>
              <ListHeadEl>
                <H4>
                  {d.Target}
                </H4>
                <Tag
                  backgroundColor={d.Status === 'On Track' ? 'var(--accent-green)' : d.Status === 'Identified Gap' ? 'var(--accent-red)' : 'var(--accent-yellow)'}
                  text={d.Status}
                  fontColor={d.Status === 'For Review' ? 'var(--black)' : 'var(--white)'}
                />
              </ListHeadEl>
              <ListBodyEl>
                {d['Target Description']}
              </ListBodyEl>
            </TargetListEl>
          ))
        }
      </>
    </RootEl>
  );
};
