import styled from 'styled-components';
import { Tag } from '../../Components/Tag';
import { SDGStatusListType } from '../../Types';
import { LineChart } from './LineChart';

interface Props {
  selectedSDG: string;
  data: SDGStatusListType[];
  timeSeriesData: any;
}
const RootEl = styled.div`
  margin-bottom: 2rem;
`;

const TitleEl = styled.div`
  background-color: var(--black-300);
  border-bottom: 1px solid var(--black-400);
  padding: 1.5rem 2rem;
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

export const IndicatorStatusCard = (props: Props) => {
  const {
    data,
    selectedSDG,
    timeSeriesData,
  } = props;
  return (
    <RootEl>
      <>
        {
          data[data.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets.map((d, i) => (
            <TargetListEl key={i}>
              <TitleEl>
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
              </TitleEl>
              <BodyEl>
                <IndicatorListTitle>All Indicators</IndicatorListTitle>
                {
                  d.Indicators.map((el, m) => (
                    <IndicatorListEl key={m}>
                      <ListHeadEl>
                        <H4>
                          {el.Indicator}
                        </H4>
                        <Tag
                          backgroundColor={el.Status === 'On Track' ? 'var(--accent-green)' : el.Status === 'Identified Gap' ? 'var(--accent-red)' : 'var(--accent-yellow)'}
                          text={el.Status}
                          fontColor={el.Status === 'For Review' ? 'var(--black)' : 'var(--white)'}
                        />
                      </ListHeadEl>
                      <ListBodyEl>
                        {el['Indicator Description']}
                      </ListBodyEl>
                      <ChartEl>
                        {
                          timeSeriesData
                            .filter((series: any) => series.indicator === el.Indicator.split(' ')[1])
                            .map((series: any) => <LineChart data={series} />)
                        }
                      </ChartEl>
                    </IndicatorListEl>
                  ))
                }
              </BodyEl>
            </TargetListEl>
          ))
        }
      </>
    </RootEl>
  );
};
