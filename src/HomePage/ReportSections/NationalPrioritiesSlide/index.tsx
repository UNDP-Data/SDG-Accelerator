import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import UNDPColorModule from 'undp-viz-colors';
import { NationalPrioritiesBubbleChart } from './NationalPrioritiesBubbleChart';
import { SDGGOALS } from '../../../Constants';

interface Props {
  priorityData: any;
  countryFullName: string;
}

const SectionEl = styled.div`
  background-color: var(--gray-200);
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

export const NationalPrioritiesSlide = (props: Props) => {
  const {
    priorityData,
    countryFullName,
  } = props;
  const [ref, inView] = useInView({
    threshold: 0.5,
  });
  return (
    <div className='flex-div' style={{ height: 'calc(100vh - 131px)' }}>
      <SectionEl
        ref={ref}
      >
        <div
          style={{
            position: 'sticky',
            display: 'flex',
            gap: 'var(--spacing-05)',
            alignItems: 'center',
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
              National Priorities
            </h4>
            <P
              className='undp-typography'
            >
              {countryFullName}
              &apos;s priorities are analyzed by
            </P>
            <P
              className='undp-typography'
            >
              machine learning to synthesize the most
            </P>
            <P
              className='undp-typography'
            >
              significant national priorities.
            </P>
            <P
              className='undp-typography margin-top-05 padding-top-07'
            >
              Example of the national priorities include:
            </P>
            {
              priorityData.filter((d: any) => d.category === 'High').map((d: any, i: number) => (
                <P
                  className='undp-typography bold margin-top-03'
                  style={{ opacity: 1, backgroundColor: (UNDPColorModule.sdgColors as any)[`sdg${d.sdg}`] }}
                  key={i}
                >
                  {SDGGOALS[d.sdg - 1]}
                </P>
              ))
            }
          </div>
          <div style={{
            flexShrink: 1,
            flexGrow: 1,
            marginRight: '2rem',
            marginLeft: '2rem',
          }}
          >
            {
              priorityData
                ? (
                  <NationalPrioritiesBubbleChart
                    inView={inView}
                    data={priorityData}
                  />
                ) : null
            }
          </div>
        </div>
      </SectionEl>
    </div>
  );
};
