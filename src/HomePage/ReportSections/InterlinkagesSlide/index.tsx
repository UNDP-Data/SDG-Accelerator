import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { SummaryReportDataType } from '../../../Types';
import 'reactflow/dist/style.css';

import IMAGES from '../../../img/images';
import { InterlinkageGraph } from './InterlinkageGraph';

interface Props {
  reportData: SummaryReportDataType;
}

interface BgInterface {
  bgImage: string;
}

const SectionEl = styled.div<BgInterface>`
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${(props) => props.bgImage}) no-repeat center;
  background-size: cover;
  background-attachment: fixed;
  min-height: calc(100vh - 7.1875rem);
  display: flex;
  padding-top: 7.1875rem;
  width: calc(100vw - 1rem);
`;

const P = styled.p`
  color: var(--white);
  background-color: var(--gray-700);
  padding: var(--spacing-03) var(--spacing-05) !important;
  margin-bottom: 0 !important;
  width: max-content;
`;

export const InterlinkagesSlide = (props: Props) => {
  const {
    reportData,
  } = props;

  return (
    <div className='flex-div'>
      <SectionEl
        bgImage={IMAGES.CurrencyBG}
        style={{
          textAlign: 'center',
          padding: '4rem 0',
          position: 'sticky',
          top: '115px',
          width: 'calc(100vw - 1rem)',
          height: 'calc(100vh - 200px)',
        }}
      >
        <div
          style={{
            position: 'sticky',
            display: 'flex',
            gap: 'var(--spacing-05)',
            alignItems: 'flex-start',
            flexGrow: 1,
            maxWidth: '100rem',
            margin: 'auto',
          }}
        >
          <div style={{ padding: 'var(--spacing-07)' }}>
            <h4
              className='undp-typography'
              style={{
                color: 'var(--white)',
                backgroundColor: 'var(--gray-700)',
                width: 'max-content',
                padding: 'var(--spacing-02) var(--spacing-05)',
                marginBottom: 0,
              }}
            >
              Getting over the finish line
            </h4>
            <h4
              className='undp-typography'
              style={{
                color: 'var(--white)',
                backgroundColor: 'var(--gray-700)',
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
                  style={{ opacity: 1, backgroundColor: (UNDPColorModule.sdgColors as any)[`sdg${reportData.interlinkages.source.sdg}`] }}
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
                  style={{ opacity: 1, backgroundColor: (UNDPColorModule.sdgColors as any)[`sdg${reportData.interlinkages.source.sdg}`] }}
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
