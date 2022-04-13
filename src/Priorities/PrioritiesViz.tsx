import { PrioritiesDataType } from '../Types';

const SDGPriorities: PrioritiesDataType[] = require('../Data/SDGPrioritiesIraq.json');

export const PrioritiesViz = () => {
  const rowHeight = 25;
  const headerRowHeight = 60;
  let noOfPriorities = 0;
  SDGPriorities.forEach((d) => {
    noOfPriorities += d.priorities.length;
  });

  const Blue = '#006EB5';

  const x1 = 100;
  const x2 = 30;
  const x3 = 175 + (SDGPriorities.length * 30);
  const x3Gap = 30;
  const x4 = 30;
  const paddingBetweenCategories = 20;

  const cornerRadius = 20;
  const cornerRadiusSmall = 10;

  const colorArray = [
    '#AF5F68',
    '#00859B',
    '#9368A1',
    '#6A7E3F',
    '#D12800',
  ];

  let prevHeight = headerRowHeight;
  const totalPrevPriorities = [0];

  for (let i = 0; i < SDGPriorities.length - 1; i += 1) {
    totalPrevPriorities.push(totalPrevPriorities[i] + SDGPriorities[i].priorities.length);
  }
  const svgHeight = ((noOfPriorities + 1) * rowHeight) + (paddingBetweenCategories * (SDGPriorities.length - 1)) + headerRowHeight + 20;
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
          SDG Priorites
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
          SDGPriorities.map((_d, i) => (
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
            SDGPriorities.map((d, i) => {
              if (i > 0) { prevHeight = totalPrevPriorities[i] * rowHeight; }
              return (
                <g transform={`translate(${x1 + x2 + cornerRadius * 2 + 5},${(i + 1) * headerRowHeight})`} key={i}>
                  <text
                    x={0}
                    y={0}
                    dx={10}
                    dy={-5}
                    fontSize={16}
                    fill={colorArray[i % colorArray.length]}
                  >
                    {d.priorityType}
                    {' '}
                    (
                    {d.priorities.length}
                    )
                  </text>
                  <circle
                    cx={0}
                    cy={0}
                    r={5}
                    fill='#ffffff'
                    stroke={colorArray[i % colorArray.length]}
                    strokeWidth={3}
                  />
                  {
                  d.priorities.map((p, k) => {
                    if (i === 0) {
                      return (
                        <g key={k}>
                          <path
                            d={`M 5,0 h ${x3 - (i * x3Gap)} a${cornerRadiusSmall},${cornerRadiusSmall} 0 0 1 ${cornerRadiusSmall},${cornerRadiusSmall} v ${((k + 1) * rowHeight) - cornerRadiusSmall * 2} a${cornerRadiusSmall},${cornerRadiusSmall} 1 0 0 ${cornerRadiusSmall},${cornerRadiusSmall} h ${x4 + (i * x3Gap)}`}
                            fill='none'
                            stroke={colorArray[i % colorArray.length]}
                            strokeWidth={2}
                            shapeRendering='crispEdge'
                          />
                          <circle
                            cx={x3 + x4 + cornerRadius + 5}
                            cy={((k + 1) * rowHeight)}
                            r={3}
                            fill='#ffffff'
                            stroke={colorArray[i % colorArray.length]}
                            strokeWidth={2}
                          />
                          <text
                            x={x3 + x4 + cornerRadius + 5}
                            y={((k + 1) * rowHeight)}
                            fill={colorArray[i % colorArray.length]}
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
                          d={`M 5,0 h ${x3 - (i * x3Gap)} a${cornerRadiusSmall},${cornerRadiusSmall} 0 0 1 ${cornerRadiusSmall},${cornerRadiusSmall} v ${((k + 1) * rowHeight) - (cornerRadiusSmall * 2) + prevHeight - (i * headerRowHeight) + (i * paddingBetweenCategories)} a${cornerRadiusSmall},${cornerRadiusSmall} 1 0 0 ${cornerRadiusSmall},${cornerRadiusSmall} h ${x4 + (i * x3Gap)}`}
                          fill='none'
                          stroke={colorArray[i % colorArray.length]}
                          strokeWidth={2}
                          shapeRendering='crispEdge'
                        />
                        <circle
                          cx={x3 + x4 + cornerRadius + 5}
                          cy={((k + 1) * rowHeight) + prevHeight - (i * headerRowHeight) + (i * 20)}
                          r={3}
                          fill='#ffffff'
                          stroke={colorArray[i % colorArray.length]}
                          strokeWidth={2}
                        />
                        <text
                          x={x3 + x4 + cornerRadius + 5}
                          y={((k + 1) * rowHeight) + prevHeight - (i * headerRowHeight) + (i * 20)}
                          fill={colorArray[i % colorArray.length]}
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
                </g>
              );
            })
            }
      </g>
    </svg>
  );
};
