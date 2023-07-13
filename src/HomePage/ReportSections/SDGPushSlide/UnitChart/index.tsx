import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { format } from 'd3-format';
import UNDPColorModule from 'undp-viz-colors';
import { Graph } from './Graph';

interface Props {
  withSDGPush: number;
  withoutSDGPush: number;
  scale: number;
}
export const UnitChart = (props: Props) => {
  const {
    withSDGPush,
    withoutSDGPush,
    scale,
  } = props;
  const [count, setCount] = useState(0);

  const graphRef = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.4,
  });
  useEffect(() => {
    if (graphRef.current) {
      setGraphWidth(graphRef.current.clientWidth);
      setGraphHeight(graphRef.current.clientHeight);
    }
  }, [graphRef]);

  useEffect(() => {
    setCount(0);
    const timer = setInterval(() => {
      if (count < withoutSDGPush - withSDGPush) { setCount((prevCount) => prevCount + scale / 10); }
    }, 30);
    if (!inView) {
      clearInterval(timer);
    }
    // Clean up the timer when the component is unmounted or the count reaches 0
    return () => clearInterval(timer);
  }, [inView]);
  return (
    <div ref={ref} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div>
        With the SDG Push,
        {' '}
        <span className='countDownValue bold' style={{ color: UNDPColorModule.categoricalColors.colors[2], fontSize: '1.5rem' }}>{format(',')(Math.min(count, withoutSDGPush - withSDGPush)).replaceAll(',', ' ')}</span>
        {' '}
        fewer people in will be
        <br />
        living in poverty by 2030
      </div>
      <div
        style={{
          width: '100%',
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
        {
          !graphWidth || !graphHeight ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph withoutSDGPush={withoutSDGPush} withSDGPush={withSDGPush} inView={inView} scale={scale} />
        }
      </div>
    </div>
  );
};
