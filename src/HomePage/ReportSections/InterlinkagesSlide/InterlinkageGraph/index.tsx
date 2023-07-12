import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { SummaryReportDataType } from '../../../../Types';

interface Props {
  reportData: SummaryReportDataType;
}
export const InterlinkageGraph = (props: Props) => {
  const {
    reportData,
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
    <div style={{ width: '100%', display: 'flex', alignItems: 'stretch' }}>
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 22.5rem)',
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
          !graphWidth || !graphHeight ? <div className='undp-loader' style={{ margin: 'auto' }} />
            : (
              <Graph
                reportData={reportData}
                graphHeight={graphHeight}
                graphWidth={graphWidth}
              />
            )
        }
      </div>
    </div>
  );
};
