import styled from 'styled-components';
import IMAGES from '../../img/images';
import { SummaryReportDataType } from '../../Types';

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
  &:last-of-type{
    padding: var(--spacing-03) var(--spacing-05) var(--spacing-05) var(--spacing-05) !important;
  }
`;

export const FiscalSlide = (props: Props) => {
  const {
    reportData,
  } = props;
  return (
    <div>
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
            marginLeft: 'auto',
            marginRight: 'auto',
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
              But there are fiscal
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
              challenges to a win...
            </h4>
            {
              reportData.Fiscal.split('\n').map((d, i) => (
                <P
                  className='undp-typography'
                  key={i}
                >
                  {d}
                </P>
              ))
            }
          </div>
        </div>
      </SectionEl>
    </div>
  );
};
