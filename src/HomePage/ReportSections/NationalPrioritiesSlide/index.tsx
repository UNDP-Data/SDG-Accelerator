import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import UNDPColorModule from 'undp-viz-colors';
import IMAGES from '../../../img/images';
import { NationalPrioritiesBubbleChart } from './NationalPrioritiesBubbleChart';
import { SDGGOALS } from '../../../Constants';

interface Props {
  priorityData: any;
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
    <div>
      <SectionEl
        bgImage={IMAGES.PrioritiesBG}
        style={{
          textAlign: 'center',
          padding: '2rem 0',
          position: 'sticky',
          top: '115px',
          width: 'calc(100vw - 1rem)',
          height: 'calc(100vh - 200px)',
        }}
        ref={ref}
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
              National Priorities
            </h4>
            <P
              className='undp-typography'
            >
              {countryFullName}
              &apos;s national priorities are analyzed
            </P>
            <P
              className='undp-typography'
            >
              using machine learning to reveal the most prominent
            </P>
            <P
              className='undp-typography'
            >
              SDGs referenced in national policy documents.
            </P>
            <P
              className='undp-typography margin-top-05 padding-top-07'
            >
              SDGs that are high Priority
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
            marginTop: '2rem',
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
