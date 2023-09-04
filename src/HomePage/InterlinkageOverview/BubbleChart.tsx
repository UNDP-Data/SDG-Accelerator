import { useEffect, useRef, useState } from 'react';
import {
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import InterlinkageDataByRegion from './interlinkagePrimaryTargetList.json';
import InterlinkageAssociatedDataByRegion from './interlinkageData.json';
import { SDG_COLOR_ARRAY } from '../../Constants';
import { AssociatedTargetsCircles } from './AssociatedTargetsCircles';
import { AssociatedTargetTooltip, Tooltip } from './LinkageTooltip';

interface Props {
  region: string;
}

export const BubbleChart = (props: Props) => {
  const { region } = props;
  const [selectedTarget, setSelectedTarget] = useState<string | undefined>(undefined);
  const [nodeData, setNodeData] = useState<any>(null);
  const gridSize = 200;
  const height = 250;
  const bubbleChartRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<any>(undefined);
  const [associatedHoverData, setAssociatedHoverData] = useState<any>(undefined);

  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(InterlinkageDataByRegion)).filter((d: any) => d.regionOrIncomeGroup === region);
    forceSimulation(dataTemp)
      .force('charge', forceManyBody().strength(0))
      .force('y', forceX().strength(5).x((d: any) => (((d.sdg - 1) * gridSize) + (gridSize / 2))))
      .force('x', forceY().strength(5).y(height / 2))
      .force('collision', forceCollide().radius((d: any) => ((d.noOfReportsWithTarget / d.noOfReports) * (gridSize / 2))))
      .tick(100)
      .on('end', () => { setNodeData(dataTemp); });
  }, []);
  return (
    <>
      <div>
        {
          nodeData
            ? (
              <div
                style={{
                  width: '100%',
                }}
                ref={bubbleChartRef}
              >
                <svg width='100%' style={{ margin: 'auto' }} viewBox={`0 0 ${17 * gridSize} ${height}`}>
                  <rect
                    x={0}
                    y={0}
                    opacity={0}
                    width={17 * gridSize}
                    height={height}
                    onClick={() => { setSelectedTarget(undefined); }}
                  />
                  <g>
                    {
                      nodeData.map((d: any, i: number) => (
                        <g
                          key={i}
                          transform={`translate(${d.x},${d.y})`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedTarget(d.primaryTargets);
                          }}
                          onMouseEnter={(event) => {
                            setHoverData({
                              primaryTarget: d.primaryTargets,
                              noOfReportsTotal: d.noOfReports,
                              noOfReportsWithTarget: d.noOfReportsWithTarget,
                              xPosition: event.clientX,
                              yPosition: event.clientY,
                            });
                          }}
                          onMouseMove={(event) => {
                            setHoverData({
                              primaryTarget: d.primaryTargets,
                              noOfReportsTotal: d.noOfReports,
                              noOfReportsWithTarget: d.noOfReportsWithTarget,
                              xPosition: event.clientX,
                              yPosition: event.clientY,
                            });
                          }}
                          onMouseLeave={() => {
                            setHoverData(undefined);
                          }}
                          opacity={selectedTarget ? selectedTarget === d.primaryTargets ? 1 : 0.2 : 1}
                        >
                          <circle
                            cx={0}
                            cy={0}
                            r={(d.noOfReportsWithTarget / d.noOfReports) * (gridSize / 2)}
                            fill={SDG_COLOR_ARRAY[d.sdg - 1]}
                          />
                          {
                            (d.noOfReportsWithTarget / d.noOfReports) * (gridSize / 2) > 20
                              ? (
                                <text
                                  fill='#fff'
                                  textAnchor='middle'
                                  fontSize={20}
                                  dy={5}
                                >
                                  {d.primaryTargets}
                                </text>
                              ) : null
                          }
                        </g>
                      ))
                    }
                  </g>
                  {
                    InterlinkageAssociatedDataByRegion[InterlinkageAssociatedDataByRegion.findIndex((d) => d.regionOrIncomeGroup === region)].primaryTargets.map((d, i) => <g key={i} style={{ pointerEvents: selectedTarget === d.target ? 'auto' : 'none' }} opacity={selectedTarget === d.target ? 1 : 0}><AssociatedTargetsCircles totalNoOfReports={InterlinkageDataByRegion.filter((el: any) => el.regionOrIncomeGroup === region)[0].noOfReports} setAssociatedHoverData={setAssociatedHoverData} data={d} /></g>)
                  }
                </svg>
                {
                  hoverData
                    ? (
                      <Tooltip
                        data={hoverData}
                      />
                    )
                    : null
                }
                {
                  associatedHoverData
                    ? (
                      <AssociatedTargetTooltip
                        data={{ ...associatedHoverData, noOfReportsTotal: InterlinkageDataByRegion.filter((d: any) => d.regionOrIncomeGroup === region)[0].noOfReports }}
                      />
                    )
                    : null
                }
              </div>
            )
            : (
              <div style={{
                height: '200px', backgroundColor: 'var(--gray-100)', flexGrow: 1,
              }}
              >
                <div className='undp-loader' style={{ margin: 'auto' }} />
              </div>
            )
        }
      </div>
    </>
  );
};
