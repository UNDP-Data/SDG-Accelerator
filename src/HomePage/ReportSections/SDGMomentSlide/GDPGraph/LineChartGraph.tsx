import { scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';

interface Props {
  data2023: any;
  svgWidth: number;
  svgHeight: number;
}

interface DataFormattedType {
  year: number;
  param: number;
}

export function LineChartGraph(props: Props) {
  const {
    data2023, svgWidth, svgHeight,
  } = props;
  const margin = {
    top: 20,
    bottom: 60,
    left: 30,
    right: 30,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = Math.min(svgHeight - margin.top - margin.bottom, 500);

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
    param: data2023[d] * 100,
  }));

  const minParam: number = minBy(dataFormatted, (d) => d.param)?.param
    ? (minBy(dataFormatted, (d) => d.param)?.param as number) > 0
      ? 0
      : (minBy(dataFormatted, (d) => d.param)?.param as number)
    : 0;
  const maxParam: number = maxBy(dataFormatted, (d) => d.param)?.param
    ? (maxBy(dataFormatted, (d) => d.param)?.param as number)
    : 0;

  const maxAbsValue = Math.max(
    Math.abs(minParam),
    Math.abs(maxParam),
  );
  const dataFiltered = dataFormatted.filter((d) => d.param !== undefined);
  const minYearFiltered = 2019;
  const maxYearFiltered = 2025;

  const x = scaleLinear()
    .domain([minYearFiltered as number, maxYearFiltered as number])
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([-maxAbsValue, maxAbsValue])
    .range([graphHeight, 0])
    .nice();
  return (
    <svg
      style={{ alignItems: 'flex-end', width: '100%' }}
      viewBox={`0 0 ${svgWidth} ${graphHeight + margin.top + margin.bottom}`}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g>
          <g>
            <text
              y={y(0)}
              x={x(minYearFiltered as number)}
              style={{
                fill: 'var(--black-600)',
                fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                fontWeight: 'bold',
              }}
              textAnchor='middle'
              fontSize={14}
              dy={dataFormatted[dataFormatted.findIndex((el) => el.year === minYearFiltered)].param > 0 ? 15 : -5}
            >
              {minYearFiltered}
            </text>
            {[2020, 2021, 2022, 2023, 2024].map((d, i) => (
              <text
                y={y(0)}
                key={i}
                x={x(d)}
                style={{
                  fill: 'var(--black-600)',
                  fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                  fontWeight: 'bold',
                }}
                textAnchor='middle'
                fontSize={14}
                dy={dataFormatted[dataFormatted.findIndex((el) => el.year === d)].param > 0 ? 15 : -5}
              >
                {d}
              </text>
            ))}
            <text
              y={y(0)}
              x={x(maxYearFiltered as number)}
              style={{
                fill: 'var(--black-600)',
                fontFamily:
                    'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                fontWeight: 'bold',
              }}
              textAnchor='middle'
              fontSize={14}
              dy={dataFormatted[dataFormatted.findIndex((el) => el.year === maxYearFiltered)].param > 0 ? 15 : -5}
            >
              {maxYearFiltered}
            </text>
          </g>
        </g>
        <g>
          {
            dataFiltered.map((d, i) => (
              <g key={i}>
                <rect
                  x={x(d.year) - 20}
                  width={40}
                  height={Math.abs(y(0) - y(d.param))}
                  y={d.param < 0 ? y(0) : y(d.param)}
                  style={{
                    fill: d.param < 0 ? 'var(--dark-red)' : 'var(--blue-700)',
                  }}
                />
                <text
                  x={x(d.year)}
                  y={y(d.param)}
                  dx={0}
                  dy={d.param < 0 ? 20 : -10}
                  style={{
                    fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
                    fill: d.param < 0 ? 'var(--dark-red)' : 'var(--blue-700)',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textAnchor: 'middle',
                  }}
                >
                  {d.param.toFixed(1)}
                </text>

              </g>
            ))
          }
        </g>
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
          Source: IMF World Economic Outlook
        </text>
      </g>
    </svg>
  );
}
