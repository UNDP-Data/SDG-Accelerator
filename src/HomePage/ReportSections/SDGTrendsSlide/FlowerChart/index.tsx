import { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { useInView } from 'react-intersection-observer';
import UNDPColorModule from 'undp-viz-colors';
import { Graph } from './Graph';

interface StatusByPsProps {
  onTrack: number;
  offTrack: number;
  gapsNA: number;
  pValue: string;
  totalNoOfTargets: number;
  position: number[];
  goals: string[];
}

interface Props {
  status: StatusByPsProps[];
  tag: 'onTrack' | 'offTrack' | 'gapsNA';
}
export const FlowerChart = (props: Props) => {
  const {
    status,
    tag,
  } = props;
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  useEffect(() => {
    if (graphRef.current) {
      setGraphWidth(graphRef.current.clientWidth);
      setGraphHeight(graphRef.current.clientHeight);
    }
  }, [graphRef]);

  useEffect(() => {
    if (inView) {
      select(graphRef.current)
        .style('opacity', 0)
        .transition()
        .duration(750)
        .style('opacity', 1);
    } else {
      select(graphRef.current)
        .transition()
        .duration(750)
        .style('opacity', 0);
    }
  }, [inView]);
  return (
    <div ref={ref} style={{ width: '100%', display: 'flex', alignItems: 'stretch' }}>
      <div
        style={{
          padding: '2rem',
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
        ref={graphRef}
      >
        <h5
          className='undp-typography margin-bottom-00 bold'
          style={{
            fontFamily:
          'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
            color: 'var(--white)',
            backgroundColor: tag === 'onTrack' ? 'var(--dark-green)' : tag === 'offTrack' ? 'var(--dark-red)' : 'var(--gray-700)',
            padding: 'var(--spacing-04)',
          }}
        >
          Percent of Targets
          {' '}
          {tag === 'onTrack' ? 'On Track' : tag === 'offTrack' ? 'Off Track' : 'Missing Data'}
        </h5>
        <div
          style={{
            backgroundColor: tag === 'onTrack' ? 'rgba(89, 186, 71, 0.2)' : tag === 'offTrack' ? 'rgba(209, 40, 0, 0.2)' : 'rgba(35, 46, 61,0.5)',
          }}
        >
          <div className='flex-div gap-07 flex-vert-align-center flex-wrap' style={{ padding: 'var(--spacing-05)', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.sdgColors.sdg1 }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.sdgColors.sdg1 }} />
              <p className='undp-typography margin-bottom-00 small-font bold'>People</p>
            </div>
            <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.categoricalColors.colors[1] }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.categoricalColors.colors[1] }} />
              <p className='undp-typography margin-bottom-00 small-font bold'>Planet</p>
            </div>
            <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.categoricalColors.colors[2] }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.categoricalColors.colors[2] }} />
              <p className='undp-typography margin-bottom-00 small-font bold'>Prosperity</p>
            </div>
            <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.sdgColors.sdg16 }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.sdgColors.sdg16 }} />
              <p className='undp-typography margin-bottom-00 small-font bold'>Peace</p>
            </div>
            <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.sdgColors.sdg17 }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.sdgColors.sdg17 }} />
              <p className='undp-typography margin-bottom-00 small-font bold'>Partnership</p>
            </div>
          </div>
          {
            !graphWidth || !graphHeight ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph status={status} width={graphWidth} height={graphHeight} tag={tag} />
          }
        </div>
      </div>
    </div>
  );
};
