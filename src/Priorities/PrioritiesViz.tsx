import maxBy from 'lodash.maxby';
import sortBy from 'lodash.sortby';
import { useState } from 'react';
import SDGGoalList from '../Data/SDGGoalList.json';

interface Props {
  data: any;
}

export const PrioritiesViz = (props: Props) => {
  const { data } = props;
  const dataFormatted = sortBy(Object.keys(data), (d) => parseInt(d.split(' ')[1], 10)).map((d) => ({
    priorityType: d,
    priorities: data[d],
  }));
  const [selectedGoal, setSelectedGoal] = useState<string>(dataFormatted[0].priorityType);
  const rowHeight = 25;
  const headerRowHeight = 60;

  const Blue = '#006EB5';

  const x1 = 100;
  const x2 = 30;
  const x3 = 175 + (dataFormatted.length * 30);
  const x3Gap = 0;
  const x4 = 30;

  const cornerRadius = 20;
  const cornerRadiusSmall = 10;

  const radiusFactor = 25 / (maxBy(dataFormatted, (d) => d.priorities.length)?.priorities.length as number);

  const colorArray = [
    '#006EB5',
    '#e5243b',
    '#DDA63A',
    '#4C9F38',
    '#C5192D',
    '#FF3A21',
    '#26BDE2',
    '#FCC30B',
    '#A21942',
    '#FD6925',
    '#DD1367',
    '#FD9D24',
    '#BF8B2E',
    '#3F7E44',
    '#0A97D9',
    '#56C02B',
    '#00689D',
    '#19486A',
  ];

  const svgHeight = (((dataFormatted[dataFormatted.findIndex((d) => d.priorityType === selectedGoal)].priorities.length) * rowHeight) - cornerRadiusSmall * 2) + (dataFormatted.findIndex((d) => d.priorityType === selectedGoal)) * headerRowHeight + headerRowHeight + 70 > (dataFormatted.length) * headerRowHeight + headerRowHeight + 70 ? (((dataFormatted[dataFormatted.findIndex((d) => d.priorityType === selectedGoal)].priorities.length) * rowHeight) - cornerRadiusSmall * 2) + (dataFormatted.findIndex((d) => d.priorityType === selectedGoal)) * headerRowHeight + headerRowHeight + 70 : (dataFormatted.length) * headerRowHeight + headerRowHeight + 70;

  return (
    <svg width='100%' viewBox={`0 0 1280 ${svgHeight}`}>
      <g transform='translate(10,30)'>
        <text
          x={0}
          y={0}
          dx={10}
          dy={-5}
          fontSize={14}
          fontWeight={700}
          fill={Blue}
        >
          Acceleration Opportunities
        </text>
        <circle
          cx={0}
          cy={0}
          r={5}
          fill='#ffffff'
          stroke={Blue}
          strokeWidth={3}
        />
        {
          dataFormatted.map((_d, i) => (
            <path
              key={i}
              d={`M 5,0 h ${x1} a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} v ${(i + 1) * headerRowHeight - cornerRadius * 2} a${cornerRadius},${cornerRadius} 1 0 0 ${cornerRadius},${cornerRadius} h ${x2}`}
              fill='none'
              stroke={Blue}
              strokeWidth={2}
              shapeRendering='crispEdge'
            />
          ))
        }
        {
          dataFormatted.map((d, i) => (
            <g transform={`translate(${x1 + x2 + cornerRadius * 2 + 5},${(i + 1) * headerRowHeight})`} key={i}>
              {
                selectedGoal === d.priorityType
                  ? (
                    <>
                      {
                        d.priorities.map((p: any, k: number) => {
                          if (i === 0) {
                            return (
                              <g key={k}>
                                <path
                                  d={`M 5,0 h ${x3 - (i * x3Gap)} a${cornerRadiusSmall},${cornerRadiusSmall} 0 0 1 ${cornerRadiusSmall},${cornerRadiusSmall} v ${((k + 1) * rowHeight) - cornerRadiusSmall * 2} a${cornerRadiusSmall},${cornerRadiusSmall} 1 0 0 ${cornerRadiusSmall},${cornerRadiusSmall} h ${x4 + (i * x3Gap)}`}
                                  fill='none'
                                  stroke={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                                  strokeWidth={2}
                                  shapeRendering='crispEdge'
                                />
                                <circle
                                  cx={x3 + x4 + cornerRadius + 5}
                                  cy={((k + 1) * rowHeight)}
                                  r={3}
                                  fill='#ffffff'
                                  stroke={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                                  strokeWidth={2}
                                />
                                <text
                                  x={x3 + x4 + cornerRadius + 5}
                                  y={((k + 1) * rowHeight)}
                                  fill={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                                  fontSize={14}
                                  dx={8}
                                  dy={4}
                                >
                                  {p}
                                </text>
                              </g>
                            );
                          }
                          return (
                            <g key={k}>
                              <path
                                d={`M 5,0 h ${x3 - (i * x3Gap)} a${cornerRadiusSmall},${cornerRadiusSmall} 0 0 1 ${cornerRadiusSmall},${cornerRadiusSmall} v ${(((k + 1) * rowHeight)) - (cornerRadiusSmall * 2)} a${cornerRadiusSmall},${cornerRadiusSmall} 1 0 0 ${cornerRadiusSmall},${cornerRadiusSmall} h ${x4 + (i * x3Gap)}`}
                                fill='none'
                                stroke={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                                strokeWidth={2}
                                shapeRendering='crispEdge'
                              />
                              <circle
                                cx={x3 + x4 + cornerRadius + 5}
                                cy={(((k + 1) * rowHeight))}
                                r={3}
                                fill='#ffffff'
                                stroke={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                                strokeWidth={2}
                              />
                              <text
                                x={x3 + x4 + cornerRadius + 5}
                                y={(((k + 1) * rowHeight))}
                                fill={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                                fontSize={14}
                                dx={8}
                                dy={4}
                              >
                                {p}
                              </text>
                            </g>
                          );
                        })
                      }
                    </>
                  ) : null
              }
              <g style={{ cursor: 'pointer' }} onClick={() => { setSelectedGoal(d.priorityType); }}>
                <text
                  x={0}
                  y={0}
                  dx={5 + radiusFactor * d.priorities.length}
                  dy={-7}
                  fontSize={14}
                  fontWeight='bold'
                  fill={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                >
                  {d.priorityType}
                  {' '}
                  (
                  {d.priorities.length}
                  )
                </text>
                <text
                  x={0}
                  y={0}
                  dx={5 + radiusFactor * d.priorities.length}
                  dy={17}
                  fontSize={16}
                  fill={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                >
                  {SDGGoalList[SDGGoalList.findIndex((goal) => goal.Goal === d.priorityType.replace('Goal', 'SDG'))]['Goal Name']}
                </text>
                <circle
                  cx={0}
                  cy={0}
                  r={radiusFactor * d.priorities.length}
                  fill='#ffffff'
                  stroke={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                  strokeWidth={3}
                />
                <circle
                  cx={0}
                  cy={0}
                  r={radiusFactor * d.priorities.length}
                  fill={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                  stroke={colorArray[parseInt(d.priorityType.split(' ')[1], 10)]}
                  fillOpacity={0.25}
                  strokeWidth={3}
                />
              </g>
            </g>
          ))
        }
      </g>
    </svg>
  );
};
