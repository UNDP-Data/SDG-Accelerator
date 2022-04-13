import styled from 'styled-components';
import { SCENARIOINDICATORBASEDONSDG } from '../../Constants';
import { ScenarioDataType } from '../../Types';
import { LineChart } from './LineChart';

interface Props {
  selectedSDG: string;
  data: ScenarioDataType[];
}
const RootEl = styled.div`
  margin-bottom: 2rem;
`;

const ChartEl = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const ScenarioLineChartsEl = (props: Props) => {
  const {
    data,
    selectedSDG,
  } = props;
  return (
    <RootEl>
      <>
        {
          SCENARIOINDICATORBASEDONSDG[SCENARIOINDICATORBASEDONSDG.findIndex((d) => d.SDG === selectedSDG)].indicators.map((d, i) => (
            <ChartEl key={i}>
              <LineChart data={data.filter((series: any) => series.indicator === d)} />
            </ChartEl>
          ))
        }
      </>
    </RootEl>
  );
};
