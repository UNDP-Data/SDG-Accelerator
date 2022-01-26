import styled from 'styled-components';
import { getSDGIcon } from '../utils/getSDGIcon';
import { SDGStatusListType } from '../Types';

interface Props {
  data: SDGStatusListType[];
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
  width: calc(50% - 5rem);
  padding: 2rem;
  background-color: var(--black-200);
  margin-bottom: 2rem;
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
`;

export const SDGGapsList = (props: Props) => {
  const {
    data,
  } = props;
  const onTrack = data.filter((d) => d.Status === 'On Track');
  const identifiedGap = data.filter((d) => d.Status === 'Identified Gap');
  const forReview = data.filter((d) => d.Status === 'For Review');
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
              {data.length}
            </SubText>
          </LegendText>
        </RowTitleEl>
        <RowBodyEl>
          {
            onTrack.map((d, i) => (
              <SDGIconEl key={i}>
                {getSDGIcon(d.Goal, 60)}
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
              {data.length}
            </SubText>
          </LegendText>
        </RowTitleEl>
        <RowBodyEl>
          {
            identifiedGap.map((d, i) => (
              <SDGIconEl key={i}>
                {getSDGIcon(d.Goal, 60)}
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
              {data.length}
            </SubText>
          </LegendText>
        </RowTitleEl>
        <RowBodyEl>
          {
            forReview.map((d, i) => (
              <SDGIconEl key={i}>
                {getSDGIcon(d.Goal, 60)}
              </SDGIconEl>
            ))
          }
        </RowBodyEl>
      </RowEl>
    </RootEl>
  );
};
