// import maxBy from 'lodash.maxby';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import { useState } from 'react';
import { getSDGIconWOText } from '../utils/getSDGIconNoText';
import { getSDGIconOnlyText } from '../utils/getSDGIconOnlyText';

interface Props {
  data: any;
  statuses: any;
}

interface SDGCardProps {
  bgColor: string;
}

const NoteEl = styled.div`
  font-size: 2rem;
  width: 100%;
  text-align: center;
  background-color: var(--black-200);
  color: var(--black-700);
  padding: 4.8rem;
  border-radius: 4px;
`;

const SDGCardEl = styled.div<SDGCardProps>`
  padding: 2rem;
  border-radius: 0.2rem;
  background-color: ${(props) => props.bgColor};
  color: #fff;
  width: calc(33.33% - 4rem);
  height: 42rem;
  overflow-y: auto;
  cursor: pointer;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const HeadEl = styled.div`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const FirstTitleEl = styled.div`
  font-size: 3.6rem;
  font-weight: 700;
  line-height: 4.8rem;
  margin: 4rem 0 3rem 0;
`;

const TitleEl = styled.div`
  font-size: 3.6rem;
  font-weight: 700;
  line-height: 4.8rem;
  margin: 6rem 0 3rem 0;
`;

interface MarginProps {
  marginTop: string;
  paddingBottom: string;
}

const StatusEl = styled.div<MarginProps>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  padding-bottom: ${(props) => props.paddingBottom};
  margin-top: ${(props) => props.marginTop};
`;

interface ColorProps {
  fill: string;
}

const TagEl = styled.div<ColorProps>`
  padding: 0.5rem 1rem;
  background-color: #fff;
  font-size: 1.6rem;
  font-weight: bold;
  margin-left: 1rem;
  border-radius: 2rem;
  color: ${(props) => (props.fill === 'On Track' ? 'var(--accent-green)' : props.fill === 'Identified Gap' ? 'var(--accent-red)' : props.fill === 'For Review' ? 'var(--accent-yellow)' : 'var(--black-550)')};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Tags = styled.div`
  padding: 0.5rem 1rem;
  background-color: #fff;
  font-size: 1.6rem;
  border-radius: 5px;
  color: var(--black-700);
`;

const MoreEl = styled.div`
  color: #fff;
  font-size: 1.4rem;
  font-style: italic;
  cursor: pointer;
`;

