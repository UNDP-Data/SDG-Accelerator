import { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import { PageTitle } from '../Components/PageTitle';
import { SDGStatusListType } from '../Types';
import { CaretDown } from '../icons';
import { InterlinkagesViz } from './InterlinkageViz';

const WorldSDGGap:SDGStatusListType[] = require('../Data/worldSdgGap.json');

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 0 auto;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.4rem;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const TitleEl = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const SubNoteDiv = styled.div`
  font-size: 1.6rem;
  font-weight: normal;
  color: var(--black-400);
  font-style:italic;
  margin-bottom: 2rem;
`;

const IconEl = styled.div`
  height: 2.4rem;
  margin-left: -1.5rem;
  margin-right: 1rem;
`;

const ToggleContainerEl = styled.div`
  display: flex;
  border: 2px solid var(--black-300);
  background-color: var(--black-300);
  border-radius: 10rem;
`;

interface SelectedProps {
  selected: boolean;
}

const ToggleEl = styled.div<SelectedProps>`
  padding: 1rem 2rem;
  font-size: 1.6rem;
  text-transform: uppercase;
  font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
  border-radius: 5rem;
  background-color:${(props) => (props.selected ? 'var(--primary-blue)' : 'var(--black-300)')};
  color:${(props) => (props.selected ? 'var(--white)' : 'var(--black)')};
  cursor: pointer;
`;

export const Interlinkages = () => {
  const [selectedTarget, setSelectedTarget] = useState('All Targets');
  const [linkageType, setLinkageTypes] = useState<'synergies' | 'tradeOffs'>('synergies');
  const targetOptions = [{ label: 'All Targets' }];
  WorldSDGGap.forEach((goal) => {
    goal.Targets.forEach((target) => {
      targetOptions.push({ label: `${target.Target}: ${target['Target Description']}` });
    });
  });
  return (
    <div>
      <PageTitle
        title='Target Interlinkages'
        description='Identify which targets have the biggest effect on other SDG targets, and explore which targets to pursue which have the highest positive interlinkage (“synergy”) with other SDG targets. This is an exercise in understanding how we can speed development forward in a positive and sustainable manner based on the identified gaps and priorities.'
      />
      <RootEl>
        <FlexDiv>
          <TitleEl>
            <div>Target Status and Interlinkages:</div>
            <Select
              options={targetOptions}
              className='selectDropDown'
              onChange={(el: any) => { setSelectedTarget(el[0].label); }}
              values={[{ label: selectedTarget }]}
              labelField='label'
              valueField='label'
              dropdownHeight='250px'
              dropdownPosition='auto'
              searchable
              dropdownGap={2}
            />
            <IconEl>
              <CaretDown size={24} color='#110848' />
            </IconEl>
          </TitleEl>
          <ToggleContainerEl>
            <ToggleEl selected={linkageType === 'synergies'} onClick={() => { setLinkageTypes('synergies'); }}>Synergies</ToggleEl>
            <ToggleEl selected={linkageType === 'tradeOffs'} onClick={() => { setLinkageTypes('tradeOffs'); }}>Trade Offs</ToggleEl>
          </ToggleContainerEl>
        </FlexDiv>
        <SubNoteDiv>
          Hover or click on the targeta to see the interlinkages
        </SubNoteDiv>
        <InterlinkagesViz
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
          linkageType={linkageType}
        />
      </RootEl>
    </div>
  );
};
