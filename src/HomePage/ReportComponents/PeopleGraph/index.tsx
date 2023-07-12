import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { select } from 'd3-selection';
import { useInView } from 'react-intersection-observer';
import { Graph } from './Graph';

interface Props {
  countryCode: string;
}
export const PeopleGraph = (props: Props) => {
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
          People
        </h5>
        <p
          className='undp-typography'
          style={{
            fontSize: '1rem',
            fontFamily:
              'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          }}
        >
          <span className='bold'>Poverty</span>
          : Percentage of the population under each threshold (PPP$ a day)
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
          Source: Projections based on binned distributions ($0.10-bins,
          2017 PPP) reconstructed from the World Bank&apos;s Poverty and
          Inequality Platform through the pip: Stata Module.
        </div>
      </div>
    </div>
  );
};