export const PrioritiesVizCard = (props: Props) => {
  const { data, statuses } = props;
  const dataFormatted = sortBy(data, 'sdg').filter((d) => d.salience > 0);
  const dataNoMention = sortBy(data, 'sdg').filter((d) => d.salience === 0);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const colorArray = [
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
      <FirstTitleEl>
        High Priorities (
        {dataFormatted.filter((d) => d.category === 'high').length}
        )
      </FirstTitleEl>
      <CardContainer>
        {
          dataFormatted.filter((d) => d.category === 'high').length > 0 ? dataFormatted.filter((d) => d.category === 'high').map((d, i) => (
            selectedGoal === d.sdg ? (
              <SDGCardEl onClick={() => { setSelectedGoal(null); }} bgColor={colorArray[d.sdg - 1]} key={i}>
                <HeadEl>
                  Key terms in the document for
                  {' '}
                  <span className='bold'>
                    SDG
                    {' '}
                    {d.sdg}
                  </span>
                </HeadEl>
                <TagsContainer>
                  {
                        d.features.map((el: string, ind: number) => <Tags key={ind}>{el}</Tags>)
                      }
                </TagsContainer>
              </SDGCardEl>
            ) : (
              <SDGCardEl onClick={() => { setSelectedGoal(d.sdg); }} bgColor={colorArray[d.sdg - 1]} key={i}>
                {getSDGIconOnlyText(`Goal ${d.sdg}`)}
                <StatusEl
                  marginTop={d.sdg !== 16 && d.sdg !== 12 ? '-4rem' : '-1.5rem'}
                  paddingBottom={d.sdg !== 16 && d.sdg !== 12 ? '3.7rem' : '1rem'}
                >
                  <div>Current Status</div>
                  <TagEl fill={statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}>{statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}</TagEl>
                </StatusEl>
                {getSDGIconWOText(`Goal ${d.sdg}`)}
                <MoreEl>Click on the card to see the related key terms</MoreEl>
              </SDGCardEl>
            )
          ))
            : <NoteEl>No SDGs mentioned in the document are high priority</NoteEl>
        }
      </CardContainer>
      <TitleEl>
        Medium Priorities (
        {dataFormatted.filter((d) => d.category === 'medium').length}
        )
      </TitleEl>
      <CardContainer>
        {
          dataFormatted.filter((d) => d.category === 'medium').length > 0 ? dataFormatted.filter((d) => d.category === 'medium').map((d, i) => (selectedGoal === d.sdg ? (
            <SDGCardEl onClick={() => { setSelectedGoal(null); }} bgColor={colorArray[d.sdg - 1]} key={i}>
              <HeadEl>
                Key terms in the document for
                {' '}
                <span className='bold'>
                  SDG
                  {' '}
                  {d.sdg}
                </span>
              </HeadEl>
              <TagsContainer>
                {
                  d.features.map((el: string, ind: number) => <Tags key={ind}>{el}</Tags>)
                }
              </TagsContainer>
            </SDGCardEl>
          ) : (
            <SDGCardEl onClick={() => { setSelectedGoal(d.sdg); }} bgColor={colorArray[d.sdg - 1]} key={i}>
              {getSDGIconOnlyText(`Goal ${d.sdg}`)}
              <StatusEl
                marginTop={d.sdg !== 16 && d.sdg !== 12 ? '-4rem' : '-1.5rem'}
                paddingBottom={d.sdg !== 16 && d.sdg !== 12 ? '3.7rem' : '1rem'}
              >
                <div>Current Status</div>
                <TagEl fill={statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}>{statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}</TagEl>
              </StatusEl>
              {getSDGIconWOText(`Goal ${d.sdg}`)}
              <MoreEl>Click on the card to see the related key terms</MoreEl>
            </SDGCardEl>
          )))
            : <NoteEl>No SDGs mentioned in the document are medium priority</NoteEl>
        }
      </CardContainer>
      <TitleEl>
        Low Priorities (
        {dataFormatted.filter((d) => d.category === 'low').length}
        )
      </TitleEl>
      <CardContainer>
        {
          dataFormatted.filter((d) => d.category === 'low').length > 0 ? dataFormatted.filter((d) => d.category === 'low').map((d, i) => (selectedGoal === d.sdg ? (
            <SDGCardEl onClick={() => { setSelectedGoal(null); }} bgColor={colorArray[d.sdg - 1]} key={i}>
              <HeadEl>
                Key terms in the document for
                {' '}
                <span className='bold'>
                  SDG
                  {' '}
                  {d.sdg}
                </span>
              </HeadEl>
              <TagsContainer>
                {
                        d.features.map((el: string, ind: number) => <Tags key={ind}>{el}</Tags>)
                      }
              </TagsContainer>
            </SDGCardEl>
          ) : (
            <SDGCardEl onClick={() => { setSelectedGoal(d.sdg); }} bgColor={colorArray[d.sdg - 1]} key={i}>
              {getSDGIconOnlyText(`Goal ${d.sdg}`)}
              <StatusEl
                marginTop={d.sdg !== 16 && d.sdg !== 12 ? '-4rem' : '-1.5rem'}
                paddingBottom={d.sdg !== 16 && d.sdg !== 12 ? '3.7rem' : '1rem'}
              >
                <div>Current Status</div>
                <TagEl fill={statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}>{statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}</TagEl>
              </StatusEl>
              {getSDGIconWOText(`Goal ${d.sdg}`)}
              <MoreEl>Click on the card to see the related key terms</MoreEl>
            </SDGCardEl>
          )))
            : <NoteEl>No SDGs mentioned in the document are low priority</NoteEl>
        }
      </CardContainer>
      <TitleEl>
        Not Covered (
        {dataNoMention.length}
        )
      </TitleEl>
      <CardContainer>
        {
          dataNoMention.length > 0 ? dataNoMention.map((d, i) => (
            <SDGCardEl bgColor={colorArray[d.sdg - 1]} key={i}>
              {getSDGIconOnlyText(`Goal ${d.sdg}`)}
              <StatusEl
                marginTop={d.sdg !== 16 && d.sdg !== 12 ? '-4rem' : '-1.5rem'}
                paddingBottom={d.sdg !== 16 && d.sdg !== 12 ? '3.7rem' : '1rem'}
              >
                <div>Current Status</div>
                <TagEl fill={statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}>{statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}</TagEl>
              </StatusEl>
              {getSDGIconWOText(`Goal ${d.sdg}`)}
            </SDGCardEl>
          )) : <NoteEl>All SDGs are covered in the document</NoteEl>
        }
      </CardContainer>
    </>
  );
};
