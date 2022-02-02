import { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import sortBy from 'lodash.sortby';
import { PageTitle } from '../Components/PageTitle';
import { CountryListType, LinkageDataType, SDGStatusListType } from '../Types';
import { CaretDown } from '../icons';
import { InterlinkagesViz } from './InterlinkageViz';
import { Tag } from '../Components/Tag';

const LinkageData:LinkageDataType[] = require('../Data/linkages.json');
const CountrySDGGap:CountryListType[] = require('../Data/countrySDGGapData.json');
const WorldSDGGap:SDGStatusListType[] = require('../Data/worldSdgGap.json');

interface TargetStatusType {
  target: string;
  status: 'On Track' | 'Identified Gap' | 'For Review';
}

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

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 2rem 0 5rem 0;
`;

const MostLinkageCard = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  width: calc(25% - 5rem);
`;

const HighestAccCard = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  width: calc(75% - 5rem);
`;

const CardTitle = styled.div`
  text-transform: uppercase;
  margin-bottom: 2rem;
  font-size: 1.6rem;
  font-weight: bold;
`;

const ValueEl = styled.div`
  display: flex;
  align-items: center;
`;

const ValueText = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const ValueContainer = styled.div`
  display: flex;
`;

const HighestAccValueEl = styled.div`
  display: flex;
  align-items: center;
  width: 33.33%;
`;

const SelectTitleText = styled.div`
  margin-right: 1rem;
`;

export const Interlinkages = () => {
  const [selectedTarget, setSelectedTarget] = useState('All Targets');
  const [selectedCountry, setSelectedCountry] = useState('World');
  const [linkageType, setLinkageTypes] = useState<'synergies' | 'tradeOffs'>('synergies');
  const targetOptions = [{ label: 'All Targets' }];

  WorldSDGGap.forEach((goal) => {
    goal.Targets.forEach((target) => {
      targetOptions.push({ label: `${target.Target}: ${target['Target Description']}` });
    });
  });

  const countryOption = sortBy(CountrySDGGap.map((d) => ({ label: d['Country or Area'] })), 'label');
  countryOption.unshift({ label: 'World' });
  let TargetMostSynergies = '';
  let mostSynergies = 0;
  LinkageData.forEach((d) => {
    TargetMostSynergies = d.synergies.length > mostSynergies ? d.id : TargetMostSynergies;
    mostSynergies = d.synergies.length > mostSynergies ? d.synergies.length : mostSynergies;
  });
  const targetStatus: TargetStatusType[] = [];
  if (selectedCountry === 'World') {
    WorldSDGGap.forEach((goal) => {
      goal.Targets.forEach((target) => {
        targetStatus.push({
          target: target.Target,
          status: target.Status,
        });
      });
    });
  } else {
    CountrySDGGap[CountrySDGGap.findIndex((d) => d['Country or Area'] === selectedCountry)]['SDG Gap Data'].forEach((goal) => {
      goal.Targets.forEach((target) => {
        targetStatus.push({
          target: target.Target,
          status: target.Status,
        });
      });
    });
  }
  const potential = LinkageData.map((d) => {
    let onTrack = 0;
    let forReview = 0;
    let identifiedGap = 0;
    d.synergies.forEach((el) => {
      if (targetStatus[targetStatus.findIndex((target) => target.target === `Target ${el}`)].status === 'On Track') onTrack += 1;
      if (targetStatus[targetStatus.findIndex((target) => target.target === `Target ${el}`)].status === 'For Review') forReview += 1;
      if (targetStatus[targetStatus.findIndex((target) => target.target === `Target ${el}`)].status === 'Identified Gap') identifiedGap += 1;
    });
    return ({
      id: d.id,
      onTrack,
      forReview,
      identifiedGap,
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
            <SelectTitleText>Target Linkages:</SelectTitleText>
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
          </TitleEl>
        </FlexDiv>
        <SummaryContainer>
          <MostLinkageCard>
            <CardTitle>Target With Most Synergies</CardTitle>
            <ValueEl>
              <ValueText>{TargetMostSynergies.split(' ')[1]}</ValueText>
              <Tag
                backgroundColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status === 'On Track' ? 'var(--accent-green)'
                    : targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status === 'Identified Gap' ? 'var(--accent-red)' : 'var(--accent-yellow)'
                }
                fontColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status !== 'For Review' ? 'var(--white)' : 'var(--black)'
                }
                text={targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status}
              />
            </ValueEl>
          </MostLinkageCard>
          <HighestAccCard>
            <CardTitle>Top 3 Target Interlinkages with the highest acceleration potential</CardTitle>
            <ValueContainer>
              <HighestAccValueEl>
                <ValueText>{sortBy(potential, ['identifiedGap', 'forReview']).reverse()[0].id.split(' ')[1]}</ValueText>
                <Tag
                  backgroundColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[0].id)].status === 'On Track' ? 'var(--accent-green)'
                    : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[0].id)].status === 'Identified Gap' ? 'var(--accent-red)' : 'var(--accent-yellow)'
                }
                  fontColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[0].id)].status !== 'For Review' ? 'var(--white)' : 'var(--black)'
                }
                  text={targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[0].id)].status}
                />
              </HighestAccValueEl>
              <HighestAccValueEl>
                <ValueText>{sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id.split(' ')[1]}</ValueText>
                <Tag
                  backgroundColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'On Track' ? 'var(--accent-green)'
                    : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'Identified Gap' ? 'var(--accent-red)' : 'var(--accent-yellow)'
                }
                  fontColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status !== 'For Review' ? 'var(--white)' : 'var(--black)'
                }
                  text={targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status}
                />
              </HighestAccValueEl>
              <HighestAccValueEl>
                <ValueText>{sortBy(potential, ['identifiedGap', 'forReview']).reverse()[2].id.split(' ')[1]}</ValueText>
                <Tag
                  backgroundColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[2].id)].status === 'On Track' ? 'var(--accent-green)'
                    : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[2].id)].status === 'Identified Gap' ? 'var(--accent-red)' : 'var(--accent-yellow)'
                }
                  fontColor={
                  targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[2].id)].status !== 'For Review' ? 'var(--white)' : 'var(--black)'
                }
                  text={targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[2].id)].status}
                />
              </HighestAccValueEl>
            </ValueContainer>
          </HighestAccCard>
        </SummaryContainer>
        <FlexDiv>
          <TitleEl>
            <SelectTitleText>
              Target Status and Interlinkages for
              {' '}
              <span className='bold'>{selectedCountry}</span>
              :
            </SelectTitleText>
            <Select
              options={targetOptions}
              className='selectDropDown'
              onChange={(el: any) => { setSelectedTarget(el[0].label); }}
              values={[{ label: selectedTarget }]}
              labelField='label'
              valueField='label'
              dropdownHeight='250px'
              dropdownPosition='auto'
              dropdownGap={2}
            />
            <IconEl>
              <CaretDown size={24} color='#212121' />
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
          selectedCountry={selectedCountry}
          countrySDGGap={CountrySDGGap}
          worldSDGGap={WorldSDGGap}
          linkageData={LinkageData}
        />
      </RootEl>
    </div>
  );
};
