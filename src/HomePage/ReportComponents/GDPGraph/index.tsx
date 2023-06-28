import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { Graph } from './Graph';

interface Props {
  countryCode: string;
}
export const GDPGraph = (props: Props) => {
  const {
    countryCode,
  } = props;
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  useEffect(() => {
    if (graphRef.current) {
      setGraphWidth(graphRef.current.clientWidth);
    }
  }, [graphRef]);
  return (
    <div
      className='margin-bottom-05'
      style={{
        padding: '2rem',
        backgroundColor: UNDPColorModule.graphBackgroundColor,
        color: 'var(--black)',
        minHeight: '10px',
      }}
      ref={graphRef}
    >
      <p
        className='undp-typography'
        style={{
          fontSize: '1rem',
          fontFamily:
            'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
        }}
      >
        <span className='bold'>Growth Pathways</span>
      </p>
      {
        !graphWidth ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph countryCode={countryCode} width={graphWidth} />
      }
      <div
        className='margin-top-05 small-font'
        style={{
          color: 'var(--gray-600)',
          fontFamily:
            'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
        }}
      >
        Source: IMF World Economic Outlook (WEO) (April 2023 and October
        2019).
      </div>
    </div>
  );
};
