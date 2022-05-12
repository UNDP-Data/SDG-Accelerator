import { useState } from 'react';
import styled from 'styled-components';
import { IndicatorListType } from '../../Types';
import { LineChart } from './LineChart';

interface Props {
  targetNo: string;
  targetDescription: string;
  indicators: IndicatorListType[] ;
  timeSeriesData: any;
  status: any;
}
const RootEl = styled.div`
  margin-bottom: 2rem;
`;

const TitleEl = styled.div`
  background-color: var(--black-300);
  border-bottom: 1px solid var(--black-400);
  padding: 1.5rem 2rem;
  cursor: pointer;
`;

const TargetListEl = styled.div`
  background-color: var(--black-100);
  margin: 2rem 0;
  font-size: 1.6rem;
  color: var(--black-700);
  &:first-of-type{
    margin-top: 0;
  }
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
const BodyEl = styled.div`
  padding: 1.5rem 2rem;
`;

const IndicatorListTitle = styled.div`
  font-weight: 600;
  color: var(--black-600);
  text-transform: uppercase;
  font-size: 1.6rem;
  margin-bottom: 1rem;
`;

const IndicatorListEl = styled.div`
  background-color: var(--white);
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.05);
  color: var(--black-600);
  padding: 1.5rem 2rem;
  margin: 1rem 0;
`;

const ChartEl = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SubNote = styled.div`
  font-size: 1.4rem;
  font-style: italic;
  margin: 1rem 0 0 0;
  font-weight: 500;
  color: var(--primary-blue);
`;

interface StatusTagProps {
  status?: string;
}

const StatusTag = styled.div<StatusTagProps>`
  font-size: 1.6rem;
  display: flex;
  width: fit-content;
  font-weight: 500;
  border-radius: 5rem;
  padding: 0.5rem 1rem;
  margin: 1rem 0 1rem 1rem;
  background-color: ${(props) => (props.status === 'For Review'
    ? 'var(--accent-yellow)'
    : props.status === 'Identified Gap'
      ? 'var(--accent-red)'
      : props.status === undefined
        ? 'var(--black-500)'
        : 'var(--accent-green)')};
  color: ${(props) => (props.status === 'For Review' || props.status === undefined ? 'var(--black-700)' : 'var(--white)')};
`;

export const IndicatorStatusCard = (props: Props) => {
  const {
    targetNo,
    targetDescription,
    indicators,
    timeSeriesData,
    status,
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <RootEl>
      <>
        <TargetListEl>
          <TitleEl onClick={() => { setIsExpanded(!isExpanded); }}>
            <ListHeadEl>
              <H4>
                {targetNo}
              </H4>
              <StatusTag status={status}>{status || 'Gap Unidentified'}</StatusTag>
            </ListHeadEl>
            <ListBodyEl>
              {targetDescription}
            </ListBodyEl>
            <SubNote>{isExpanded ? 'Click to Collapse' : 'Click to Expand and See All the Indicators'}</SubNote>
          </TitleEl>
          {
            isExpanded
              ? (
                <BodyEl>
                  <IndicatorListTitle>All Indicators</IndicatorListTitle>
                  {
                    indicators.map((el, m) => (
                      <IndicatorListEl key={m}>
                        <ListHeadEl>
                          <H4>
                            {el.Indicator}
                          </H4>
                        </ListHeadEl>
                        <ListBodyEl>
                          {el['Indicator Description']}
                        </ListBodyEl>
                        <ChartEl>
                          {
                            timeSeriesData
                              .filter((series: any) => series.indicator === el.Indicator.split(' ')[1])
                              .map((series: any, j: number) => <LineChart key={j} data={series} />)
                          }
                        </ChartEl>
                      </IndicatorListEl>
                    ))
                  }
                </BodyEl>
              )
              : null
          }
        </TargetListEl>
      </>
    </RootEl>
  );
};
