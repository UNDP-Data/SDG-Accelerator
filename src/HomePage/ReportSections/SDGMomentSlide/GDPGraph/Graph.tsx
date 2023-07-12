import { LineChartGraph } from './LineChartGraph';

interface Props {
  countryCode: string;
  width: number;
  height: number;
  GDP2023: any;
}
export const Graph = (props: Props) => {
  const {
    countryCode,
    width,
    height,
    GDP2023,
  } = props;
  return (
    <LineChartGraph
      data2023={
        GDP2023[GDP2023.findIndex((d: any) => d.iso3 === countryCode)]
      }
      svgWidth={width}
      svgHeight={height}
      strokeWidth={2}
    />
  );
};
