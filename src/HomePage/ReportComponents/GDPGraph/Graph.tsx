import GDP2023 from '../../Data/GDP-2023.json';
import GDP2019 from '../../Data/GDP-2019.json';
import { LineChartGraph } from './LineChartGraph';

interface Props {
  countryCode: string;
  width: number;
}
export const Graph = (props: Props) => {
  const {
    countryCode, width,
  } = props;
  const WorldGDPData = {
    2019: 0.028,
    2020: -0.029,
    2021: 0.062,
    2022: 0.034,
    2023: 0.028,
    2024: 0.03,
    2025: 0.031,
  };
  return (
    <LineChartGraph
      data2023={
        GDP2023[GDP2023.findIndex((d) => d.iso3 === countryCode)]
      }
      data2019={
        GDP2019[GDP2019.findIndex((d) => d.iso3 === countryCode)]
      }
      dataWorld={WorldGDPData}
      svgWidth={width}
      svgHeight={(width) / 3}
      strokeWidth={3}
    />
  );
};
