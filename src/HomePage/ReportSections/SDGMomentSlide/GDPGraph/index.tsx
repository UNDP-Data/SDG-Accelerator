import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import GDP2023 from '../../../DataForReport/GDP-2023.json';

interface Props {
  countryCode: string;
  countryFullName: string;
}
export const GDPGraph = (props: Props) => {
  const {
    countryCode,
    countryFullName,
  } = props;
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
    <div
      className='margin-bottom-05'
      style={{
        padding: '1rem 1rem 0 1rem',
        color: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <div className='flex-div flex-wrap gap-05' style={{ color: 'var(--black)' }}>
        <h4 className='bold margin-top-00 margin-bottom-00' style={{ color: 'var(--blue-700)' }}>
          {countryFullName}
          {' '}
          GDP Projection
        </h4>
      </div>
      <div
        ref={graphRef}
        style={{ flexGrow: 1 }}
      >
        {
          !graphWidth && !graphHeight
            ? <div className='undp-loader' style={{ margin: 'auto', marginBottom: 'var(--spacing-05)' }} />
            : (
              <Graph
                countryCode={countryCode}
                width={graphWidth}
                height={400}
                GDP2023={GDP2023}
              />
            )
        }
      </div>
    </div>
  );
};
