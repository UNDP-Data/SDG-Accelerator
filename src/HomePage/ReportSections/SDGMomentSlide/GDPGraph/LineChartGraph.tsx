import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  data2023: any;
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
    data2023, svgWidth, svgHeight, strokeWidth,
  } = props;
  const margin = {
    top: 20,
    bottom: 60,
    left: 30,
    right: 30,
  };
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const rectRef = useRef(null);
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = Math.min(svgHeight - margin.top - margin.bottom, 500);
  useEffect(() => {
    if (rectRef.current) {
      if (inView) {
        select(rectRef.current)
          .attr('x', -30)
          .transition()
          .duration(7000)
          .attr('x', svgWidth);
      } else {
        select(rectRef.current)
          .attr('x', -30);
      }
    }
  }, [inView, rectRef]);

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

  const WorldGDPData = {
    2019: 0.028,
    2020: -0.029,
    2021: 0.062,
    2022: 0.034,
    2023: 0.028,
    2024: 0.03,
    2025: 0.031,
  };
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
    param: (WorldGDPData as any)[d] * 100,
  }));
  const countryMinParam: number = minBy(dataFormatted, (d) => d.param)?.param
    ? (minBy(dataFormatted, (d) => d.param)?.param as number) > 0
      ? 0
      : (minBy(dataFormatted, (d) => d.param)?.param as number)
    : 0;
  const countryMaxParam: number = maxBy(dataFormatted, (d) => d.param)?.param
    ? (maxBy(dataFormatted, (d) => d.param)?.param as number)
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
    worldMinParam,
  );
  const maxParam = Math.max(
    countryMaxParam,
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

  const lineShape = line()
    .defined((d: any) => d.param !== undefined)
    .x((d: any) => x(d.year))
    .y((d: any) => y(d.param))
    .curve(curveMonotoneX);
  return (
    <svg
      width='100%'
      style={{ alignItems: 'flex-end' }}
      viewBox={`0 0 ${svgWidth} ${graphHeight + margin.top + margin.bottom}`}
      ref={ref}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g id='scrollyBg' />
        <g>
          <g>
            <text
              y={graphHeight + 5}
              x={x(minYearFiltered as number)}
              style={{
                fill: 'var(--black-600)',
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
                  fill: 'var(--black-600)',
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
                fill: 'var(--black-600)',
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
            style={{ stroke: 'var(--gray-600)' }}
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
                  style={{ fill: 'var(--gray-600)' }}
                />
              </g>
            ))}
          <path
            d={lineShape(dataFiltered as any) as string}
            fill='none'
            style={{
              stroke: 'var(--blue-700)',
            }}
            shapeRendering='geometricPrecision'
            strokeWidth={strokeWidth}
          />
        </g>
        {dataFiltered
          .filter((d) => d.param)
          .map((d, i) => (
            <g key={i}>
              <circle
                cx={x(d.year)}
                cy={y(d.param as number)}
                r={4.5}
                style={{
                  fill: 'var(--blue-700)',
                }}
              />
              <text
                x={x(d.year)}
                y={y(d.param as number)}
                dx={0}
                dy={-10}
                style={{
                  fontFamily:
                      'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                  fill: 'var(--blue-700)',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textAnchor: 'middle',
                }}
              >
                {d.param?.toFixed(1)}
              </text>
            </g>
          ))}

        <rect
          x={-30}
          y={0 - margin.top}
          width={svgWidth + 30}
          height={svgHeight + margin.top}
          style={{
            fill: '#edf6ff',
          }}
          ref={rectRef}
        />
        <line
          x1={-30}
          x2={graphWidth}
          y1={y(0)}
          y2={y(0)}
          style={{
            strokeWidth: '1px',
            stroke: 'var(--gray-500)',
            fill: 'none',
          }}
        />
        <text
          className='small-font'
          style={{
            color: 'var(--gray-700)',
            fontFamily:
              'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          }}
          x={0 - margin.left}
          y={graphHeight + 50}
        >
          Source: IMF World Economic Outlook (WEO) (April 2023 and October
          2019).
        </text>
        <g id='scrolly' />
      </g>
    </svg>
  );
}
