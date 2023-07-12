import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { format } from 'd3-format';
import { SummaryReportDataType } from '../../../Types';
import { UnitChart } from './UnitChart';

interface Props {
  reportData: SummaryReportDataType;
  countryFullName: string;
}
interface BgInterface {
  bgColor: string;
}

const SectionEl = styled.div<BgInterface>`
  background-color: ${(props) => props.bgColor};
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

export const SDGPushSlide = (props: Props) => {
  const {
    reportData,
    countryFullName,
  } = props;
  const { withSDGPush, withoutSDGPush, scale } = reportData;
  return (
    <div>
      <SectionEl
        bgColor={UNDPColorModule.sdgColors.sdg1}
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
              Achieving the SDGs
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
              is possible...
            </h4>
            <P
              className='undp-typography'
            >
              Development that incorporates &apos;SDG Push&apos; accelerator in
            </P>
            <P
              className='undp-typography'
            >
              governance, social protection, green economy and
            </P>
            <P
              className='undp-typography'
            >
              digital disruption can reduce poverty.
            </P>
            <P
              className='undp-typography margin-top-03'
            >
              With the SDG Push,
              {' '}
              <span className='bold'>{format('~s')(withoutSDGPush - withSDGPush).replace('M', ' million')}</span>
              {' '}
              (from
              {' '}
              {format('~s')(withoutSDGPush).replace('G', 'B')}
              {' '}
              to
              {' '}
              {format('~s')(withSDGPush).replace('G', 'B')}
              )
            </P>
            <P
              className='undp-typography'
            >
              fewer people in
              {' '}
              {countryFullName}
              {' '}
              will be living
            </P>
            <P
              className='undp-typography'
            >
              in poverty by 2030.
            </P>
          </div>
          <div style={{
            flexShrink: 1,
            flexGrow: 1,
            marginTop: '2rem',
            marginRight: '2rem',
            marginLeft: '2rem',
          }}
          >
            <UnitChart withoutSDGPush={withoutSDGPush} withSDGPush={withSDGPush} scale={scale} />
          </div>
        </div>
      </SectionEl>
    </div>
  );
};
