import styled from 'styled-components';
import { IndicatorStatusCard } from './IndicatorStatusCard';

interface Props {
  selectedSDG: string;
  data: any;
  timeSeriesData: any;
}
const RootEl = styled.div`
  margin-bottom: 2rem;
`;

export const TargetList = (props: Props) => {
  const {
    data,
    selectedSDG,
    timeSeriesData,
  } = props;
  return (
    <RootEl>
      <>
        {
          data[data.findIndex((d: any) => d.Goal === selectedSDG.split(':')[0])].Targets.map((d: any, i: number) => (
            <IndicatorStatusCard
              key={i}
              status={d.status}
              targetNo={d.Target}
              targetDescription={d['Target Description']}
              indicators={d.Indicators}
              timeSeriesData={timeSeriesData}
            />
          ))
        }
      </>
    </RootEl>
  );
};
