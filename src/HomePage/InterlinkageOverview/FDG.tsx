import { useEffect, useRef, useState } from 'react';
import {
  forceCenter, forceManyBody, forceSimulation, forceLink, forceCollide,
} from 'd3-force';
import { FDGData } from './interlinkageDataForFDGGlobal';
import { SDG_COLOR_ARRAY } from '../../Constants';
import { FDGTooltip } from './LinkageTooltip';

export const ForceDirectedGraph = () => {
  const [nodeData, setNodeData] = useState<any>(null);
  const bubbleChartRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<any>(null);
  const width = 1400;
  const height = 600;
  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(FDGData));
    const links = dataTemp.links.map((d: any) => ({ ...d }));
    const nodes = dataTemp.nodes.map((d: any) => ({ ...d }));

    forceSimulation(nodes)
      .alpha(1)
      .force('link', forceLink(links).id((d: any) => d.id))
      .force('collide', forceCollide().radius(50))
      .force('charge', forceManyBody())
      .force('center', forceCenter(width / 2, height / 2))
      .on('end', () => {
        setNodeData({
          nodes,
          links,
        });
      });
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
                <svg width='100%' height='calc(100vh - 100px)' style={{ margin: 'auto' }} viewBox={`0 0 ${width} ${height}`}>

                  {
                    nodeData.links.map((d: any, i: any) => (
                      <g
                        key={i}
                      >
                        <line
                          x1={d.source.x}
                          x2={d.target.x}
                          y1={d.source.y}
                          y2={d.target.y}
                          stroke='#CCC'
                          strokeWidth={Math.sqrt(d.value * 1.5)}
                          opacity={
                            hoverData
                              ? hoverData.type === 'primary'
                                ? d.source.id === hoverData.id
                                  ? 1
                                  : 0.1
                                : d.target.id === hoverData.id
                                  ? 1
                                  : 0.1
                              : 1
                          }
                        />
                      </g>
                    ))
                  }
                  {
                      nodeData.nodes.map((d: any, i: any) => (
                        <g
                          transform={`translate(${d.x}, ${d.y})`}
                          key={i}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(event) => {
                            setHoverData({
                              ...d,
                              xPosition: event.clientX,
                              yPosition: event.clientY,
                            });
                          }}
                          onMouseLeave={() => { setHoverData(null); }}
                          opacity={
                            hoverData
                              ? (hoverData.associatedTargets.indexOf(d.id.split('_')[1]) !== -1 && hoverData.type !== d.type) || hoverData.id === d.id
                                ? 1
                                : 0.1
                              : 1
                          }
                        >
                          <circle
                            cx={0}
                            cy={0}
                            opacity={1}
                            r={d.type === 'primary' ? 40 : 20}
                            style={{ fill: d.type === 'primary' ? SDG_COLOR_ARRAY[d.sdg - 1] : 'var(--white)', strokeWidth: 2, stroke: SDG_COLOR_ARRAY[d.sdg - 1] }}
                          />
                          <text
                            x={0}
                            y={0}
                            fontSize={16}
                            fill={d.type !== 'primary' ? SDG_COLOR_ARRAY[d.sdg - 1] : '#fff'}
                            textAnchor='middle'
                            dy={4}
                          >
                            {d.id.split('_')[1]}
                          </text>
                        </g>
                      ))
                    }
                </svg>
              </div>
            )
            : (
              <div style={{
                height: '200px', backgroundColor: 'var(--white)', flexGrow: 1,
              }}
              >
                <div className='undp-loader' style={{ margin: 'auto' }} />
              </div>
            )
        }
      </div>
      {
        hoverData
          ? (
            <FDGTooltip
              data={hoverData}
            />
          )
          : null
      }
    </>
  );
};
