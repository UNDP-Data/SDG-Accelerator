import { useEffect, useRef, useState } from 'react';
import {
  forceCenter,
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import { selectAll } from 'd3-selection';
import sortBy from 'lodash.sortby';
import { Modal } from 'antd';
import { SDG_COLOR_ARRAY } from '../../../Constants';
import { getSDGIconSVG } from '../../../utils/getSDGIcon';

interface Props {
  data: any;
  inView: boolean;
}

export const NationalPrioritiesBubbleChart = (props: Props) => {
  const {
    data,
    inView,
  } = props;
  const [nodeData, setNodeData] = useState<any>(null);
  const bubbleChartRef = useRef<HTMLDivElement>(null);
  const [selectedSDG, setSelectedSDG] = useState<any>(null);
  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(data)).filter((d: any) => d.importance !== 0);
    forceSimulation(dataTemp)
      .force('charge', forceManyBody().strength(2.25))
      .force('center', forceCenter())
      .force('x', forceX().strength(1).x((d: any) => (d.sdg * 15)))
      .force('y', forceY().strength(1).y(0))
      .force('collision', forceCollide().radius((d: any) => (d.importance * 50) + 4))
      .tick(10000)
      .on('end', () => { setNodeData(dataTemp); });
  }, [data]);
  useEffect(() => {
    if (inView) {
      sortBy(nodeData, 'importance').reverse().forEach((d, i) => {
        selectAll(`.sdg_${d.sdg}`)
          .transition()
          .delay(i * 100)
          .duration(50)
          .attr('r', d.importance * 50);
      });
      selectAll('.sdgIcons')
        .transition()
        .duration(0)
        .delay(17 * 100)
        .attr('opacity', 1);
    } else {
      selectAll('.sdgIcons')
        .transition()
        .duration(100)
        .attr('opacity', 0);
      selectAll('.sdgCircles')
        .transition()
        .duration(100)
        .attr('r', 0);
    }
  }, [nodeData, inView]);
  return (
    <>
      <div
        style={{
          padding: '0 2rem',
          width: 'calc(100% - 4rem)',
          height: 'calc(100vh - 17.5rem)',
          color: 'var(--black)',
          minHeight: '10px',
          minWidth: '17.5rem',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {
          nodeData
            ? (
              <>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                  ref={bubbleChartRef}
                >
                  <svg width='100%' height='calc(100vh - 295px)' style={{ margin: 'auto' }} viewBox='0 0 450 250'>
                    <g transform='translate(225,125)'>
                      {
                        nodeData.map((d: any, i: number) => (
                          <g
                            key={i}
                            transform={`translate(${d.x},${d.y})`}
                            onClick={() => { setSelectedSDG(d); }}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            <circle
                              className={`sdg_${d.sdg} sdgCircles`}
                              cx={0}
                              cy={0}
                              r={0}
                              fill={SDG_COLOR_ARRAY[d.sdg - 1]}
                            />
                            {
                              d.importance * 50 < 10 ? null
                                : (
                                  <g className={`sdgIcon_${d.sdg} sdgIcons`} opacity={0} transform={`translate(${0 - d.importance * 35},${0 - d.importance * 35})`}>
                                    {getSDGIconSVG(`SDG ${d.sdg}`, d.importance * 70)}
                                  </g>
                                )
                            }
                          </g>
                        ))
                      }
                    </g>
                  </svg>
                </div>
              </>
            )
            : (
              <div style={{
                width: 'calc(75% - 1rem)', height: '400px', backgroundColor: 'var(--gray-100)', paddingTop: '80px', flexGrow: 1,
              }}
              >
                <div className='undp-loader' style={{ margin: 'auto' }} />
              </div>
            )
        }
      </div>
      <Modal
        className='undp-modal'
        onCancel={() => { setSelectedSDG(null); }}
        onOk={() => { setSelectedSDG(null); }}
        title={selectedSDG ? `Most common words/phrases for SDG ${selectedSDG.sdg}` : ''}
        open={selectedSDG !== null}
      >
        <div className='flex-div flex-wrap margin-top-09' style={{ width: '0.75vw', minWidth: '40rem', maxWidth: '60rem' }}>
          {
            selectedSDG?.features.length > 0
              ? selectedSDG?.features.map((d: any, i: number) => <div key={i} className='undp-chip'>{d}</div>)
              : 'No words/phrases available'
          }
        </div>
      </Modal>
    </>
  );
};
