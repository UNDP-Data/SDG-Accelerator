import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { SummaryReportDataType } from '../../../Types';
import { InterlinkageGraph } from './InterlinkageGraph';
import 'reactflow/dist/style.css';

interface Props {
  reportData: SummaryReportDataType;
}

const SectionEl = styled.div`
  background-color: var(--gray-300);
  border-top: 1px solid var(--gray-600);
  display: flex;
  width: calc(100vw - 1rem);
  text-align: center;
  padding: 4rem 0;
  position: sticky;
  top: 115px;
  width: calc(100vw - 1rem);
`;

const P = styled.p`
  color: var(--white);
  background-color: var(--blue-700);
  padding: var(--spacing-03) var(--spacing-05) !important;
  margin-bottom: 0 !important;
  width: max-content;
`;

export const InterlinkagesSlide = (props: Props) => {
  const {
    reportData,
  } = props;

  return (
    <div className='flex-div' style={{ height: 'calc(100vh - 131px)' }}>
      <SectionEl>
        <div
          style={{
            position: 'sticky',
            display: 'flex',
            gap: 'var(--spacing-05)',
            flexGrow: 1,
            maxWidth: '100rem',
            margin: 'auto',
          }}
        >
          <div style={{ padding: 'var(--spacing-07)' }}>
            <h4
              className='undp-typography bold'
              style={{
                color: 'var(--white)',
                backgroundColor: 'var(--blue-700)',
                width: 'max-content',
                padding: 'var(--spacing-02) var(--spacing-05)',
                marginBottom: 0,
              }}
            >
              Getting over the finish line
            </h4>
            <h4
              className='undp-typography bold'
              style={{
                color: 'var(--white)',
                backgroundColor: 'var(--blue-700)',
                width: 'max-content',
                padding: 'var(--spacing-02) var(--spacing-05)',
                marginBottom: 0,
              }}
            >
              needs targeted investment...
            </h4>
            <P
              className='undp-typography'
            >
              Investing in these SDGs has the most potential
            </P>
            <P
              className='undp-typography'
            >
              to accelerate development.
            </P>
            {
              reportData.interlinkages.source.label.split('\n').map((d, i) => (
                <P
                  className={`undp-typography ${i === 0 ? 'margin-top-05 ' : ''}padding-top-07 bold`}
                  style={{
                    opacity: 1,
                    backgroundColor: (UNDPColorModule.sdgColors as any)[`sdg${reportData.interlinkages.source.sdg}`],
                    color: reportData.interlinkages.source.sdg === 7 ? 'var(--gray-700)' : 'var(--white)',
                  }}
                  key={i}
                >
                  {d}
                </P>
              ))
            }
            {
              reportData.interlinkages.label.split('\n').map((d, i) => (
                <P
                  className='undp-typography'
                  style={{
                    opacity: 1,
                    backgroundColor: (UNDPColorModule.sdgColors as any)[`sdg${reportData.interlinkages.source.sdg}`],
                    color: reportData.interlinkages.source.sdg === 7 ? 'var(--gray-700)' : 'var(--white)',
                  }}
                  key={i}
                >
                  {d}
                </P>
              ))
            }
          </div>
          <div style={{
            flexShrink: 1,
            flexGrow: 1,
            height: 'calc(100vh - 115px)',
            textAlign: 'left',
            pointerEvents: 'none',
          }}
          >
            <InterlinkageGraph
              reportData={reportData}
            />
          </div>
        </div>
      </SectionEl>
    </div>
  );
};
