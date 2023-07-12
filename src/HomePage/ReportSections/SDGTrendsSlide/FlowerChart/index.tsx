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
    <div
      ref={ref}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        height: 'calc(100vh - 16.1875rem)',
      }}
    >
      <div
        style={{
          color: 'var(--black)',
          minHeight: '10px',
          minWidth: '17.5rem',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <h5
          className='undp-typography margin-bottom-00 bold'
          style={{
            fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
            color: 'var(--white)',
            backgroundColor: tag === 'onTrack' ? 'var(--dark-green)' : tag === 'offTrack' ? 'var(--dark-red)' : 'var(--gray-700)',
            padding: 'var(--spacing-04)',
          }}
        >
          Percent of Targets
          {' '}
          {tag === 'onTrack' ? 'On Track' : tag === 'offTrack' ? 'Off Track' : 'Missing Data'}
        </h5>
        <div className='flex-div gap-07 flex-vert-align-center flex-wrap' style={{ padding: 'var(--spacing-05)', justifyContent: 'center', backgroundColor: 'var(--white)' }}>
          <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.sdgColors.sdg1 }}>
            <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.sdgColors.sdg1 }} />
            <p className='undp-typography margin-bottom-00 bold'>People</p>
          </div>
          <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.categoricalColors.colors[1] }}>
            <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.categoricalColors.colors[1] }} />
            <p className='undp-typography margin-bottom-00 bold'>Planet</p>
          </div>
          <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.categoricalColors.colors[2] }}>
            <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.categoricalColors.colors[2] }} />
            <p className='undp-typography margin-bottom-00 bold'>Prosperity</p>
          </div>
          <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.sdgColors.sdg16 }}>
            <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.sdgColors.sdg16 }} />
            <p className='undp-typography margin-bottom-00 bold'>Peace</p>
          </div>
          <div className='flex-div gap-02 flex-vert-align-center' style={{ color: UNDPColorModule.sdgColors.sdg17 }}>
            <div style={{ width: '1rem', height: '1rem', backgroundColor: UNDPColorModule.sdgColors.sdg17 }} />
            <p className='undp-typography margin-bottom-00 bold'>Partnership</p>
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'var(--white)',
            flexGrow: 1,
          }}
          ref={graphRef}
        >
          {
            !graphWidth || !graphHeight ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph status={status} width={graphWidth} height={graphHeight} tag={tag} />
          }
        </div>
      </div>
    </div>
  );
};
