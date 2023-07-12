import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { Graph } from './Graph';
import { ScenarioDataType } from '../../../Types';

interface Props {
  data: ScenarioDataType[];
  stepValue: number;
  // eslint-disable-next-line no-unused-vars
  setStepValue: (_d: number) => void;
}
export const FutureGraph = (props: Props) => {
  const {
    data,
    stepValue,
    setStepValue,
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
      style={{
        padding: '2rem',
        backgroundColor: UNDPColorModule.graphBackgroundColor,
        color: 'var(--black)',
        height: 'calc(100vh - 20rem)',
      }}
      ref={graphRef}
    >
      <p
        className='undp-typography'
        style={{
          fontSize: '1rem',
          fontFamily:
            'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          textAlign: 'center',
        }}
      >
        <h1 className='undp-typography bold margin-bottom-13 margin-top-07'>{'Poverty <$1.90 per Day (No. of People)'}</h1>
      </p>
      {
        !graphWidth && !graphHeight ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph data={data} width={graphWidth} height={graphHeight} stepValue={stepValue} setStepValue={setStepValue} />
      }
    </div>
  );
};
