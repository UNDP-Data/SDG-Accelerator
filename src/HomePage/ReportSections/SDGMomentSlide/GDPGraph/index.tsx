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
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: 'var(--black)',
        height: 'calc(100vh - 20rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div className='flex-div flex-wrap gap-07' style={{ justifyContent: 'center', color: 'var(--white)' }}>
        <div className='flex-div gap-03 flex-vert-align-center'>
          <div style={{
            width: '1rem',
            height: '1rem',
            backgroundColor: 'var(--blue-300)',
          }}
          />
          {countryFullName}
          {' '}
          GDP Projection
        </div>
        <div className='flex-div gap-03 flex-vert-align-center'>
          <div style={{
            width: '1rem',
            height: '1rem',
            backgroundColor: 'var(--gray-400)',
          }}
          />
          World GDP Projection
        </div>
      </div>
      <div
        style={{ flexGrow: 1 }}
        ref={graphRef}
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
      <div
        className='small-font'
        style={{
          color: 'var(--white)',
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
