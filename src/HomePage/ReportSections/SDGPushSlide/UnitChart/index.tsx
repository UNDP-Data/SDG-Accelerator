import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
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
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.9,
  });
  useEffect(() => {
    if (graphRef.current) {
      setGraphWidth(graphRef.current.clientWidth);
      setGraphHeight(graphRef.current.clientHeight);
    }
  }, [graphRef]);
  return (
    <div ref={ref} style={{ width: '100%', display: 'flex', alignItems: 'stretch' }}>
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
