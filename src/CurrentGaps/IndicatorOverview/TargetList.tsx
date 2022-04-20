import styled from 'styled-components';
import { SDGListType } from '../../Types';
import { IndicatorStatusCard } from './IndicatorStatusCard';

interface Props {
  selectedSDG: string;
  data: SDGListType[];
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
          data[data.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets.map((d, i) => (
            <IndicatorStatusCard
              key={i}
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
