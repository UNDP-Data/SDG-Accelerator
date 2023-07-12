import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { select } from 'd3-selection';
import { useInView } from 'react-intersection-observer';
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
        width: 'calc(50% - 1rem)',
        display: 'flex',
        alignItems: 'stretch',
        marginTop: '2rem',
      }}
    >
      <div
        style={{
          padding: '2rem',
          backgroundColor: UNDPColorModule.graphBackgroundColor,
          width: 'calc(100% - 4rem)',
          color: 'var(--black)',
          height: '30rem',
          minWidth: '17.5rem',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
        !graphWidth || !graphHeight ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph countryCode={countryCode} width={graphWidth} height={graphHeight} />
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
    </div>
  );
};
