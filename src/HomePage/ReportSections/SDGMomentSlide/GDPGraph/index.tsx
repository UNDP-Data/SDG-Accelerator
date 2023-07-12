import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import GDP2023 from '../../../Data/GDP-2023.json';

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
        padding: '1rem',
        color: 'var(--black)',
        maxHeight: 'calc(100vh - 20rem)',
        minHeight: '40rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div className='flex-div flex-wrap gap-05' style={{ color: 'var(--black)' }}>
        <div className='flex-div gap-03 flex-vert-align-center bold small-font' style={{ color: 'var(--blue-700)' }}>
          <div style={{
            width: '0.825rem',
            height: '0.825rem',
            backgroundColor: 'var(--blue-700)',
          }}
          />
          {countryFullName}
          {' '}
          GDP Projection
        </div>
        <div className='flex-div gap-03 flex-vert-align-center bold small-font' style={{ color: 'var(--gray-600)' }}>
          <div style={{
            width: '0.825rem',
            height: '0.825rem',
            backgroundColor: 'var(--gray-600)',
          }}
          />
          World GDP Projection
        </div>
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
                height={graphHeight - 10}
                GDP2023={GDP2023}
              />
            )
        }
      </div>
    </div>
  );
};
