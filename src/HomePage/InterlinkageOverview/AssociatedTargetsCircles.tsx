import { useEffect, useState } from 'react';
import {
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import { SDG_COLOR_ARRAY } from '../../Constants';

interface Props {
  data: any;
  setAssociatedHoverData: any;
  totalNoOfReports: number;
}

export const AssociatedTargetsCircles = (props: Props) => {
  const { data, setAssociatedHoverData, totalNoOfReports } = props;
  const [nodeData, setNodeData] = useState<any>(null);
  const gridSize = 200;
  const height = 250;
  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(data.associatedTargets)).filter((d: any) => (d.noOfReportsWithTarget / totalNoOfReports) > 0.1);
    dataTemp.unshift({
      target: data.target,
      sdg: data.sdg,
      noOfReportsWithTarget: data.noOfReportsWithTarget,
      primaryTarget: true,
    });
    forceSimulation(dataTemp)
      .force('charge', forceManyBody().strength(0))
      .force('y', forceX().strength(5).x((d: any) => (((d.sdg - 1) * gridSize) + (gridSize / 2))))
      .force('x', forceY().strength(5).y(height / 2))
      .force('collision', forceCollide().radius((d: any) => (d.primaryTarget ? ((d.noOfReportsWithTarget / totalNoOfReports) * 100) : ((d.noOfReportsWithTarget / totalNoOfReports) * 100) + 3)))
      .tick(10)
      .on('end', () => { setNodeData(dataTemp); });
  }, []);
  return (
    <>
      {
        nodeData
          ? (
            <g>
              {
                nodeData.map((d: any, i: number) => (
                  <g
                    key={i}
                    transform={`translate(${d.x},${d.y})`}
                    style={{ cursor: 'pointer', display: d.primaryTarget ? 'none' : 'inline' }}
                    onMouseEnter={(event) => {
                      setAssociatedHoverData({
                        target: d.target,
                        primaryTarget: data.target,
                        noOfReportsWithTarget: d.noOfReportsWithTarget,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseMove={(event) => {
                      setAssociatedHoverData({
                        target: d.target,
                        primaryTarget: data.target,
                        noOfReportsWithTarget: d.noOfReportsWithTarget,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setAssociatedHoverData(undefined);
                    }}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={(d.noOfReportsWithTarget / totalNoOfReports) * 100}
                      stroke={SDG_COLOR_ARRAY[d.sdg - 1]}
                      strokeWidth={2}
                      fill='#fff'
                    />
                    {
                      (d.noOfReportsWithTarget / totalNoOfReports) * 100 > 20
                        ? (
                          <text
                            fill={SDG_COLOR_ARRAY[d.sdg - 1]}
                            textAnchor='middle'
                            fontSize={24}
                            fontWeight='bold'
                            dy={7}
                          >
                            {d.target}
                          </text>
                        ) : null
                    }
                  </g>
                ))
              }
            </g>
          )
          : null
      }
    </>
  );
};
