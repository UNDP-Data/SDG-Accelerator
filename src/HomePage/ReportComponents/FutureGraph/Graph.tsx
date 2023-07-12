import { ScenarioDataType } from '../../../Types';
import { SDGPushLineChartGraph } from '../../GraphForReport/SDGPushLineChartGraph';

interface Props {
  data: ScenarioDataType[];
  width: number;
  height: number;
  stepValue: number;
  // eslint-disable-next-line no-unused-vars
  setStepValue: (_d: number) => void;
}
export const Graph = (props: Props) => {
  const {
    data, width, height, stepValue, setStepValue,
  } = props;
  return (
    <SDGPushLineChartGraph
      data={data}
      svgWidth={width}
      svgHeight={height - 350}
      strokeWidth={3}
      stepValue={stepValue}
      setStepValue={setStepValue}
    />
  );
};
