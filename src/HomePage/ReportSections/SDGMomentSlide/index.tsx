import styled from 'styled-components';
import { SummaryReportDataType } from '../../../Types';
import { GDPGraph } from './GDPGraph';

interface Props {
  reportData: SummaryReportDataType;
  countryCode: string;
  countryFullName: string;
}

const SectionEl = styled.div`
  background-color: #edf6ff;
  display: flex;
  width: calc(100vw - 1rem);
  text-align: center;
  padding: 4rem 0;
  position: sticky;
  top: 115px;
  display: flex;
`;

const H5 = styled.h5`
  color: var(--white);
  background-color: var(--blue-700);
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
    <div className='flex-div'>
      <SectionEl>
        <div
          style={{
            position: 'sticky',
            display: 'flex',
            gap: 'var(--spacing-05)',
            alignItems: 'stretch',
            flexGrow: 1,
            maxWidth: '100rem',
            margin: 'auto',
          }}
        >
          <div style={{ padding: '0 var(--spacing-07)' }}>
            {
              reportData.SDGMoment.split('\n').map((d, i) => (
                <H5
                  className='undp-typography'
                  key={i}
                >
                  {d}
                </H5>
              ))
            }
          </div>
          <div style={{
            flexGrow: 1,
          }}
          >
            <GDPGraph countryCode={countryCode} countryFullName={countryFullName} />
          </div>
        </div>
      </SectionEl>
    </div>
  );
};
