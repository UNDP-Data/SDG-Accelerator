import { line, curveMonotoneX } from 'd3-shape';
import { format } from 'd3-format';
import max from 'lodash.max';
import min from 'lodash.min';
import { scaleLinear } from 'd3-scale';
import range from 'lodash.range';
import { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { useInView } from 'react-intersection-observer';
import { HoverDataType, ScenarioDataType } from '../Types';
import { GraphTooltip } from './GraphTooltip';

interface Props {
  data: ScenarioDataType[];
}

export const LineChart = (props: Props) => {
  const { data } = props;

  const { ref, inView } = useInView({
    threshold: 0.33,
  });
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

  const overlayRect = useRef<SVGRectElement>(null);
  const lineColor = {
    "'COVID Baseline' scenario": '#ed4347',
    "'SDG Push' scenario": '#009788',
  };

  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);

  const minParamCOVIDBaseline = min(data[0].data.map((d) => d.value)) ? min(data[0].data.map((d) => d.value)) as number > 0 ? 0 : min(data[0].data.map((d) => d.value)) : 0;
  const minParamSDGPush = min(data[1].data.map((d) => d.value)) ? min(data[1].data.map((d) => d.value)) as number > 0 ? 0 : min(data[1].data.map((d) => d.value)) : 0;
  const minParam = minParamSDGPush !== undefined && minParamCOVIDBaseline !== undefined ? minParamSDGPush < minParamCOVIDBaseline ? minParamSDGPush : minParamCOVIDBaseline : 0;

  const maxParamCOVIDBaseline = max(data[0].data.map((d) => d.value)) ? max(data[0].data.map((d) => d.value)) : 0;
  const maxParamSDGPush = max(data[1].data.map((d) => d.value)) ? max(data[1].data.map((d) => d.value)) : 0;
  const maxParam = maxParamSDGPush !== undefined && maxParamCOVIDBaseline !== undefined ? maxParamSDGPush > maxParamCOVIDBaseline ? maxParamSDGPush : maxParamCOVIDBaseline : 0;

  const minYearFiltered: number = 2017;
  const maxYearFiltered: number = 2050;
  const x = scaleLinear().domain([minYearFiltered, maxYearFiltered]).range([0, graphWidth]);
  const y = scaleLinear().domain([minParam as number, maxParam as number]).range([graphHeight, 0]).nice();
  const yearRange = range(minYearFiltered, maxYearFiltered + 1, 1);
  const lineShape1 = line()
    .defined((d: any) => d.value !== null || d.value !== undefined)
    .x((d: any) => x(d.year))
    .y((d: any) => (d.value === '>95' ? y(95) : y(d.value)))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(maxYearFiltered - minYearFiltered > 10 ? 10 : maxYearFiltered - minYearFiltered === 0 ? 1 : maxYearFiltered - minYearFiltered);

  useEffect(() => {
    if (inView) {
      const overlaySelect = select(overlayRect.current);
      overlaySelect
        .transition()
        .duration(10000)
        .attr('x', svgWidth + 20);
    }
  }, [inView]);
  return (
    <div className='max-width-1440 margin-bottom-09' style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-07) var(--spacing-05) var(--spacing-05) var(--spacing-05)' }} ref={ref}>
      <h6 className='undp-typography'>{data[0].indicator}</h6>
      <>
        <svg width='100%' height='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <text
              x={0}
              y={y(0)}
              fill='#A9B1B7'
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
                      stroke='#A9B1B7'
                      strokeWidth={1}
                      strokeDasharray='4,8'
                      opacity={d === 0 ? 0 : 1}
                    />
                    <text
                      x={0}
                      y={y(d)}
                      fill='#A9B1B7'
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
                      </g>
                    ))
                  }
            </g>
            <rect
              ref={overlayRect}
              width={svgWidth + 10}
              height={svgHeight + 10}
              x={-10}
              y={-10}
              fill='#F7F7F7'
            />
            <line
              y1={y(0)}
              y2={y(0)}
              x1={0}
              x2={graphWidth + 15}
              stroke='#55606E'
              strokeWidth={1}
            />
            <g>
              {
                xTicks.map((d, i) => (
                  <g key={i}>
                    <text
                      y={graphHeight}
                      x={x(d)}
                      fill='#A9B1B7'
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
            {
              yearRange.map((d, i) => (
                <rect
                  key={i}
                  x={x(d) - 10}
                  y={0}
                  width={20}
                  height={graphHeight}
                  fill='#fff'
                  opacity={0}
                  onMouseEnter={(event) => {
                    setHoverData({
                      withSDGPush: data[data.findIndex((el) => el.scenario === "'SDG Push' scenario")].data[data[data.findIndex((el) => el.scenario === "'SDG Push' scenario")].data.findIndex((el) => el.year === d)].value,
                      withoutSDGPush: data[data.findIndex((el) => el.scenario === "'COVID Baseline' scenario")].data[data[data.findIndex((el) => el.scenario === "'COVID Baseline' scenario")].data.findIndex((el) => el.year === d)].value,
                      year: d,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseMove={(event) => {
                    setHoverData({
                      withSDGPush: data[data.findIndex((el) => el.scenario === "'SDG Push' scenario")].data[data[data.findIndex((el) => el.scenario === "'SDG Push' scenario")].data.findIndex((el) => el.year === d)].value,
                      withoutSDGPush: data[data.findIndex((el) => el.scenario === "'COVID Baseline' scenario")].data[data[data.findIndex((el) => el.scenario === "'COVID Baseline' scenario")].data.findIndex((el) => el.year === d)].value,
                      year: d,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                />
              ))
            }
            {
              hoverData
                ? (
                  <line
                    y1={0}
                    y2={graphHeight}
                    x1={x(hoverData.year)}
                    x2={x(hoverData.year)}
                    stroke='#212121'
                    strokeDasharray='4 8'
                    strokeWidth={1}
                  />
                ) : null
            }
          </g>
        </svg>
      </>
      {
        hoverData ? <GraphTooltip data={hoverData} /> : null
      }
    </div>
  );
};
