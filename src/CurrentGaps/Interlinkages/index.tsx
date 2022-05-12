import { useState } from 'react';
import styled from 'styled-components';
import sortBy from 'lodash.sortby';
import { Radio, Select } from 'antd';
import { LinkageDataType } from '../../Types';
import { CaretDown } from '../../icons';
import { InterlinkagesViz } from './InterlinkageViz';
import { Tag } from '../../Components/Tag';

const LinkageData:LinkageDataType[] = require('../../Data/linkages.json');

interface Props {
  data: any;
}
interface TargetStatusType {
  target: string;
  status: 'On Track' | 'Identified Gap' | 'For Review' | undefined;
}

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 0 auto;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: -2rem -2rem 2rem -2rem;
  padding: 2rem;
  background-color: var(--black-300);
`;

const TitleEl = styled.div`
  align-items: center;
  flex-wrap: wrap;
`;

const TitleUnit = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`;

const SubNoteDiv = styled.div`
  font-size: 1.6rem;
  font-weight: normal;
  color: var(--black-500);
  font-style:italic;
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 2rem 0;
`;

const MostLinkageCard = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  width: calc(33% - 1rem);
`;

const HighestAccCard = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  width: calc(67% - 1rem);
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

const H3 = styled.div`
  margin: 0 1rem 0 0;
  font-weight: 400;
`;

const ContainerEl = styled.div`
  background-color: var(--black-200);
  padding: 2rem;
`;

export const Interlinkages = (props: Props) => {
  const { data } = props;
  const [selectedTarget, setSelectedTarget] = useState('All Targets');
  const [linkageType, setLinkageTypes] = useState<'synergies' | 'tradeOffs'>('synergies');
  const targetOptions = [{ label: 'All Targets' }];

  data.forEach((goal: any) => {
    goal.Targets.forEach((target: any) => {
      targetOptions.push({ label: `${target.Target}: ${target['Target Description']}` });
    });
  });
  let TargetMostSynergies = '';
  let mostSynergies = 0;
  LinkageData.forEach((d) => {
    TargetMostSynergies = d.synergies.length > mostSynergies ? d.id : TargetMostSynergies;
    mostSynergies = d.synergies.length > mostSynergies ? d.synergies.length : mostSynergies;
  });
  const targetStatus: TargetStatusType[] = [];
  data.forEach((goal: any) => {
    goal.Targets.forEach((target: any) => {
      targetStatus.push({
        target: target.Target,
        status: target.Status,
      });
    });
  });
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
    <>
      <div>
        <RootEl>
          <SummaryContainer>
            <MostLinkageCard>
              <CardTitle>Target With Most Synergies</CardTitle>
              <ValueEl>
                <ValueText>{TargetMostSynergies.split(' ')[1]}</ValueText>
                <Tag
                  backgroundColor={
                    targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status === 'On Track' ? 'var(--accent-green)'
                      : targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status === 'Identified Gap' ? 'var(--accent-red)'
                        : targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status === undefined ? 'var(--black-500)' : 'var(--accent-yellow)'
                  }
                  fontColor={
                    targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status !== 'For Review' && targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status ? 'var(--white)' : 'var(--black)'
                  }
                  text={targetStatus[targetStatus.findIndex((d) => d.target === TargetMostSynergies)].status || 'Gap Unidentified'}
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
                      targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'On Track' ? 'var(--accent-green)'
                        : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'Identified Gap' ? 'var(--accent-red)'
                          : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === undefined ? 'var(--black-500)' : 'var(--accent-yellow)'
                    }
                    fontColor={
                      targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status !== 'For Review' && targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status ? 'var(--white)' : 'var(--black)'
                    }
                    text={targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[0].id)].status || 'Gap Unidentified'}
                  />
                </HighestAccValueEl>
                <HighestAccValueEl>
                  <ValueText>{sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id.split(' ')[1]}</ValueText>
                  <Tag
                    backgroundColor={
                      targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'On Track' ? 'var(--accent-green)'
                        : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'Identified Gap' ? 'var(--accent-red)'
                          : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === undefined ? 'var(--black-500)' : 'var(--accent-yellow)'
                    }
                    fontColor={
                      targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status !== 'For Review' && targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status ? 'var(--white)' : 'var(--black)'
                    }
                    text={targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status || 'Gap Unidentified'}
                  />
                </HighestAccValueEl>
                <HighestAccValueEl>
                  <ValueText>{sortBy(potential, ['identifiedGap', 'forReview']).reverse()[2].id.split(' ')[1]}</ValueText>
                  <Tag
                    backgroundColor={
                      targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'On Track' ? 'var(--accent-green)'
                        : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === 'Identified Gap' ? 'var(--accent-red)'
                          : targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status === undefined ? 'var(--black-500)' : 'var(--accent-yellow)'
                    }
                    fontColor={
                      targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status !== 'For Review' && targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[1].id)].status ? 'var(--white)' : 'var(--black)'
                    }
                    text={targetStatus[targetStatus.findIndex((d) => d.target === sortBy(potential, ['identifiedGap', 'forReview']).reverse()[2].id)].status || 'Gap Unidentified'}
                  />
                </HighestAccValueEl>
              </ValueContainer>
            </HighestAccCard>
          </SummaryContainer>
          <ContainerEl>
            <FlexDiv>
              <TitleEl>
                <TitleUnit>
                  <H3>
                    Target Status and Interlinkages:
                  </H3>
                  <Select
                    onChange={(el) => { setSelectedTarget(el); }}
                    value={selectedTarget}
                    className='targetSelector'
                    suffixIcon={<div style={{ marginTop: '-0.2rem' }}><CaretDown size={24} color='#0969FA' /></div>}
                  >
                    {
                      targetOptions.map((d) => <Select.Option value={d.label}>{d.label}</Select.Option>)
                    }
                  </Select>
                </TitleUnit>
                <SubNoteDiv>
                  Hover or click on the target to see the interlinkages
                </SubNoteDiv>
              </TitleEl>
              <Radio.Group onChange={(d) => { setLinkageTypes(d.target.value); }} value={linkageType} buttonStyle='solid' size='large'>
                <Radio.Button value='synergies'>Synergies</Radio.Button>
                <Radio.Button value='tradeOffs'>Trade Offs</Radio.Button>
              </Radio.Group>
            </FlexDiv>
            <InterlinkagesViz
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
              linkageType={linkageType}
              data={data}
              linkageData={LinkageData}
            />
          </ContainerEl>
        </RootEl>
      </div>
    </>
  );
};
