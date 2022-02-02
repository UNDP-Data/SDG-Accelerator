import styled from 'styled-components';
import sortBy from 'lodash.sortby';
import { scaleLinear } from 'd3-scale';
import { CountryListTypeSDGPush } from '../../Types';

interface Props {
  year: number;
  sortedBy: 'Country Name' | 'Changes With and Without SDG Push' | 'Value With SDG Push' | 'Value Without SDG Push';
  indicator: string;
  data: CountryListTypeSDGPush[];
  worldData: CountryListTypeSDGPush;
}

const GraphSvgEl = styled.div`
  max-height: 50rem;
  overflow: auto;
`;

export const DumbellChart = (props: Props) => {
  const {
    data,
    year,
    sortedBy,
    indicator,
    worldData,
  } = props;
  const graphWidth = 1280;
  const leftPadding = 310;
  const rightPadding = 20;
  const rowHeight = 35;
  const marginTop = 30;

  const sortByKey = {
    'Country Name': 'country',
    'Changes With and Without SDG Push': 'diff',
    'Value With SDG Push': 'indicatorWithPush',
    'Value Without SDG Push': 'indicatorWithoutPush',
  };

  const formattedData = data.map((d) => {
    if (d.Data.findIndex((el) => el.Indicator === indicator) !== -1) {
      const indicatorIndx = d.Data.findIndex((el) => el.Indicator === indicator);
      const yearIndx = d.Data[indicatorIndx].yearlyData.findIndex((el) => el.year === year);
      return ({
        country: d['Country or Area'],
        indicatorWithPush: d.Data[indicatorIndx].yearlyData[yearIndx].withSDGPush,
        indicatorWithoutPush: d.Data[indicatorIndx].yearlyData[yearIndx].withoutSDGPush,
        diff: d.Data[indicatorIndx].yearlyData[yearIndx].withSDGPush - d.Data[indicatorIndx].yearlyData[yearIndx].withoutSDGPush,
      });
    }
    return null;
  });
  let arrayLength = 0;
  formattedData.forEach((d) => {
    arrayLength = d ? arrayLength + 1 : arrayLength;
  });

  const worldIndicatorIndx = worldData.Data.findIndex((el) => el.Indicator === indicator);
  const worldYearIndx = worldData.Data[worldIndicatorIndx].yearlyData.findIndex((el) => el.year === year);
  const WorldFormatedData = {
    country: worldData['Country or Area'],
    indicatorWithPush: worldData.Data[worldIndicatorIndx].yearlyData[worldYearIndx].withSDGPush,
    indicatorWithoutPush: worldData.Data[worldIndicatorIndx].yearlyData[worldYearIndx].withoutSDGPush,
    diff: worldData.Data[worldIndicatorIndx].yearlyData[worldYearIndx].withSDGPush - worldData.Data[worldIndicatorIndx].yearlyData[worldYearIndx].withoutSDGPush,
  };
  const sortedData = sortBy(formattedData, sortByKey[sortedBy]);
  const xPos = scaleLinear().domain([0, 100]).range([0, graphWidth - leftPadding - rightPadding]).nice();
  return (
    <>
      <svg style={{ width: '100%' }} height={35} viewBox={`0 0 ${graphWidth} 35`}>
        <text
          x={0}
          y={0}
          dy='30px'
          fontSize='14px'
          color='#212121'
          fontWeight={700}
        >
          Countries
        </text>
        <g>
          <text
            x={leftPadding}
            y={0}
            dy='30px'
            fontSize='14px'
            color='#212121'
            fontWeight={700}
          >
            SDG Push Difference
          </text>
          <circle
            cx={leftPadding + 155}
            cy={25}
            r={5}
            fill='#D12800'
          />
          <text
            x={leftPadding + 165}
            y={0}
            dy='30px'
            fontSize='14px'
            color='#D12800'
          >
            Without SDG Push
          </text>
          <circle
            cx={leftPadding + 305}
            cy={25}
            r={5}
            fill='#59BA47'
          />
          <text
            x={leftPadding + 315}
            y={0}
            dy='30px'
            fontSize='14px'
            color='#59BA47'
          >
            With SDG Push
          </text>
        </g>
      </svg>
      <GraphSvgEl>
        <svg style={{ width: '100%' }} viewBox={`0 0 ${graphWidth} ${(arrayLength * rowHeight) + marginTop}`}>
          {
            sortedData.map((d, i) => (
              d
                ? (
                  <g
                    key={i}
                    transform={`translate(0,${marginTop + (i * rowHeight)})`}
                  >
                    <text
                      x={0}
                      y={rowHeight / 2}
                      dy='3px'
                      fontSize='14px'
                      color='#212121'
                    >
                      {d.country}
                    </text>
                    <line
                      x1={leftPadding}
                      x2={graphWidth - rightPadding}
                      y1={rowHeight / 2}
                      y2={rowHeight / 2}
                      stroke='#AAA'
                      strokeWidth={1}
                      strokeDasharray='4 8'
                      shapeRendering='crispEdge'
                    />
                    <line
                      x1={xPos(d.indicatorWithoutPush) + leftPadding}
                      x2={xPos(d.indicatorWithPush) + leftPadding}
                      y1={rowHeight / 2}
                      y2={rowHeight / 2}
                      stroke={d.indicatorWithoutPush > d.indicatorWithPush ? '#D12800' : '#59BA47'}
                      strokeWidth={1}
                      shapeRendering='crispEdge'
                    />
                    <circle
                      cx={xPos(d.indicatorWithoutPush) + leftPadding}
                      cy={rowHeight / 2}
                      r={7}
                      fill='#D12800'
                    />
                    <text
                      x={xPos(d.indicatorWithoutPush) + leftPadding}
                      y={0}
                      dy='7px'
                      fontSize='10px'
                      fill='#D12800'
                      textAnchor='middle'
                    >
                      {(d.indicatorWithoutPush).toFixed(2)}
                    </text>
                    <circle
                      cx={xPos(d.indicatorWithPush) + leftPadding}
                      cy={rowHeight / 2}
                      r={7}
                      fill='#59BA47'
                    />
                    <text
                      x={xPos(d.indicatorWithPush) + leftPadding}
                      y={0}
                      dy='7px'
                      fontSize='10px'
                      fill='#59BA47'
                      textAnchor='middle'
                    >
                      {(d.indicatorWithPush).toFixed(2)}
                    </text>
                  </g>
                ) : null
            ))
          }
          <line
            x1={xPos(WorldFormatedData.indicatorWithoutPush) + leftPadding}
            x2={xPos(WorldFormatedData.indicatorWithoutPush) + leftPadding}
            y1={0}
            y2={(arrayLength * rowHeight) + marginTop}
            stroke='#D12800'
            strokeWidth={1}
            shapeRendering='crispEdge'
          />
          <rect
            x={WorldFormatedData.diff < 0 ? xPos(WorldFormatedData.indicatorWithoutPush) + leftPadding : xPos(WorldFormatedData.indicatorWithoutPush) + leftPadding - 176}
            y={0}
            fill='#D12800'
            width={176}
            height={18}
          />
          <text
            x={WorldFormatedData.diff < 0 ? xPos(WorldFormatedData.indicatorWithoutPush) + leftPadding + 5 : xPos(WorldFormatedData.indicatorWithoutPush) + leftPadding - 5}
            y={0}
            dy='13'
            fontSize='12px'
            fill='#fff'
            textAnchor={WorldFormatedData.diff < 0 ? 'start' : 'end'}
          >
            World Without SDG Push:
            {' '}
            {(WorldFormatedData.indicatorWithoutPush).toFixed(2)}
          </text>
          <line
            x1={xPos(WorldFormatedData.indicatorWithPush) + leftPadding}
            x2={xPos(WorldFormatedData.indicatorWithPush) + leftPadding}
            y1={0}
            y2={(arrayLength * rowHeight) + marginTop}
            stroke='#59BA47'
            strokeWidth={1}
            shapeRendering='crispEdge'
          />
          <rect
            x={WorldFormatedData.diff > 0 ? xPos(WorldFormatedData.indicatorWithPush) + leftPadding : xPos(WorldFormatedData.indicatorWithPush) + leftPadding - 160}
            y={0}
            fill='#59BA47'
            width={160}
            height={18}
          />
          <text
            x={WorldFormatedData.diff > 0 ? xPos(WorldFormatedData.indicatorWithPush) + leftPadding + 5 : xPos(WorldFormatedData.indicatorWithPush) + leftPadding - 5}
            y={0}
            dy='13'
            fontSize='12px'
            fill='#fff'
            textAnchor={WorldFormatedData.diff > 0 ? 'start' : 'end'}
          >
            World With SDG Push:
            {' '}
            {(WorldFormatedData.indicatorWithPush).toFixed(2)}
          </text>
        </svg>
      </GraphSvgEl>
    </>
  );
};
