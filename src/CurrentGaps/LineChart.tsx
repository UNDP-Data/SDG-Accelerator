import { line, curveMonotoneX } from 'd3-shape';
import { useParams } from 'react-router-dom';
import { format } from 'd3-format';
import max from 'lodash.max';
import min from 'lodash.min';
import uniqBy from 'lodash.uniqby';
import { scaleLinear } from 'd3-scale';
import { useEffect, useRef, useState } from 'react';
import { pointer, select } from 'd3-selection';
import { KEYSTOAVOID } from '../Constants';

interface Props {
  data: any;
}

export const LineChart = (props: Props) => {
  const { data } = props;
  const GraphRef = useRef(null);
  const countryCode = useParams().country || 'ZAF';
  const [hoverData, setHoverData] = useState<any>(null);
  const svgWidth = 960;
  const svgHeight = 400;
  const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const MouseoverRectRef = useRef(null);

  const values = uniqBy(data.values, 'year').filter((d: any) => d.value !== null);
  const minParam = min(values.map((d: any) => d.value)) ? min(values.map((d: any) => d.value)) as number > 0 ? 0 : min(values.map((d: any) => d.value)) : 0;

  const maxParam = max(values.map((d: any) => d.value))
    ? max(values.map((d: any) => d.value))
    : 0;

  const minYearFiltered: number = min(values.map((d: any) => d.year)) ? min(values.map((d: any) => d.year)) as number : 2000;
  const maxYearFiltered: number = max(values.map((d: any) => d.year)) ? max(values.map((d: any) => d.year)) as number : 2020;
  const x = scaleLinear().domain([minYearFiltered, maxYearFiltered]).range([0, graphWidth]);
  const y = scaleLinear().domain([minParam as number, maxParam as number]).range([graphHeight, 0]).nice();
  const lineShape1 = line()
    .defined((d: any) => d.value || d.value === 0)
    .x((d: any) => x(d.year))
    .y((d: any) => (typeof d.value === 'number' ? y(d.value) : y(parseInt(d.value.substring(1), 10))))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(maxYearFiltered - minYearFiltered > 10 ? 10 : maxYearFiltered - minYearFiltered === 0 ? 1 : maxYearFiltered - minYearFiltered);
  useEffect(() => {
    const mousemove = (event: any) => {
      const yr = Math.round(x.invert(pointer(event)[0]));
      const indx = data.values.findIndex((d: any) => d.year === Math.round(x.invert(pointer(event)[0])));
      if (indx !== -1) {
        setHoverData({
          year: yr,
          value: typeof data.values[indx].value === 'number' ? Math.abs(data.values[indx].value) < 1 ? data.values[indx].value : data.values[indx].value > 1000 ? format('.2s')(data.values[indx].value).replace('G', 'B') : format('.3s')(data.values[indx].value) : data.values[indx].value,
          label: data.values[indx].label,
        });
      } else {
        setHoverData({
          year: yr,
          value: 'NA',
        });
      }
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseleave', () => { setHoverData(null); });
  }, [data]);
  return (
    <div
      ref={GraphRef}
      style={{
        width: '85%', flexShrink: 0, minWidth: '50rem', backgroundColor: 'var(--gray-100)', padding: '1rem 2rem',
      }}
    >
      <h6 className='undp-typography margin-top-05'>{data.seriesDescription}</h6>
      <div className='flex-div flex-wrap margin-bottom-07'>
        {
          Object.keys(data).map((d, i) => {
            if (KEYSTOAVOID.indexOf(d) !== -1) return null;
            return (
              <div className='undp-chip undp-chip-small' key={i}>
                {d}
                :
                {' '}
                {data[d]}
              </div>
            );
          })
        }
      </div>
      {
        values.length === 0 ? <h6 className='undp-typography'>No Data Avalaiable</h6>
          : (
            <>
              <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                  <line
                    y1={y(0)}
                    y2={y(0)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                    stroke='#55606E'
                    strokeWidth={1}
                  />
                  <text
                    x={0 - margin.left + 2}
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
                            x1={0 - margin.left}
                            x2={graphWidth + margin.right}
                            stroke='#A9B1B7'
                            strokeWidth={1}
                            strokeDasharray='4,8'
                            opacity={d === 0 ? 0 : 1}
                          />
                          <text
                            x={0 - margin.left + 2}
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
                  <g>
                    <path d={lineShape1(values as any) as string} fill='none' stroke='#006EB5' strokeWidth={2} />
                    {
                      values.map((d: any, i: number) => (
                        <g
                          key={i}
                        >
                          <circle
                            cx={x(d.year)}
                            cy={y(d.value)}
                            r={4}
                            fill='#006EB5'
                          />
                          <text
                            x={x(d.year)}
                            y={y(d.value)}
                            dy={-8}
                            fontSize={values.length > 10 ? values.length > 20 ? 0 : 11 : 12}
                            textAnchor='middle'
                            fill='#55606E'
                          >
                            {typeof d.value === 'number' ? Math.abs(d.value) === 0 ? 0 : Math.abs(d.value) < 1 ? Math.abs(d.value) < 0.09 ? d.value.toFixed(3) : d.value.toFixed(2) : Math.abs(d.value) > 1000 ? format('.2s')(d.value).replace('G', 'B') : format('.3s')(d.value) : d.value}
                          </text>
                        </g>
                      ))
                    }
                    {
                      hoverData
                        ? (
                          <g>
                            <line
                              x1={x(hoverData.year)}
                              x2={x(hoverData.year)}
                              y1={0}
                              y2={graphHeight}
                              stroke='#55606E'
                              strokeWidth={1}
                            />
                            <rect
                              fill='#EDEFF0'
                              opacity={0.8}
                              y={0}
                              x={x(hoverData.year) > graphWidth / 2 ? x(hoverData.year) - ((`${hoverData.value}`.length + 6) * 7) - 3 : x(hoverData.year) + 2}
                              height={20}
                              width={(`${hoverData.value}`.length + 6) * 7}
                            />
                            <text
                              fill='#232E3D'
                              fontSize={12}
                              y={0}
                              x={x(hoverData.year)}
                              textAnchor={x(hoverData.year) > graphWidth / 2 ? 'end' : 'start'}
                              dx={x(hoverData.year) > graphWidth / 2 ? -3 : 3}
                              dy={15}
                            >
                              {hoverData.year}
                              :
                              {' '}
                              {hoverData.label ? hoverData.label : hoverData.value === null ? 'NA' : hoverData.value}
                            </text>
                          </g>
                        )
                        : null
                    }
                    <rect
                      x={0}
                      y={0}
                      width={graphWidth}
                      height={graphHeight}
                      fill='#fff'
                      opacity={0}
                      ref={MouseoverRectRef}
                    />
                  </g>
                </g>
              </svg>
              <div className='flex-div margin-top-05 margin-bottom-05'>
                {
                  data.methodology
                    ? data.methodology.targetValue ? (
                      <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        Target value:
                        {' '}
                        {data.methodology.targetValue}
                      </div>
                    ) : null
                    : null
                }
                {
                  data.methodology
                    ? data.methodology.baseYear ? (
                      <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        Base year:
                        {' '}
                        {data.methodology.baseYear}
                      </div>
                    ) : null
                    : null
                }
              </div>
              {
                data.series === '***' ? <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Data Source: Country office</div> : <a style={{ fontSize: '0.875rem', opacity: 0.7 }} href={`https://unstats.un.org/sdgs/dataportal/countryprofiles/${countryCode}`} className='undp-style margin-top-05' target='_blank' rel='noreferrer'>Data Source: UNStats</a>
              }
            </>
          )
      }
    </div>
  );
};
