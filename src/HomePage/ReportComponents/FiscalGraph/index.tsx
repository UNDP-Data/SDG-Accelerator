import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { Graph } from './Graph';
import FiscalData from '../../DataForReport/FiscalData.json';

interface Props {
  countryCode: string;
}
export const FiscalGraph = (props: Props) => {
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
        backgroundColor: UNDPColorModule.graphBackgroundColor,
        color: 'var(--black)',
        minHeight: '10px',
        minWidth: '17.5rem',
      }}
      ref={graphRef}
    >
      {
        !graphWidth ? <div className='undp-loader' style={{ margin: 'auto' }} /> : <Graph countryCode={countryCode} width={graphWidth} />
      }

      {FiscalData[FiscalData.findIndex((d) => d.iso === countryCode)][
        'notes/sources'
      ]
        .split('Sources: ')[0]
        .replace('Notes: ', '').length === 0 ? null : (
          <div
            className='margin-top-05 small-font'
            style={{
              color: 'var(--gray-600)',
              fontFamily:
                      'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
            }}
          >
            <span className='bold'>Notes: </span>
            {FiscalData[
              FiscalData.findIndex((d) => d.iso === countryCode)
            ]['notes/sources']
              .split('Sources: ')[0]
              .replace('Notes: ', '')}
          </div>
        )}
      {FiscalData[FiscalData.findIndex((d) => d.iso === countryCode)][
        'notes/sources'
      ].split('Sources: ')[1].length === 0 ? null : (
        <div
          className='margin-top-03 small-font'
          style={{
            color: 'var(--gray-600)',
            fontFamily:
                      'ProximaNova, proxima-nova, Helvetica Neue, sans-serif',
          }}
        >
          <span className='bold'>Sources: </span>
          {
                    FiscalData[
                      FiscalData.findIndex((d) => d.iso === countryCode)
                    ]['notes/sources'].split('Sources: ')[1]
                  }
        </div>
        )}
    </div>
  );
};
