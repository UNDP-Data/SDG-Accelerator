/* eslint-disable @typescript-eslint/no-explicit-any */
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';

interface Props {
  data2023: any;
  data2019: any;
  dataWorld: any;
  svgWidth: number;
  svgHeight: number;
  strokeWidth: number;
}

interface DataFormattedType {
  year: number;
  param?: number;
}

export function LineChartGraph(props: Props) {
  const {
    data2023, data2019, dataWorld, svgWidth, svgHeight, strokeWidth,
  } = props;
  const margin = {
    top: 75,
    bottom: 35,
    left: 30,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const dataFormatted: DataFormattedType[] = [
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
  ].map((d) => ({
    year: parseInt(d, 10),
    param: data2023[d] === '' ? undefined : data2023[d] * 100,
  }));

  const dataFormatted2019: DataFormattedType[] = [
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
  ].map((d) => ({
    year: parseInt(d, 10),
    param: data2019[d] === '' ? undefined : data2019[d] * 100,
  }));
  const dataFormattedWorldData: DataFormattedType[] = [
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
  ].map((d) => ({
    year: parseInt(d, 10),
    param: dataWorld[d] === '' ? undefined : dataWorld[d] * 100,
  }));
  const countryMinParam: number = minBy(dataFormatted, (d) => d.param)?.param
    ? (minBy(dataFormatted, (d) => d.param)?.param as number) > 0
      ? 0
      : (minBy(dataFormatted, (d) => d.param)?.param as number)
    : 0;
  const countryMaxParam: number = maxBy(dataFormatted, (d) => d.param)?.param
    ? (maxBy(dataFormatted, (d) => d.param)?.param as number)
    : 0;
  const countryMinParam2019: number = minBy(dataFormatted2019, (d) => d.param)
    ?.param
    ? (minBy(dataFormatted2019, (d) => d.param)?.param as number) > 0
      ? 0
      : (minBy(dataFormatted2019, (d) => d.param)?.param as number)
    : 0;
  const countryMaxParam2019: number = maxBy(dataFormatted2019, (d) => d.param)
    ?.param
    ? (maxBy(dataFormatted2019, (d) => d.param)?.param as number)
    : 0;

  const worldMinParam: number = minBy(dataFormattedWorldData, (d) => d.param)
    ?.param
    ? (minBy(dataFormattedWorldData, (d) => d.param)?.param as number) > 0
      ? 0
      : (minBy(dataFormattedWorldData, (d) => d.param)?.param as number)
    : 0;
  const worldMaxParam: number = maxBy(dataFormattedWorldData, (d) => d.param)
    ?.param
    ? (maxBy(dataFormattedWorldData, (d) => d.param)?.param as number)
    : 0;
  const minParam = Math.min(
    countryMinParam,
    countryMinParam2019,
    worldMinParam,
  );
  const maxParam = Math.max(
    countryMaxParam,
    countryMaxParam2019,
    worldMaxParam,
  );
  const dataFiltered = dataFormatted.filter((d) => d.param !== undefined);
  const minYearFiltered = 2019;
  const maxYearFiltered = 2025;

  const x = scaleLinear()
    .domain([minYearFiltered as number, maxYearFiltered as number])
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();

  const yTicks = y.ticks(5);
  const lineShape = line()
    .defined((d: any) => d.param !== undefined)
    .x((d: any) => x(d.year))
    .y((d: any) => y(d.param))
    .curve(curveMonotoneX);
  return (
    <svg
      width='100%'
      style={{ alignItems: 'flex-end' }}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <rect
        x={0}
        y={0}
        width={svgWidth}
        height={svgHeight}
        fill={UNDPColorModule.graphBackgroundColor}
      />
      <rect
        x={0}
        y={12}
        width={20}
        height={6}
        fill={UNDPColorModule.graphMainColor}
        shapeRendering='geometricPrecision'
      />
      <text
        x={25}
        y={23}
        dx={0}
        dy={-3}
        style={{
          fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          fill: 'var(--gray-700)',
          fontWeight: 'bold',
          fontSize: '0.825rem',
        }}
      >
        GDP Projection (April 2023)
      </text>
      <rect
        x={215}
        y={12}
        width={20}
        height={6}
        style={{ fill: 'var(--blue-200)' }}
        shapeRendering='geometricPrecision'
      />
      <text
        x={240}
        y={23}
        dx={0}
        dy={-3}
        style={{
          fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          fill: 'var(--gray-700)',
          fontWeight: 'bold',
          fontSize: '0.825rem',
        }}
      >
        GDP Projection (October 2019)
      </text>
      <rect
        x={450}
        y={12}
        width={20}
        height={6}
        shapeRendering='geometricPrecision'
        style={{ fill: 'var(--gray-500)' }}
      />
      <text
        x={475}
        y={23}
        dx={0}
        dy={-3}
        style={{
          fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          fill: 'var(--gray-700)',
          fontWeight: 'bold',
          fontSize: '0.825rem',
        }}
      >
        World GDP Projection (April 2023)
      </text>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g>
          <g>
            <text
              y={graphHeight + 5}
              x={x(minYearFiltered as number)}
              style={{
                fill: 'var(--gray-600)',
                fontFamily:
                  'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
              }}
              textAnchor='start'
              fontSize={14}
              dy={15}
            >
              {minYearFiltered}
            </text>
            {[2020, 2021, 2022, 2023, 2024].map((d, i) => (
              <text
                y={graphHeight + 5}
                key={i}
                x={x(d)}
                style={{
                  fill: 'var(--gray-600)',
                  fontFamily:
                    'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                }}
                textAnchor='middle'
                fontSize={14}
                dy={15}
              >
                {d}
              </text>
            ))}
            <text
              y={graphHeight + 5}
              x={x(maxYearFiltered as number)}
              style={{
                fill: 'var(--gray-600)',
                fontFamily:
                  'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
              }}
              textAnchor='end'
              fontSize={14}
              dy={15}
            >
              {maxYearFiltered}
            </text>
          </g>
        </g>
        <g>
          <path
            d={lineShape(dataFormattedWorldData as any) as string}
            fill='none'
            style={{ stroke: 'var(--gray-500)' }}
            shapeRendering='geometricPrecision'
            strokeWidth={strokeWidth}
          />
          {dataFormattedWorldData
            .filter((d) => d.param)
            .map((d, i) => (
              <g key={i}>
                <circle
                  cx={x(d.year)}
                  cy={y(d.param as number)}
                  r={4}
                  style={{ fill: 'var(--gray-500)' }}
                />
              </g>
            ))}
          <path
            d={lineShape(dataFormatted2019 as any) as string}
            fill='none'
            style={{ stroke: 'var(--blue-200)' }}
            strokeWidth={strokeWidth}
            shapeRendering='geometricPrecision'
            strokeDasharray='8 16'
          />
          {dataFormatted2019
            .filter((d) => d.param)
            .map((d, i) => (
              <g key={i}>
                <circle
                  cx={x(d.year)}
                  cy={y(d.param as number)}
                  r={4}
                  style={{ fill: 'var(--blue-200)' }}
                />
              </g>
            ))}
          <path
            d={lineShape(dataFiltered as any) as string}
            fill='none'
            stroke={UNDPColorModule.graphMainColor}
            shapeRendering='geometricPrecision'
            strokeWidth={strokeWidth}
          />
        </g>
        {yTicks.map((d, i) => (
          <g key={i}>
            <line
              x1={-30}
              x2={graphWidth}
              y1={y(d)}
              y2={y(d)}
              style={{
                strokeWidth: '1px',
                stroke: 'var(--gray-400)',
                fill: 'none',
              }}
            />
            <text
              x={-30}
              y={y(d)}
              dx={5}
              dy={-5}
              style={{
                fontFamily:
                  'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                fill: 'var(--gray-500)',
                fontWeight: 'bold',
                fontSize: '0.825rem',
              }}
            >
              {d}
              {' '}
              %
            </text>
          </g>
        ))}
        <line
          x1={-30}
          x2={graphWidth}
          y1={y(0)}
          y2={y(0)}
          style={{
            strokeWidth: '1px',
            stroke: 'var(--gray-600)',
            fill: 'none',
          }}
        />
        {dataFiltered
          .filter((d) => d.param)
          .map((d, i) => (
            <g key={i}>
              <circle
                cx={x(d.year)}
                cy={y(d.param as number)}
                r={4.5}
                fill={UNDPColorModule.graphMainColor}
              />
              <text
                x={x(d.year)}
                y={y(d.param as number)}
                dx={0}
                dy={-10}
                style={{
                  fontFamily:
                    'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                  fill: UNDPColorModule.graphMainColor,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textAnchor: 'middle',
                }}
              >
                {d.param?.toFixed(1)}
              </text>
            </g>
          ))}
      </g>
    </svg>
  );
}
