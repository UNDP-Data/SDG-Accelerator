// import maxBy from 'lodash.maxby';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import { useState } from 'react';
import { getSDGIconWOText } from '../utils/getSDGIconNoText';
import { getSDGIconOnlyText } from '../utils/getSDGIconOnlyText';
// import SDGGoalList from '../Data/SDGGoalList.json';

interface Props {
  data: any;
}

interface SDGCardProps {
  bgColor: string;
}

const SDGCardEl = styled.div<SDGCardProps>`
  padding: 2rem;
  border-radius: 0.2rem;
  background-color: ${(props) => props.bgColor};
  color: #fff;
  width: calc(33.33% - 4rem);
  margin: 2rem;
  max-height: 50rem;
  overflow-y: auto;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PriorityDot = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 1.6rem;
  background-color: #fff;
  margin-right: 0.8rem;
  margin-bottom: 0.8rem;
`;

const PriorityDotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SubNote = styled.div`
  font-size: 1.4rem;
  font-style: italic;
  color: #fff;
  opacity: 0.7;
  margin-top:0.8rem; 
`;

const HeadEl = styled.div`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

export const PrioritiesVizCard = (props: Props) => {
  const { data } = props;
  const dataFormatted = sortBy(Object.keys(data), (d) => parseInt(d.split(' ')[1], 10)).map((d) => ({
    priorityType: d,
    priorities: data[d],
  }));
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const colorArray = [
    '#006EB5',
    '#e5243b',
    '#DDA63A',
    '#4C9F38',
    '#C5192D',
    '#FF3A21',
    '#26BDE2',
    '#FCC30B',
    '#A21942',
    '#FD6925',
    '#DD1367',
    '#FD9D24',
    '#BF8B2E',
    '#3F7E44',
    '#0A97D9',
    '#56C02B',
    '#00689D',
    '#19486A',
  ];
  return (
    <>
      <CardContainer>
        {
          dataFormatted.map((d, i) => (
            <>
              {
                selectedGoal === d.priorityType ? (
                  <SDGCardEl onClick={() => { setSelectedGoal(null); }} bgColor={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]} key={i}>
                    <HeadEl>
                      Piorities for
                      {' '}
                      <span className='bold'>{d.priorityType}</span>
                    </HeadEl>
                    <ul>
                      {
                        d.priorities.map((el: string, ind: number) => <li key={ind}>{el}</li>)
                      }
                    </ul>
                  </SDGCardEl>
                )
                  : (
                    <SDGCardEl onClick={() => { setSelectedGoal(d.priorityType); }} bgColor={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]} key={i}>
                      {getSDGIconOnlyText(d.priorityType)}
                      <PriorityDotsContainer>
                        {
                          d.priorities.map((_el: string, ind: number) => <PriorityDot key={ind} />)
                        }
                      </PriorityDotsContainer>
                      <SubNote>Click on the card to see the priorities</SubNote>
                      {getSDGIconWOText(d.priorityType)}
                    </SDGCardEl>
                  )
              }
            </>
          ))
        }
      </CardContainer>
    </>
  );
};
