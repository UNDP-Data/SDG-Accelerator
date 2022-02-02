import { scaleLinear } from 'd3-scale';
import { curveCardinal, line } from 'd3-shape';
import styled from 'styled-components';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { useState } from 'react';
import { HoverDataType, CountryListTypeSDGPush } from '../../Types';

interface Props {
  data: CountryListTypeSDGPush;
  indicator: string;
}

const SVG = styled.svg`
  margin-top: 2rem;
`;

export const LineChart = (props: Props) => {
  const { data, indicator } = props;
  const indicatorData = data.Data[data.Data.findIndex((d) => d.Indicator === indicator)];
  const graphWidth = 640;
  const graphHeight = 410;
  const marginLeft = 5;
  const marginRight = 5;
  const marginTop = 15;
  const marginBottom = 20;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);

  const minYear = minBy(indicatorData.yearlyData, 'year') ? minBy(indicatorData.yearlyData, 'year')?.year : 2020;
  const maxYear = maxBy(indicatorData.yearlyData, 'year') ? maxBy(indicatorData.yearlyData, 'year')?.year : 2050;
  const maxValueWithPush = maxBy(indicatorData.yearlyData, 'withSDGPush') ? maxBy(indicatorData.yearlyData, 'withSDGPush')?.withSDGPush : 100;
  const maxValueWithOutPush = maxBy(indicatorData.yearlyData, 'withoutSDGPush') ? maxBy(indicatorData.yearlyData, 'withoutSDGPush')?.withoutSDGPush : 100;
  const maxValue = (maxValueWithPush as number) > (maxValueWithOutPush as number) ? maxValueWithPush : maxValueWithOutPush;
  const x = scaleLinear<number, number>().domain([minYear as number, maxYear as number]).range([marginLeft, graphWidth]);
  const y = scaleLinear().domain([0, maxValue as number]).range([graphHeight, marginTop]).nice();
  const lineShapeWithPush = line()
    .x((d: any) => x(d.year))
    .y((d: any) => y(d.withSDGPush))
    .curve(curveCardinal.tension(0.2));
  const lineShapeWOPush = line()
    .x((d: any) => x(d.year))
    .y((d: any) => y(d.withoutSDGPush))
    .curve(curveCardinal.tension(0.2));
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(5);
  return (
    <SVG style={{ width: '100%' }} viewBox={`0 0 ${graphWidth + marginLeft + marginRight} ${graphHeight + marginTop + marginBottom}`}>
      <g>
        <path d={lineShapeWithPush(indicatorData.yearlyData as any) as string} fill='none' stroke='#59BA47' strokeWidth={2} shapeRendering='geometricPrecision' />
        <path d={lineShapeWOPush(indicatorData.yearlyData as any) as string} fill='none' stroke='#D12800' strokeWidth={2} shapeRendering='geometricPrecision' />
      </g>
      {
        hoverData ? <line x1={x(hoverData.year)} x2={x(hoverData.year)} y1={y(0)} y2={marginTop} stroke='#212121' fill='none' /> : null
      }
      <g>
        {
          indicatorData.yearlyData.map((d, i) => (
            <g key={i}>
              <circle
                cx={x(d.year)}
                cy={y(d.withSDGPush)}
                r={5}
                fill='#59BA47'
                onMouseEnter={(event) => {
                  setHoverData({
                    country: data['Country or Area'],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year: d.year,
                    withSDGPush: d.withSDGPush,
                    withoutSDGPush: d.withoutSDGPush,
                  });
                }}
                onMouseMove={(event) => {
                  setHoverData({
                    country: data['Country or Area'],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year: d.year,
                    withSDGPush: d.withSDGPush,
                    withoutSDGPush: d.withoutSDGPush,
                  });
                }}
                onMouseLeave={() => {
                  setHoverData(undefined);
                }}
              />
              <circle
                cx={x(d.year)}
                cy={y(d.withoutSDGPush)}
                r={5}
                fill='#D12800'
                onMouseEnter={(event) => {
                  setHoverData({
                    country: data['Country or Area'],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year: d.year,
                    withSDGPush: d.withSDGPush,
                    withoutSDGPush: d.withoutSDGPush,
                  });
                }}
                onMouseMove={(event) => {
                  setHoverData({
                    country: data['Country or Area'],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year: d.year,
                    withSDGPush: d.withSDGPush,
                    withoutSDGPush: d.withoutSDGPush,
                  });
                }}
                onMouseLeave={() => {
                  setHoverData(undefined);
                }}
              />
              <rect
                x={x(d.year) - 3}
                y={0}
                width={6}
                height={graphHeight}
                fill='#266291'
                opacity={0}
                onMouseEnter={(event) => {
                  setHoverData({
                    country: data['Country or Area'],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year: d.year,
                    withSDGPush: d.withSDGPush,
                    withoutSDGPush: d.withoutSDGPush,
                  });
                }}
                onMouseMove={(event) => {
                  setHoverData({
                    country: data['Country or Area'],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year: d.year,
                    withSDGPush: d.withSDGPush,
                    withoutSDGPush: d.withoutSDGPush,
                  });
                }}
                onMouseLeave={() => {
                  setHoverData(undefined);
                }}
              />
            </g>
          ))
        }
      </g>
      <g>
        {yTicks.map((d, i) => (
          <g key={i}>
            <line
              x1={marginLeft}
              y1={y(d)}
              x2={graphWidth}
              y2={y(d)}
              stroke='#AAA'
              strokeWidth={1}
              opacity={d === 0 ? 0 : 1}
              strokeDasharray='4 8'
              shapeRendering='crispEdge'
            />
            <text
              x={marginLeft}
              y={y(d)}
              fontSize='10px'
              textAnchor='start'
              dy='-5px'
              fill='#919399'
            >
              {d}
            </text>
          </g>
        ))}
      </g>
      <g>
        <line
          x1={marginLeft}
          y1={y(0)}
          x2={graphWidth}
          y2={y(0)}
          stroke='#212121'
          strokeWidth={1}
          shapeRendering='crispEdge'
        />
        {xTicks.map((d, i) => (
          <text
            key={i}
            y={graphHeight + marginBottom + marginTop}
            x={x(d)}
            fontSize='10px'
            textAnchor={d === minYear ? 'start' : d === maxYear ? 'end' : 'middle'}
            dy='-15px'
            fill='#212121'
          >
            {d}
          </text>
        ))}
      </g>
    </SVG>
  );
};
