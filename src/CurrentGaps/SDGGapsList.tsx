import styled from 'styled-components';
import SDGData from '../Data/SDGGoalList.json';
import { getSDGIcon } from '../utils/getSDGIcon';

interface Props {
  data: any;
  setSelectedSDG: any;
  divRef: any;
}

const RowEl = styled.div`
  margin: 2rem 0;
  &:first-of-type {
    margin-top: 0;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const RootEl = styled.div`
  padding: 4rem;
`;

interface ColorProps {
  fill: string;
}

const RowTitleEl = styled.div`
  display: flex;
  margin: 0 0 0.5rem 0;
  align-items: center;
`;

const LegendIcon = styled.div<ColorProps>`
  width: 1.2rem;
  height: 1.2rem;
  background-color: ${(props) => props.fill};
  border-radius: 0.6rem;
  margin-right: 1rem;
`;

const LegendText = styled.div<ColorProps>`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.fill};
`;

const SubText = styled.span`
  font-size: 1.4rem;
  font-weight: normal;
`;

const RowBodyEl = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const SDGIconEl = styled.div`
  margin: 0.5rem 1rem 0.5rem 0;
  cursor: pointer;
`;

const SubNote = styled.div`
  font-size: 1.4rem;
  font-style: italic;
  color: var(--black-600);
`;

export const SDGGapsList = (props: Props) => {
  const {
    data,
    setSelectedSDG,
    divRef,
  } = props;
  const SDGList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
  const onTrack = data.filter((d: any) => d.status === 'On Track');
  const identifiedGap = data.filter((d: any) => d.status === 'Identified Gap');
  const forReview = data.filter((d: any) => d.status === 'For Review');
  return (
    <RootEl>
      <RowEl>
        <RowTitleEl>
          <LegendIcon fill='var(--accent-green)' />
          <LegendText fill='var(--accent-green)'>
            On Track:
            {' '}
            {onTrack.length}
            {' '}
            <SubText>
              out of
              {' '}
              {17}
            </SubText>
          </LegendText>
        </RowTitleEl>
        <RowBodyEl>
          {
            onTrack.map((d: any, i: number) => (
              <SDGIconEl key={i} onClick={() => { setSelectedSDG(`${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d.goal}`)].Goal}: ${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d.goal}`)]['Goal Name']}`); divRef.current.scrollIntoView({ behavior: 'smooth' }); }}>
                {getSDGIcon(`SDG ${d.goal}`, 60)}
              </SDGIconEl>
            ))
          }
        </RowBodyEl>
      </RowEl>
      <RowEl>
        <RowTitleEl>
          <LegendIcon fill='var(--accent-red)' />
          <LegendText fill='var(--accent-red)'>
            Identified Gap:
            {' '}
            {identifiedGap.length}
            {' '}
            <SubText>
              out of
              {' '}
              {17}
            </SubText>
          </LegendText>
        </RowTitleEl>
        <RowBodyEl>
          {
            identifiedGap.map((d: any, i: number) => (
              <SDGIconEl key={i} onClick={() => { setSelectedSDG(`${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d.goal}`)].Goal}: ${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d.goal}`)]['Goal Name']}`); divRef.current.scrollIntoView({ behavior: 'smooth' }); }}>
                {getSDGIcon(`SDG ${d.goal}`, 60)}
              </SDGIconEl>
            ))
          }
        </RowBodyEl>
      </RowEl>
      <RowEl>
        <RowTitleEl>
          <LegendIcon fill='var(--accent-yellow)' />
          <LegendText fill='var(--accent-yellow)'>
            For Review:
            {' '}
            {forReview.length}
            {' '}
            <SubText>
              out of
              {' '}
              {17}
            </SubText>
          </LegendText>
        </RowTitleEl>
        <RowBodyEl>
          {
            forReview.map((d: any, i: number) => (
              <SDGIconEl key={i} onClick={() => { setSelectedSDG(`${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d.goal}`)].Goal}: ${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d.goal}`)]['Goal Name']}`); divRef.current.scrollIntoView({ behavior: 'smooth' }); }}>
                {getSDGIcon(`SDG ${d.goal}`, 60)}
              </SDGIconEl>
            ))
          }
        </RowBodyEl>
      </RowEl>
      <RowEl>
        <RowTitleEl>
          <LegendIcon fill='var(--black-550)' />
          <LegendText fill='var(--black-550)'>
            Gap Unidentified:
            {' '}
            {17 - data.length}
            {' '}
            <SubText>
              out of
              {' '}
              {17}
            </SubText>
          </LegendText>
        </RowTitleEl>
        <RowBodyEl>
          {
            SDGList.map((d: any, i: number) => (
              data.findIndex((e: any) => e.goal === d) === -1
                ? (
                  <SDGIconEl key={i} onClick={() => { setSelectedSDG(`${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d}`)].Goal}: ${SDGData[SDGData.findIndex((el) => el.Goal === `SDG ${d}`)]['Goal Name']}`); divRef.current.scrollIntoView({ behavior: 'smooth' }); }}>
                    {getSDGIcon(`SDG ${d}`, 60)}
                  </SDGIconEl>
                )
                : null
            ))
          }
        </RowBodyEl>
      </RowEl>
      <SubNote>
        Click on the goal to explore further
      </SubNote>
    </RootEl>
  );
};
