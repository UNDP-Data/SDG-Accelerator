import styled from 'styled-components';
import { line, curveMonotoneX } from 'd3-shape';
import { FileImageTwoTone } from '@ant-design/icons';
import { format } from 'd3-format';
import max from 'lodash.max';
import min from 'lodash.min';
import domtoimage from 'dom-to-image';
import uniqBy from 'lodash.uniqby';
import { scaleLinear } from 'd3-scale';
import meanBy from 'lodash.meanby';
import { useEffect, useRef, useState } from 'react';
import { pointer, select } from 'd3-selection';
import { KEYSTOAVOID } from '../../Constants';
import { getYearsAndValues } from '../../utils/getYearsAndValues';
import { getStatus } from '../../utils/getStatus';

interface Props {
  data: any;
}

const ParentEl = styled.div`
  margin: 1rem 0;
  width: calc(50% - 1rem);
  background-color: var(--black-100);
`;

const RootEl = styled.div`
  padding: 2rem;
  background-color: var(--black-100);
`;

const TitleEl = styled.div`
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
  font-weight: bold;
`;

const SubNote = styled.div`
  font-size: 1.4rem;
  display: flex;
  flex-wrap: wrap;
  div {
    margin-right: 1rem;
    padding: 0.3rem 1rem;
    background-color: var(--black-300);
    border-radius: 0.2rem;
  }
`;

interface StatusTagProps {
  status: string;
}

const DownLoadButton = styled.button`
  background-color: transparent;
  border: 0;
  color: var(--black-550);
  padding: 0;
  margin: 0 0 2rem 2rem;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  display: flex;
  align-items: center;
  &:hover{
    color: var(--primary-blue);
  }
  span {
    margin-left: 0.5rem;
  }
`;

const StatusTag = styled.div<StatusTagProps>`
  font-size: 1.6rem;
  display: flex;
  width: fit-content;
  font-weight: 500;
  border-radius: 5rem;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background-color: ${(props) => (props.status === 'Fair progress but acceleration needed'
    ? 'var(--accent-yellow)'
    : props.status === 'Limited or No Progress'
      ? 'var(--accent-orange)'
      : props.status === 'Deterioration'
        ? 'var(--accent-red)'
        : props.status === 'Insufficient Data'
          ? 'var(--black-500)'
          : props.status === 'Target value unavailable'
            ? 'var(--black-400)'
            : 'var(--accent-green)')};
  color: ${(props) => (props.status === 'Fair progress but acceleration needed' || props.status === 'Insufficient Data' || props.status === 'Target value unavailable' ? 'var(--black-700)' : 'var(--white)')};
`;

