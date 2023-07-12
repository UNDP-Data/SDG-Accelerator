import styled from 'styled-components';
import IMAGES from '../../../img/images';
import { SummaryReportDataType } from '../../../Types';
import { GDPGraph } from './GDPGraph';

interface Props {
  reportData: SummaryReportDataType;
  countryCode: string;
  countryFullName: string;
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

export const SDGMomentSlide = (props: Props) => {
  const {
    reportData,
    countryCode,
    countryFullName,
  } = props;
  return (
    <div>
      <SectionEl
        bgImage={IMAGES.CurrencyBG}
        style={{
          textAlign: 'center',
          padding: '2rem 0',
          position: 'sticky',
          top: '115px',
          width: 'calc(100vw - 1rem)',
          height: 'calc(100vh - 200px)',
          display: 'flex',
        }}
      >
        <div
          style={{
            position: 'sticky',
            display: 'flex',
            gap: 'var(--spacing-05)',
            alignItems: 'flex-start',
            flexGrow: 1,
          }}
        >
          <div style={{ padding: 'var(--spacing-07)' }}>
            {
              reportData.SDGMoment.split('\n').map((d, i) => (
                <P
                  className='undp-typography'
                  key={i}
                >
                  {d}
                </P>
              ))
            }
          </div>
          <div style={{
            flexGrow: 1,
            marginTop: '2rem',
            marginRight: '2rem',
          }}
          >
            <GDPGraph countryCode={countryCode} countryFullName={countryFullName} />
          </div>
        </div>
      </SectionEl>
    </div>
  );
};
