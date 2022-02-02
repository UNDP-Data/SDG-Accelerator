import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import styled from 'styled-components';
import { CountryListTypeSDGPush, ScatterHoverDataType } from '../../Types';

interface Props {
  year: number;
  xAxis: string;
  yAxis: string;
  data: CountryListTypeSDGPush[];
}

const RootEl = styled.div`
  background-color: var(--black-100);
  position: relative;
  margin-top: 2rem;
`;

const GraphDiv = styled.div`
  display: flex;
`;

const DivHalf = styled.div`
  width: calc(50% - 1px);
  &:first-of-type {
    border-right: 1px solid var(--black-500);
  }
  &:last-of-type {
    border-left: 1px solid var(--black-500);
  }
`;

const MapTitle = styled.div`
  background-color: var(--black-400);
  font-size: 1.6rem;
  font-weight: bold;
  font-style: italic;
  padding: 0.5rem 1rem;
  text-align: center;
`;

export const ScatterPlot = (props: Props) => {
  const {
    year,
    data,
    xAxis,
    yAxis,
  } = props;
  const width = 660;
  const height = 560;

  const marginLeft = 75;
  const marginRight = 20;
  const marginTop = 40;
  const marginBottom = 40;

  const graphWidth = width - marginLeft - marginRight;
  const graphHeight = height - marginTop - marginBottom;

  const [hoverData, setHoverData] = useState<ScatterHoverDataType | undefined>(undefined);
  const x = scaleLinear().domain([0, 100]).range([0, graphWidth]);
  const y = scaleLinear().domain([0, 100]).range([graphHeight, 0]);
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(5);
  return (
    <RootEl>
      <>
        <GraphDiv id='graph-node'>
          <DivHalf>
            <MapTitle>Without SDG Push</MapTitle>
            <svg width='100%' viewBox={`0 0 ${width} ${height}`}>
              <g transform={`translate(${marginLeft},${marginTop})`}>
                {
                  data.map((d, i) => (
                    <circle
                      key={i}
                      cx={x(d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush)}
                      cy={y(d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush)}
                      r={5}
                      stroke='#0969FA'
                      fill='#0969FA'
                      fillOpacity={0.7}
                      opacity={hoverData
                        ? hoverData.country === d['Country or Area'] ? 1 : 0.2 : 1}
                      onMouseEnter={(event) => {
                        setHoverData({
                          country: d['Country or Area'],
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          indicatorX: xAxis,
                          indicatorY: yAxis,
                          withoutSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                          },
                          withSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                          },
                        });
                      }}
                      onMouseMove={(event) => {
                        setHoverData({
                          country: d['Country or Area'],
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          indicatorX: xAxis,
                          indicatorY: yAxis,
                          withoutSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                          },
                          withSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                          },
                        });
                      }}
                      onMouseLeave={() => {
                        setHoverData(undefined);
                      }}
                    />
                  ))
                }
                <g>
                  <line
                    x1={x(0)}
                    y1={0}
                    x2={x(0)}
                    y2={graphHeight}
                    stroke='#212121'
                    strokeWidth={1}
                    shapeRendering='crispEdge'
                  />
                  {yTicks.map((d, i) => (
                    <g key={i}>
                      <line
                        x1={0}
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
                        x={0}
                        y={y(d)}
                        fontSize='10px'
                        textAnchor='end'
                        dy='3px'
                        dx='-3px'
                        fill='#666'
                      >
                        {d}
                      </text>
                    </g>
                  ))}
                  <text
                    x={graphWidth / 2}
                    y={graphHeight}
                    fontSize='14px'
                    textAnchor='middle'
                    dy='30px'
                    fill='#212121'
                    fontWeight={700}
                  >
                    {xAxis}
                  </text>
                </g>
                <g>
                  <line
                    x1={0}
                    y1={y(0)}
                    x2={graphWidth}
                    y2={y(0)}
                    stroke='#212121'
                    strokeWidth={1}
                    shapeRendering='crispEdge'
                  />
                  {xTicks.map((d, i) => (
                    <g key={i}>
                      <line
                        x1={x(d)}
                        y1={0}
                        x2={x(d)}
                        y2={graphHeight}
                        stroke='#AAA'
                        strokeWidth={1}
                        opacity={d === 0 ? 0 : 1}
                        strokeDasharray='4 8'
                        shapeRendering='crispEdge'
                      />
                      <text
                        key={i}
                        y={graphHeight}
                        x={x(d)}
                        fontSize='10px'
                        textAnchor='middle'
                        dy='12px'
                        fill='#666'
                      >
                        {d}
                      </text>
                    </g>
                  ))}
                  <text
                    transform={`translate(${0},${graphHeight / 2}) rotate(-90)`}
                    x={0}
                    y={0}
                    fontSize='14px'
                    textAnchor='middle'
                    dy='-25px'
                    fill='#212121'
                    fontWeight={700}
                  >
                    {yAxis}
                  </text>
                </g>
              </g>
            </svg>
          </DivHalf>
          <DivHalf>
            <MapTitle>With SDG Push</MapTitle>
            <svg width='100%' viewBox={`0 0 ${width} ${height}`}>
              <g transform={`translate(${marginLeft},${marginTop})`}>
                {
                  data.map((d, i) => (
                    <circle
                      key={i}
                      cx={x(d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush)}
                      cy={y(d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush)}
                      r={5}
                      stroke='#0969FA'
                      fill='#0969FA'
                      fillOpacity={0.7}
                      opacity={hoverData
                        ? hoverData.country === d['Country or Area'] ? 1 : 0.2 : 1}
                      onMouseEnter={(event) => {
                        setHoverData({
                          country: d['Country or Area'],
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          indicatorX: xAxis,
                          indicatorY: yAxis,
                          withoutSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                          },
                          withSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                          },
                        });
                      }}
                      onMouseMove={(event) => {
                        setHoverData({
                          country: d['Country or Area'],
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          indicatorX: xAxis,
                          indicatorY: yAxis,
                          withoutSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withoutSDGPush,
                          },
                          withSDGPush: {
                            x: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === xAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                            y: d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData[d.Data[d.Data.findIndex((indicator) => indicator.Indicator === yAxis)].yearlyData.findIndex((years) => years.year === year)].withSDGPush,
                          },
                        });
                      }}
                      onMouseLeave={() => {
                        setHoverData(undefined);
                      }}
                    />
                  ))
                }
                <g>
                  <line
                    x1={x(0)}
                    y1={0}
                    x2={x(0)}
                    y2={graphHeight}
                    stroke='#212121'
                    strokeWidth={1}
                    shapeRendering='crispEdge'
                  />
                  {yTicks.map((d, i) => (
                    <g key={i}>
                      <line
                        x1={0}
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
                        x={0}
                        y={y(d)}
                        fontSize='10px'
                        textAnchor='end'
                        dy='3px'
                        dx='-3px'
                        fill='#666'
                      >
                        {d}
                      </text>
                    </g>
                  ))}
                  <text
                    x={graphWidth / 2}
                    y={graphHeight}
                    fontSize='14px'
                    textAnchor='middle'
                    dy='30px'
                    fill='#212121'
                    fontWeight={700}
                  >
                    {xAxis}
                  </text>
                </g>
                <g>
                  <line
                    x1={0}
                    y1={y(0)}
                    x2={graphWidth}
                    y2={y(0)}
                    stroke='#212121'
                    strokeWidth={1}
                    shapeRendering='crispEdge'
                  />
                  {xTicks.map((d, i) => (
                    <g key={i}>
                      <line
                        x1={x(d)}
                        y1={0}
                        x2={x(d)}
                        y2={graphHeight}
                        stroke='#AAA'
                        strokeWidth={1}
                        opacity={d === 0 ? 0 : 1}
                        strokeDasharray='4 8'
                        shapeRendering='crispEdge'
                      />
                      <text
                        key={i}
                        y={graphHeight}
                        x={x(d)}
                        fontSize='10px'
                        textAnchor='middle'
                        dy='12px'
                        fill='#666'
                      >
                        {d}
                      </text>
                    </g>
                  ))}
                  <text
                    transform={`translate(${0},${graphHeight / 2}) rotate(-90)`}
                    x={0}
                    y={0}
                    fontSize='14px'
                    textAnchor='middle'
                    dy='-25px'
                    fill='#212121'
                    fontWeight={700}
                  >
                    {yAxis}
                  </text>
                </g>
              </g>
            </svg>
          </DivHalf>
        </GraphDiv>
      </>
    </RootEl>
  );
};