export const LineChart = (props: Props) => {
  const { data } = props;
  const GraphRef = useRef(null);
  const [hoverData, setHoverData] = useState<any>(null);
  const svgWidth = 550;
  const svgHeight = 365;
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
  const targetValue = data.targets ? data.targets : null;

  const yearsAndValues = getYearsAndValues(values as any);
  const status = data.indicator === '8.1.1'
    ? meanBy(data.values.filter((val: any) => val.year > 2014), 'value') > 2 ? 'On Track'
      : meanBy(data.values.filter((val: any) => val.year > 2014), 'value') > 1.5 ? 'Fair progress but acceleration needed'
        : meanBy(data.values.filter((val: any) => val.year > 2014), 'value') > 1 ? 'Limited or No Progress'
          : 'Deterioration'
    : targetValue === null
      ? 'Target value unavailable'
      : yearsAndValues === null
        ? 'Insufficient Data'
        : getStatus(yearsAndValues, targetValue.targetValue, targetValue.type, data.trendMethodology || 'CAGR');

  const minParam = min(values.map((d: any) => d.value)) ? min(values.map((d: any) => d.value)) as number > 0 ? 0 : min(values.map((d: any) => d.value)) : 0;

  const maxParam = max(values.map((d: any) => d.value))
    ? data.targets
      ? max(values.map((d: any) => d.value)) > data.targets.targetValue
        ? max(values.map((d: any) => d.value))
        : data.targets.targetValue
      : max(values.map((d: any) => d.value))
    : data.targets
      ? data.targets.targetValue : 0;

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
    <>
      {values.length === 0 ? null
        : (
          <ParentEl>
            <RootEl ref={GraphRef}>
              <TitleEl>{data.seriesDescription}</TitleEl>
              <SubNote>
                {
                  Object.keys(data).map((d) => {
                    if (KEYSTOAVOID.indexOf(d) !== -1) return null;
                    return (
                      <div>
                        {d}
                        :
                        {' '}
                        <span className='bold'>{data[d]}</span>
                      </div>
                    );
                  })
                }
              </SubNote>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {
                  status
                    ? (
                      <StatusTag status={status}>
                        {status}
                      </StatusTag>
                    ) : null
                }
                {
                  data.targets === 0 || data.indicator === '8.1.1' ? null
                    : data.trendMethodology === 'NA'
                      ? (
                        <StatusTag status='Insufficient Data'>
                          Methodology Not Developed
                        </StatusTag>
                      ) : data.trendMethodology === 'AARR'
                        ? (
                          <StatusTag status='Insufficient Data'>
                            Methodology:
                            {'  '}
                            <span className='bold'>AARR</span>
                          </StatusTag>
                        ) : (
                          <StatusTag status='Insufficient Data'>
                            Methodology:
                            {' '}
                            <span className='bold'>CAGR</span>
                          </StatusTag>
                        )
                }
              </div>
              {
                values.length === 0 ? 'No Data Avalaiable'
                  : (
                    <>
                      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                        <g transform={`translate(${margin.left},${margin.top})`}>
                          <line
                            y1={y(0)}
                            y2={y(0)}
                            x1={0 - margin.left}
                            x2={graphWidth + margin.right}
                            stroke='#212121'
                            strokeWidth={1}
                          />
                          <text
                            x={0 - margin.left + 2}
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
                                    x1={0 - margin.left}
                                    x2={graphWidth + margin.right}
                                    stroke='#CCC'
                                    strokeWidth={1}
                                    strokeDasharray='4,8'
                                    opacity={d === 0 ? 0 : 1}
                                  />
                                  <text
                                    x={0 - margin.left + 2}
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
                            <path d={lineShape1(values as any) as string} fill='none' stroke='#0969FA' strokeWidth={2} />
                            {
                              values.map((d: any, i: number) => (
                                <g
                                  key={i}
                                >
                                  <circle
                                    cx={x(d.year)}
                                    cy={y(d.value)}
                                    r={4}
                                    fill='#0969FA'
                                  />
                                  <text
                                    x={x(d.year)}
                                    y={y(d.value)}
                                    dy={-8}
                                    fontSize={values.length > 10 ? values.length > 20 ? 0 : 11 : 12}
                                    textAnchor='middle'
                                    fill='#082753'
                                  >
                                    {typeof d.value === 'number' ? Math.abs(d.value) < 1 ? Math.abs(d.value) < 0.09 ? d.value.toFixed(3) : d.value.toFixed(2) : Math.abs(d.value) > 1000 ? format('.2s')(d.value).replace('G', 'B') : format('.3s')(d.value) : d.value}
                                  </text>
                                </g>
                              ))
                            }
                            {
                              data.targets ? (
                                <g>
                                  <line
                                    x1={0 - margin.left}
                                    x2={graphWidth + margin.right}
                                    y1={y(data.targets.targetValue)}
                                    y2={y(data.targets.targetValue)}
                                    stroke='#59BA47'
                                    strokeWidth={1}
                                  />
                                  <text
                                    fill='#59BA47'
                                    fontSize={14}
                                    y={y(data.targets.targetValue)}
                                    x={graphWidth + margin.right}
                                    fontWeight='bold'
                                    textAnchor='end'
                                    dy={-5}
                                  >
                                    Target
                                  </text>
                                  <text
                                    fill='#59BA47'
                                    fontSize={14}
                                    fontWeight='bold'
                                    y={y(data.targets.targetValue)}
                                    x={graphWidth + margin.right}
                                    textAnchor='end'
                                    dy={15}
                                  >
                                    {data.targets.targetValue}
                                  </text>
                                </g>
                              )
                                : null
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
                                      stroke='#666'
                                      strokeWidth={1}
                                    />
                                    <rect
                                      fill='#fff'
                                      opacity={0.8}
                                      y={0}
                                      x={x(hoverData.year) > graphWidth / 2 ? x(hoverData.year) - ((`${hoverData.value}`.length + 6) * 7) - 3 : x(hoverData.year) + 2}
                                      height={20}
                                      width={(`${hoverData.value}`.length + 6) * 7}
                                    />
                                    <text
                                      fill='#666'
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
                                      {hoverData.value === null ? 'NA' : hoverData.value}
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
                    </>
                  )
              }
            </RootEl>
            <DownLoadButton
              type='button'
              onClick={() => {
                if (GraphRef.current) {
                  const node = GraphRef.current;
                  domtoimage
                    .toPng(node as any, { height: (node as any).scrollHeight })
                    .then((dataUrl: any) => {
                      const link = document.createElement('a');
                      link.download = 'graph.png';
                      link.href = dataUrl;
                      link.click();
                    });
                }
              }}
            >
              Download Image
              <FileImageTwoTone style={{ fontSize: '18px' }} />
            </DownLoadButton>
          </ParentEl>
        )}
    </>
  );
};
