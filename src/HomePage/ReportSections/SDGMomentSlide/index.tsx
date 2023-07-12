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
  padding: 4rem 0 10rem 0;
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
            alignItems: 'flex-start',
            flexGrow: 1,
            maxWidth: '100rem',
            margin: 'auto',
          }}
        >
          <div style={{ padding: '0 var(--spacing-07)' }}>
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
              SDG Moment
            </h4>
            {
              reportData.SDGMoment.split('\n\n')[0].split('\n').map((d, i) => (
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
            display: 'flex',
            alignItems: 'flex-end',
            backgroundColor: 'var(--white)',
            marginRight: '7.5rem',
          }}
          >
            <GDPGraph countryCode={countryCode} countryFullName={countryFullName} />
          </div>
        </div>
        <div style={{
          backgroundColor: 'rgba(31, 90, 149, 0.3)',
          width: '17.5rem',
          position: 'absolute',
          bottom: '6rem',
          right: '2rem',
          zIndex: '5',
        }}
        >
          <div style={{
            padding: 'var(--spacing-05)',
            textAlign: 'left',
            color: 'var(--black)',
            fontWeight: 'bold',
          }}
          >
            {reportData.SDGMoment.split('\n\n')[1].replaceAll('\n', ' ')}
          </div>
        </div>
      </SectionEl>
    </div>
  );
};
