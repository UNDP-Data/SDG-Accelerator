import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { Graph } from './Graph';

interface Props {
  countryCode: string;
}
export const PlanetGraph = (props: Props) => {
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
      style={{
        padding: '2rem',
        backgroundColor: UNDPColorModule.graphBackgroundColor,
        width: 'calc(50% - 4.5rem)',
        color: 'var(--black)',
        minHeight: '10px',
        minWidth: '17.5rem',
        flexGrow: 1,
      }}
      ref={graphRef}
    >
      <h5
        className='undp-typography'
        style={{
          width: '100%',
          textAlign: 'center',
          color: 'var(--blue-600)',
          fontFamily:
          'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        Planet
      </h5>
      <p
        className='undp-typography'
        style={{
          fontSize: '1rem',
          fontFamily:
          'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
        }}
      >
        <span className='bold'>Carbon Intensity</span>
        : CO2 emissions
        intensity of GDP (tCO2 per PPP $1,000)
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
        Source: Projections based on GDP data from the IMF WEO Database
        (April 2023), and on CO2 emissions from the Global Carbon Budget
        2022 and EDGAR (JRC and IEA).
      </div>
    </div>
  );
};
