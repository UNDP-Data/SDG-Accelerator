import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';

export const FivePChart = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);
  useEffect(() => {
    if (graphRef.current) {
      setGraphWidth(graphRef.current.clientWidth);
      setGraphHeight(graphRef.current.clientHeight);
    }
  }, [graphRef]);

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'stretch' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '22.5rem',
        height: 'calc(100vh - 7.1875rem - 9rem)',
      }}
      >
        <h5
          className='undp-typography margin-bottom-00 bold'
          style={{
            fontFamily: 'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
            color: 'var(--white)',
            backgroundColor: 'var(--blue-400)',
            padding: 'var(--spacing-07)',
          }}
        >
          The SDG targets are organized according to the 5 P&apos;s of sustainable development
        </h5>
        <div
          style={{
            backgroundColor: 'var(--white)',
            flexGrow: 1,
          }}
          ref={graphRef}
        >
          {
            !graphWidth || !graphHeight ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph width={graphWidth} height={graphHeight} />
          }
        </div>
      </div>
    </div>
  );
};
