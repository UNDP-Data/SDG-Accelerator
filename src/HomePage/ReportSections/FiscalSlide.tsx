import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { SummaryReportDataType } from '../../Types';

interface Props {
  reportData: SummaryReportDataType;
}

const SectionEl = styled.div`
  background-color: var(--blue-700);
  text-align: center;
  padding: 8rem 0;
  top: 115px;
  width: 100%;
`;

const H4 = styled.h4`
  color: var(--blue-700);
  background-color: var(--white);
  padding: var(--spacing-03) var(--spacing-05) !important;
  margin-bottom: 0 !important;
  width: max-content;
`;

export const FiscalSlide = (props: Props) => {
  const {
    reportData,
  } = props;
  return (
    <div className='flex-div' style={{ textAlign: 'center', justifyContent: 'center' }}>
      <SectionEl>
        <div
          className='flex-div gap-00'
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            className='undp-typography bold margin-bottom-05'
            style={{
              color: 'var(--blue-700)',
              backgroundColor: 'var(--white)',
              width: 'max-content',
              padding: 'var(--spacing-02) var(--spacing-05)',
            }}
          >
            But there are fiscal challenges to a win...
          </h2>
          {
            reportData.Fiscal.split('\n').map((d, i) => (
              <H4
                className='undp-typography'
                key={i}
              >
                {d}
              </H4>
            ))
          }
        </div>
        <div style={{
          padding: 'var(--spacing-09) var(--spacing-07)',
        }}
        >
          <NavLink
            to='./detailed-report'
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className='undp-typography margin-bottom-00 undp-button button-primary'
              style={{
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: '1.5rem',
              }}
            >
              See Detailed Report
            </div>
          </NavLink>
        </div>
      </SectionEl>
    </div>
  );
};
