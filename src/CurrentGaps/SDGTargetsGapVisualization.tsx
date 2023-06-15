import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FIVE_P } from '../Constants';
import { getSDGIconSVG } from '../utils/getSDGIcon';
import { TargetStatusType } from '../Types';
import { describeArc } from '../utils/getArc';

interface Props {
  targetStatuses: TargetStatusType[];
  // eslint-disable-next-line no-unused-vars
  setRef?: (_d: HTMLDivElement) => void
}

interface SDGHoveredProps {
  title: string;
  percent: number;
  value: number;
  xPosition: number;
  yPosition: number;
  color: string;
  totalValue: number;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 1000;
  font-size: 0.875rem;
  background-color: var(--gray-100);
  word-wrap: break-word;
  top: ${(props) => props.y - 5}px;
  left: ${(props) => props.x}px;
  transform: translate(-50%, -100%);
  padding: 0.5rem;
`;

export const SDGTargetsGapVisualization = (props: Props) => {
  const { targetStatuses, setRef } = props;
  const trendRef = useRef<HTMLDivElement>(null);
  const [hoveredSDG, setHoveredSDG] = useState<null | SDGHoveredProps>(null);
  const radiusScale = 1.25;
  const statusByPs = FIVE_P.map((p) => {
    const onTrack = targetStatuses.filter((d) => d.status === 'On Track' && p.goals.indexOf(d.goal) !== -1).length;
    const identifiedGap = targetStatuses.filter((d) => d.status === 'Identified Gap' && p.goals.indexOf(d.goal) !== -1).length;
    const forReview = targetStatuses.filter((d) => d.status === 'For Review' && p.goals.indexOf(d.goal) !== -1).length;
    const notOnTrack = identifiedGap + forReview;
    return ({
      ...p,
      onTrack,
      identifiedGap,
      forReview,
      gapsNA: p.totalNoOfTargets - (onTrack + identifiedGap + forReview),
      notOnTrack,
    });
  });
  useEffect(() => {
    if (trendRef.current && setRef) {
      setRef(trendRef.current);
    }
  }, [trendRef]);
  const iconSize = 24;
  return (
    <div style={{ width: 'calc(50% - 0.5rem', minWidth: '37.5rem' }}>
      <div
        style={{ backgroundColor: 'var(--white)', padding: '1rem' }}
      >
        <div ref={trendRef}>
          <svg width='100%' viewBox='0 0 595 450'>
            <g transform='translate(0, -160)'>
              {
              statusByPs.map((d, i) => (
                <g key={i} transform={`translate(${d.position[0]},${d.position[1]})`}>
                  {
                    i < 3
                      ? (
                        <g transform='translate(0, -30)'>
                          <text
                            x={0 - d.totalNoOfTargets * radiusScale - 15}
                            y={0}
                            dy={10}
                            dx={0}
                            style={{
                              fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif', fill: 'var(--gray-700)', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.875rem',
                            }}
                            textAnchor='end'
                          >
                            {d.pValue}
                          </text>
                          {d.goals.map((g, indx) => (
                            <g
                              key={indx}
                              transform={`translate(${0 - (d.totalNoOfTargets * radiusScale) - 15 - iconSize - (((indx) % 3) * iconSize)},${15 + Math.floor(indx / 3) * iconSize})`}
                            >
                              {getSDGIconSVG(`SDG ${g}`, iconSize, true)}
                            </g>
                          ))}
                        </g>
                      ) : (
                        <g>
                          <text
                            y={15}
                            x={0 + d.totalNoOfTargets * radiusScale + 15}
                            dy={-25}
                            style={{
                              fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif', fill: 'var(--gray-700)', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.875rem',
                            }}
                            textAnchor='start'
                          >
                            {d.pValue}
                          </text>
                          {d.goals.map((g, indx) => (
                            <g
                              key={indx}
                              transform={`translate(${d.totalNoOfTargets * radiusScale + 15},-5)`}
                            >
                              {getSDGIconSVG(`SDG ${g}`, iconSize, true)}
                            </g>
                          ))}
                        </g>
                      )
                  }
                  <circle
                    r={d.totalNoOfTargets * radiusScale}
                    cx={0}
                    cy={0}
                    style={{ fillOpacity: 0, stroke: 'var(--gray-400)', strokeWidth: d.totalNoOfTargets > 25 ? 18 : 14 }}
                  />
                  <path
                    d={describeArc(0, 0, d.totalNoOfTargets * radiusScale, 0, (d.onTrack * 360) / d.totalNoOfTargets)}
                    style={{ fillOpacity: 0, stroke: 'var(--dark-green)', strokeWidth: d.totalNoOfTargets > 25 ? 18 : 14 }}
                    onMouseEnter={(event) => {
                      setHoveredSDG({
                        title: 'On Track',
                        value: d.onTrack,
                        percent: d.onTrack / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--dark-green)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseMove={(event) => {
                      setHoveredSDG({
                        title: 'On Track',
                        value: d.onTrack,
                        percent: d.onTrack / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--dark-green)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseLeave={() => { setHoveredSDG(null); }}
                  />
                  <path
                    d={describeArc(0, 0, d.totalNoOfTargets * radiusScale, (d.onTrack * 360) / d.totalNoOfTargets, ((d.onTrack + d.forReview) * 360) / d.totalNoOfTargets)}
                    style={{ fillOpacity: 0, stroke: 'var(--dark-yellow)', strokeWidth: d.totalNoOfTargets > 25 ? 18 : 14 }}
                    onMouseEnter={(event) => {
                      setHoveredSDG({
                        title: 'For Review',
                        value: d.forReview,
                        percent: d.forReview / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--dark-yellow)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseMove={(event) => {
                      setHoveredSDG({
                        title: 'For Review',
                        value: d.forReview,
                        percent: d.forReview / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--dark-yellow)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseLeave={() => { setHoveredSDG(null); }}
                  />
                  <path
                    d={describeArc(0, 0, d.totalNoOfTargets * radiusScale, ((d.onTrack + d.forReview) * 360) / d.totalNoOfTargets, ((d.onTrack + d.forReview + d.identifiedGap) * 360) / d.totalNoOfTargets)}
                    style={{ fillOpacity: 0, stroke: 'var(--dark-red)', strokeWidth: d.totalNoOfTargets > 25 ? 18 : 14 }}
                    onMouseEnter={(event) => {
                      setHoveredSDG({
                        title: 'Identified Gaps',
                        value: d.identifiedGap,
                        percent: d.identifiedGap / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--dark-red)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseMove={(event) => {
                      setHoveredSDG({
                        title: 'Identified Gaps',
                        value: d.identifiedGap,
                        percent: d.identifiedGap / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--dark-red)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseLeave={() => { setHoveredSDG(null); }}
                  />
                  <path
                    d={describeArc(0, 0, d.totalNoOfTargets * radiusScale, ((d.onTrack + d.forReview + d.identifiedGap) * 360) / d.totalNoOfTargets, 360)}
                    style={{ fillOpacity: 0, stroke: 'var(--gray-400)', strokeWidth: d.totalNoOfTargets > 25 ? 18 : 14 }}
                    onMouseEnter={(event) => {
                      setHoveredSDG({
                        title: 'Gaps NA',
                        value: d.gapsNA,
                        percent: d.gapsNA / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--gray-700)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseMove={(event) => {
                      setHoveredSDG({
                        title: 'Gaps NA',
                        value: d.gapsNA,
                        percent: d.gapsNA / d.totalNoOfTargets,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                        color: 'var(--gray-700)',
                        totalValue: d.totalNoOfTargets,
                      });
                    }}
                    onMouseLeave={() => { setHoveredSDG(null); }}
                  />
                </g>
              ))
            }
            </g>
          </svg>

          <div className='flex-div flex-wrap gap-07 margin-top-07' style={{ justifyContent: 'center', padding: '0' }}>
            <div className='flex-div flex-vert-align-center gap-03' style={{ width: '97px' }}>
              <div style={{
                width: '0.875rem', height: '0.875rem', backgroundColor: 'var(--dark-green)', borderRadius: '1rem',
              }}
              />
              <p
                className='margin-bottom-00 margin-top-00'
                style={{
                  fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', flexGrow: 1,
                }}
              >
                On Track
              </p>
            </div>
            <div className='flex-div flex-vert-align-center gap-03' style={{ width: '113px' }}>
              <div style={{
                width: '0.875rem', height: '0.875rem', backgroundColor: 'var(--dark-yellow)', borderRadius: '1rem',
              }}
              />
              <p
                className='margin-bottom-00 margin-top-00'
                style={{
                  fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', flexGrow: 1,
                }}
              >
                For Review
              </p>
            </div>
            <div className='flex-div flex-vert-align-center gap-03' style={{ width: '103px' }}>
              <div style={{
                width: '0.875rem', height: '0.875rem', backgroundColor: 'var(--dark-red)', borderRadius: '1rem',
              }}
              />
              <p
                className='margin-bottom-00 margin-top-00'
                style={{
                  fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', flexGrow: 1,
                }}
              >
                Off Track
              </p>
            </div>
            <div className='flex-div flex-vert-align-center gap-03' style={{ width: '105px' }}>
              <div style={{
                width: '0.875rem', height: '0.875rem', backgroundColor: 'var(--gray-400)', borderRadius: '1rem',
              }}
              />
              <p
                className='margin-bottom-00 margin-top-00'
                style={{
                  fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', flexGrow: 1,
                }}
              >
                Trends NA
              </p>
            </div>
          </div>
        </div>
      </div>
      {
        hoveredSDG ? (
          <TooltipEl x={hoveredSDG.xPosition} y={hoveredSDG.yPosition}>
            <h6 className='undp-typography margin-bottom-02' style={{ color: hoveredSDG.color }}>
              {hoveredSDG.title}
            </h6>
            <p className='undp-typography margin-bottom-00 bold' style={{ fontSize: '1rem', color: hoveredSDG.color }}>
              {hoveredSDG.value}
              {' '}
              out of
              {' '}
              {hoveredSDG.totalValue}
              {' '}
              targets
              <br />
              (
              {(hoveredSDG.percent * 100).toFixed(1)}
              %)
            </p>
          </TooltipEl>
        ) : null
      }
    </div>
  );
};
