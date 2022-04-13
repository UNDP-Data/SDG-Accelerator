import styled from 'styled-components';
import { line, curveMonotoneX } from 'd3-shape';
import { format } from 'd3-format';
import max from 'lodash.max';
import min from 'lodash.min';
import { scaleLinear } from 'd3-scale';
import { ScenarioDataType } from '../../Types';

interface Props {
  data: ScenarioDataType[];
}

const RootEl = styled.div`
  margin: 1rem 0;
  padding: 2rem;
  width: 100%;
  background-color: var(--black-100);
`;

const TitleEl = styled.div`
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
  font-weight: bold;
`;

export const LineChart = (props: Props) => {
  const { data } = props;
  const svgWidth = 1240;
  const svgHeight = 420;
  const margin = {
    top: 20,
    bottom: 50,
    left: 20,
    right: 40,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const lineColor = {
    "'COVID Baseline' scenario": '#ed4347',
    "'SDG Push' scenario": '#009788',
  };

  const minParamCOVIDBaseline = min(data[0].data.map((d) => d.value)) ? min(data[0].data.map((d) => d.value)) as number > 0 ? 0 : min(data[0].data.map((d) => d.value)) : 0;
  const minParamSDGPush = min(data[1].data.map((d) => d.value)) ? min(data[1].data.map((d) => d.value)) as number > 0 ? 0 : min(data[1].data.map((d) => d.value)) : 0;
  const minParam = minParamSDGPush !== undefined && minParamCOVIDBaseline !== undefined ? minParamSDGPush < minParamCOVIDBaseline ? minParamSDGPush : minParamCOVIDBaseline : 0;

  const maxParamCOVIDBaseline = max(data[0].data.map((d) => d.value)) ? max(data[0].data.map((d) => d.value)) : 0;
  const maxParamSDGPush = max(data[1].data.map((d) => d.value)) ? max(data[1].data.map((d) => d.value)) : 0;
  const maxParam = maxParamSDGPush !== undefined && maxParamCOVIDBaseline !== undefined ? maxParamSDGPush > maxParamCOVIDBaseline ? maxParamSDGPush : maxParamCOVIDBaseline : 0;

  const minYearFiltered: number = 2015;
  const maxYearFiltered: number = 2050;
  const x = scaleLinear().domain([minYearFiltered, maxYearFiltered]).range([0, graphWidth]);
  const y = scaleLinear().domain([minParam as number, maxParam as number]).range([graphHeight, 0]).nice();
  const lineShape1 = line()
    .defined((d: any) => d.value)
    .x((d: any) => x(d.year))
    .y((d: any) => (d.value === '>95' ? y(95) : y(d.value)))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(maxYearFiltered - minYearFiltered > 10 ? 10 : maxYearFiltered - minYearFiltered === 0 ? 1 : maxYearFiltered - minYearFiltered);
  return (
    <RootEl>
      <TitleEl>{data[0].indicator}</TitleEl>
      <>
        <svg width='100%' height='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <line
              y1={y(0)}
              y2={y(0)}
              x1={0}
              x2={graphWidth + 15}
              stroke='#212121'
              strokeWidth={1}
            />
            <text
              x={0}
              y={y(0)}
              fill='#666'
              textAnchor='start'
              fontSize={12}
              dy={-3}
            >
              0
            </text>
            <g>
              {
                yTicks.map((d, i) => (
                  <g key={i}>
                    <line
                      y1={y(d)}
                      y2={y(d)}
                      x1={0}
                      x2={graphWidth}
                      stroke='#AAA'
                      strokeWidth={1}
                      strokeDasharray='4,8'
                      opacity={d === 0 ? 0 : 1}
                    />
                    <text
                      x={0}
                      y={y(d)}
                      fill='#666'
                      textAnchor='start'
                      fontSize={12}
                      dy={-3}
                      opacity={d === 0 ? 0 : 1}
                    >
                      {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                    </text>
                  </g>
                ))
              }
            </g>
            <g>
              {
                xTicks.map((d, i) => (
                  <g key={i}>
                    <text
                      y={graphHeight}
                      x={x(d)}
                      fill='#AAA'
                      textAnchor='middle'
                      fontSize={12}
                      dy={15}
                    >
                      {d}
                    </text>
                  </g>
                ))
              }
            </g>
            <g>
              <path d={lineShape1(data[0].data as any) as string} fill='none' stroke={lineColor[data[0].scenario]} strokeWidth={2} />
              {
                data[0].data.map((d: any, i: number) => (
                  <g
                    key={i}
                  >
                    <circle
                      cx={x(d.year)}
                      cy={y(d.value)}
                      r={4}
                      fill={lineColor[data[0].scenario]}
                    />
                    <text
                      x={x(d.year)}
                      y={y(d.value)}
                      dy={-8}
                      fontSize={12}
                      textAnchor='middle'
                      strokeWidth={0.25}
                      stroke='#fff'
                      fill={lineColor[data[0].scenario]}
                      fontWeight='bold'
                    >
                      {d.value < 1 ? d.value : format('~s')(d.value)}
                    </text>
                  </g>
                ))
              }
            </g>
            <g>
              <path d={lineShape1(data[1].data as any) as string} fill='none' stroke={lineColor[data[1].scenario]} strokeWidth={2} />
              {
                data[1].data.map((d: any, i: number) => (
                  <g
                    key={i}
                  >
                    <circle
                      cx={x(d.year)}
                      cy={y(d.value)}
                      r={4}
                      fill={lineColor[data[1].scenario]}
                    />
                    <text
                      x={x(d.year)}
                      y={y(d.value)}
                      dy={-8}
                      fontSize={12}
                      textAnchor='middle'
                      strokeWidth={0.25}
                      stroke='#fff'
                      fill={lineColor[data[1].scenario]}
                      fontWeight='bold'
                    >
                      {d.value < 1 ? d.value : format('~s')(d.value)}
                    </text>
                  </g>
                ))
              }
            </g>
          </g>
        </svg>
      </>
    </RootEl>
  );
};
