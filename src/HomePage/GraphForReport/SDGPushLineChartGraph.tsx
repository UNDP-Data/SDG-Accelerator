/* eslint-disable @typescript-eslint/no-explicit-any */
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import { select, selectAll } from 'd3-selection';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { format } from 'd3-format';
import min from 'lodash.min';
import max from 'lodash.max';
import { ScenarioDataType } from '../../Types';

interface Props {
  data: ScenarioDataType[];
  svgWidth: number;
  svgHeight: number;
  strokeWidth: number;
  stepValue?: number;
  // eslint-disable-next-line no-unused-vars
  setStepValue: (_d: number) => void;
}

export function SDGPushLineChartGraph(props: Props) {
  const {
    data, svgWidth, svgHeight, strokeWidth, stepValue, setStepValue,
  } = props;
  const margin = {
    top: 25,
    bottom: 35,
    left: 30,
    right: 20,
  };
  const { ref, inView } = useInView({
    threshold: 0.25,
  });
  const rectRef = useRef(null);
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
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
        setStepValue(0);
      }
    }
  }, [inView, rectRef]);
  useEffect(() => {
    if (stepValue === 1) {
      selectAll('.covidBaseline')
        .attr('opacity', 0.3);
    } else {
      selectAll('.covidBaseline')
        .attr('opacity', 1);
    }
  }, [stepValue]);
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

  const minYearFiltered: number = 2017;
  const maxYearFiltered: number = 2050;
  const x = scaleLinear().domain([minYearFiltered, maxYearFiltered]).range([0, graphWidth]);
  const y = scaleLinear().domain([minParam as number, maxParam as number]).range([graphHeight, 0]).nice();
  const lineShape1 = line()
    .defined((d: any) => d.value !== null || d.value !== undefined)
    .x((d: any) => x(d.year))
    .y((d: any) => (d.value === '>95' ? y(95) : y(d.value)))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(5);
  return (
    <>
      <div className='flex-div flex-wrap gap-07 margin-bottom-07' style={{ justifyContent: 'center' }}>
        <div className='flex-div gap-03 flex-vert-align-center'>
          <div style={{
            width: '1rem',
            height: '1rem',
            backgroundColor: lineColor['\'COVID Baseline\' scenario'],
          }}
          />
          COVID Baseline Scenario
        </div>
        <div className='flex-div gap-03 flex-vert-align-center'>
          <div style={{
            width: '1rem',
            height: '1rem',
            backgroundColor: lineColor['\'SDG Push\' scenario'],
          }}
          />
          SDG Push Scenario
        </div>
      </div>
      <svg
        width='calc(100vw - 4rem)'
        style={{ alignItems: 'flex-end' }}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        ref={ref}
      >
        <rect
          x={0}
          y={0}
          width={svgWidth}
          height={svgHeight}
          fill={UNDPColorModule.graphBackgroundColor}
        />
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g className='sdgPush'>
            <path d={lineShape1(data[0].data as any) as string} fill='none' stroke={lineColor[data[0].scenario]} strokeWidth={strokeWidth} />
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
          <g className='covidBaseline'>
            <path d={lineShape1(data[1].data as any) as string} fill='none' stroke={lineColor[data[1].scenario]} strokeWidth={strokeWidth} />
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
          {xTicks.map((d, i) => (
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
          <rect
            x={-30}
            y={0 - margin.top}
            width={svgWidth + 30}
            height={svgHeight + margin.top}
            fill={UNDPColorModule.graphBackgroundColor}
            ref={rectRef}
          />
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
                {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
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
        </g>
      </svg>
    </>
  );
}
