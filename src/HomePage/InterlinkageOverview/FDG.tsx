/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react';
import {
  forceCenter, forceManyBody, forceSimulation, forceLink, forceCollide,
} from 'd3-force';
import styled from 'styled-components';
import { FDGData } from './interlinkageDataForFDGGlobal';
import { SDG_COLOR_ARRAY } from '../../Constants';
import { FDGTooltip } from './LinkageTooltip';
import { TargetShortName } from './TargetShortName';

const VizArea = styled.div`
  width: calc(100% - 22rem);
  flex-grow: 1;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const ForceDirectedGraph = () => {
  const [nodeData, setNodeData] = useState<any>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | undefined>(undefined);
  const bubbleChartRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<any>(null);
  const width = 1400;
  const height = 600;
  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(FDGData));
    const links = dataTemp.links.map((d: any) => ({ ...d }));
    const nodes = dataTemp.nodes.map((d: any) => ({ ...d }));

    const boxForce = () => {
      for (let i = 0; i < nodes.length; i += 1) {
        const currNode: any = nodes[i];
        const radius = 50;
        currNode.x = Math.max(radius, Math.min(width - radius, currNode.x));
        currNode.y = Math.max(radius, Math.min(height - radius, currNode.y));
      }
    };
    forceSimulation(nodes)
      .alpha(1)
      .force('link', forceLink(links).id((d: any) => d.id))
      .force('collide', forceCollide().radius(50))
      .force('charge', forceManyBody())
      .force('center', forceCenter(width / 2, height / 2))
      .force('boxForce', boxForce)
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
                className='flex-div gap-07 flex-wrap'
                ref={bubbleChartRef}
              >
                <div style={{ width: '20rem', flexGrow: 1 }}>
                  <h6 className='undp-typography'>Key Primary Targets</h6>
                  <div style={{ cursor: 'pointer', backgroundColor: 'var(--gray-200)' }} className='margin-bottom-05'>
                    <div className='flex-div' style={{ justifyContent: 'space-between', padding: '1rem' }} onClick={() => { setSelectedTarget(selectedTarget === '8.5' ? undefined : '8.5'); }}>
                      <h5 className='undp-typography margin-bottom-00'>
                        Target 8.5
                      </h5>
                      <div style={{ flexShrink: 0 }}>
                        {
                          selectedTarget === '8.5' ? <img src='https://design.undp.org/icons/chevron-up.svg' alt='icon' /> : <img src='https://design.undp.org/icons/chevron-down.svg' alt='icon' />
                        }
                      </div>
                    </div>
                    {
                      selectedTarget === '8.5'
                        ? (
                          <div style={{ padding: '0 1rem 1rem' }}>
                            <span className='bold'>Decent work for all</span>
                            {' '}
                            can drive SDG progress - our reports find the most powerful policy combinations include co-investments in poverty reduction and inclusion - across political, social and economic spheres.
                          </div>
                        ) : null
                    }
                  </div>
                  <div style={{ cursor: 'pointer', backgroundColor: 'var(--gray-200)' }} className='margin-bottom-05'>
                    <div className='flex-div' style={{ justifyContent: 'space-between', padding: '1rem' }} onClick={() => { setSelectedTarget(selectedTarget === '9.1' ? undefined : '9.1'); }}>
                      <h5 className='undp-typography margin-bottom-00'>
                        Target 9.1
                      </h5>
                      <div style={{ flexShrink: 0 }}>
                        {
                          selectedTarget === '9.1' ? <img src='https://design.undp.org/icons/chevron-up.svg' alt='icon' /> : <img src='https://design.undp.org/icons/chevron-down.svg' alt='icon' />
                        }
                      </div>
                    </div>
                    {
                      selectedTarget === '9.1'
                        ? (
                          <div style={{ padding: '0 1rem 1rem' }}>
                            <span className='bold'>Resilient infrastructure and urbanization</span>
                            {' '}
                            are also identified as drivers of SDG progress, laying foundation for job creation, innovation and technological advancements, with positive multiplier noted in climate and agriculture productivity.
                          </div>
                        ) : null
                    }
                  </div>
                  <div style={{ cursor: 'pointer', backgroundColor: 'var(--gray-200)' }} className='margin-bottom-05'>
                    <div className='flex-div' style={{ justifyContent: 'space-between', padding: '1rem' }} onClick={() => { setSelectedTarget(selectedTarget === '11.1' ? undefined : '11.1'); }}>
                      <h5 className='undp-typography margin-bottom-00'>
                        Target 11.1
                      </h5>
                      <div style={{ flexShrink: 0 }}>
                        {
                          selectedTarget === '11.1' ? <img src='https://design.undp.org/icons/chevron-up.svg' alt='icon' /> : <img src='https://design.undp.org/icons/chevron-down.svg' alt='icon' />
                        }
                      </div>
                    </div>
                    {
                      selectedTarget === '11.1'
                        ? (
                          <div style={{ padding: '0 1rem 1rem' }}>
                            <span className='bold'>Sustainable Cities</span>
                            {' '}
                            provide a central pillar for well-being and active participation of all citizens, and accelerate SDG progress when combined with resilient infrastructure, strengthening of adaptive capacity to climate-related hazards, especially of the poor, improving access to free health services and clean water and sanitation.
                          </div>
                        ) : null
                    }
                  </div>
                  <div style={{ cursor: 'pointer', backgroundColor: 'var(--gray-200)' }} className='margin-bottom-05'>
                    <div className='flex-div' style={{ justifyContent: 'space-between', padding: '1rem' }} onClick={() => { setSelectedTarget(selectedTarget === '16.6' ? undefined : '16.6'); }}>
                      <h5 className='undp-typography margin-bottom-00'>
                        Target 16.6
                      </h5>
                      <div style={{ flexShrink: 0 }}>
                        {
                          selectedTarget === '16.6' ? <img src='https://design.undp.org/icons/chevron-up.svg' alt='icon' /> : <img src='https://design.undp.org/icons/chevron-down.svg' alt='icon' />
                        }
                      </div>
                    </div>
                    {
                      selectedTarget === '16.6'
                        ? (
                          <div style={{ padding: '0 1rem 1rem' }}>
                            <span className='bold'>Effective and accountable institutions</span>
                            {' '}
                            are a driver of societal well-being - and have the most SDG impact when co-invested with sustainable economic growth, poverty and inequality reductions, and expansion of health care coverage and quality education for all.
                          </div>
                        ) : null
                    }
                  </div>
                </div>
                <VizArea>
                  <div className='flex-div flex-wrap margin-bottom-05 gap-05 flex-vert-align-center'>
                    <div className='flex-div gap-03 flex-vert-align-center'>
                      <div
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          border: '1px solid var(--gray-600)',
                          backgroundColor: 'var(--gray-600)',
                          borderRadius: '1.5rem',
                          flexShrink: 0,
                        }}
                      />
                      <p className='margin-bottom-00 margin-top-00 small-font'>Primary target (most frequently mentioned globally)</p>
                    </div>
                    <div className='flex-div gap-03 flex-vert-align-center'>
                      <div
                        style={{
                          width: '1rem',
                          height: '1rem',
                          border: '1px solid var(--gray-600)',
                          backgroundColor: 'var(--white)',
                          borderRadius: '1rem',
                          flexShrink: 0,
                        }}
                      />
                      <p className='margin-bottom-00 margin-top-00 small-font'>Secondary target (most frequently raised in association with the primary targets)</p>
                    </div>
                  </div>
                  <svg width='100%' style={{ margin: 'auto' }} viewBox={`0 0 ${width} ${height}`}>
                    <rect x={0} y={0} width={width} height={height} fill='#fff' opacity={0} onClick={() => { setSelectedTarget(undefined); }} />
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
                                : selectedTarget
                                  ? d.source.id.split('_')[1] === selectedTarget
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
                          onClick={() => {
                            if (d.type === 'primary') setSelectedTarget(d.id.split('_')[1]);
                          }}
                          onMouseEnter={(event) => {
                            setHoverData({
                              ...d,
                              description: TargetShortName[TargetShortName.findIndex((el) => el.target === d.id.split('_')[1])].label,
                              xPosition: event.clientX,
                              yPosition: event.clientY,
                            });
                          }}
                          onMouseMove={(event) => {
                            setHoverData({
                              ...d,
                              description: TargetShortName[TargetShortName.findIndex((el) => el.target === d.id.split('_')[1])].label,
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
                              : selectedTarget
                                ? (FDGData.nodes[FDGData.nodes.findIndex((el) => el.id.split('_')[1] === selectedTarget)].associatedTargets.indexOf(d.id.split('_')[1]) !== -1 && FDGData.nodes[FDGData.nodes.findIndex((el) => el.id.split('_')[1] === selectedTarget)].type !== d.type) || FDGData.nodes[FDGData.nodes.findIndex((el) => el.id.split('_')[1] === selectedTarget)].id === d.id
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
                  <p className='small-font italics margin-top-08' style={{ color: 'var(--gray-500)' }}>
                    Primary targets are those identified by the machine learning algorithm as most frequently mentioned in countries&apos; policy documents, thus they constitute countries&apos; priority targets. To understand which other targets contribute to and benefit from putting the primary targets into practise, we mapped which targets were most frequently raised in association with the four (or more if tied) most prominent primary targets globally, by region and by income group. These associated targets are what we call secondary targets. Importantly, the association of targets can go both ways, meaning a country may have picked the secondary target as primary target but globally/per group, the trend is reversed.
                  </p>
                </VizArea>
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
