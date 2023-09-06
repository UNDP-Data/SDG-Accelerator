import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { TargetStatusType } from '../../../Types';
import { FIVE_P } from '../../../Constants';
import { FivePChart } from './FivePChart';
import { FlowerChart } from './FlowerChart';

interface Props {
  targetStatuses: TargetStatusType[];
  countryFullName: string;
}

const SectionEl = styled.div`
  background-color: var(--blue-700);
  display: flex;
  width: calc(100vw - 1rem);
  text-align: center;
  padding: 4rem 0;
  position: sticky;
  top: 115px;
  width: calc(100vw - 1rem);
  height: calc(100vh - 7.1875rem - 9rem);
`;

const ScrollyOverlay = styled.div`
  position: relative;
  justify-content: center;
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40vh;
  height: 40vh;
  background-color: var(--gray-200);
  opacity: 0;
`;
const P = styled.p`
  color: var(--blue-700);
  background-color: var(--white);
  padding: var(--spacing-03) var(--spacing-05) !important;
  margin-bottom: 0 !important;
  width: max-content;
`;

export const SDGTrendsSlide = (props: Props) => {
  const {
    targetStatuses,
    countryFullName,
  } = props;
  const statusByPs = FIVE_P.map((p) => {
    const onTrack = ((targetStatuses.filter((d) => d.status === 'On Track' && p.goals.indexOf(d.goal) !== -1).length) * 100) / p.totalNoOfTargets;
    const offTrack = ((targetStatuses.filter((d) => d.status === 'Identified Gap' && p.goals.indexOf(d.goal) !== -1).length) * 100) / p.totalNoOfTargets;
    const forReview = ((targetStatuses.filter((d) => d.status === 'For Review' && p.goals.indexOf(d.goal) !== -1).length) * 100) / p.totalNoOfTargets;
    const notOnTrack = offTrack + forReview;
    return ({
      ...p,
      onTrack,
      offTrack,
      forReview,
      gapsNA: 100 - (onTrack + offTrack + forReview),
      notOnTrack,
    });
  });
  const [stepValue, setStepValue] = useState<'all' | 'onTrack' | 'offTrack' | 'gapsNA'>('all');

  const ref1 = useInView({
    threshold: 0.4,
  });
  const ref2 = useInView({
    threshold: 0.4,
  });
  const ref3 = useInView({
    threshold: 0.4,
  });
  const ref4 = useInView({
    threshold: 0.4,
  });
  const ref5 = useInView({
    threshold: 0.4,
  });
  useEffect(() => {
    if (ref1.inView && !ref2.inView && !ref3.inView && !ref4.inView && !ref5.inView) {
      setStepValue('all');
    }
    if (!ref1.inView && ref2.inView && !ref3.inView && !ref4.inView && !ref5.inView) {
      setStepValue('onTrack');
    }
    if (!ref1.inView && !ref2.inView && ref3.inView && !ref4.inView && !ref5.inView) {
      setStepValue('offTrack');
    }
    if (!ref1.inView && !ref2.inView && !ref3.inView && ref4.inView && !ref5.inView) {
      setStepValue('gapsNA');
    }
    if (!ref1.inView && !ref2.inView && !ref3.inView && !ref4.inView && ref5.inView) {
      setStepValue('gapsNA');
    }
  }, [ref1.inView, ref2.inView, ref3.inView, ref4.inView, ref5.inView]);
  return (
    <div>
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
          <div style={{ padding: '0 var(--spacing-07)', height: 'calc((100vh - 7.1875rem) - 9rem)' }}>
            <h4
              className='undp-typography bold'
              style={{
                color: 'var(--blue-700)',
                backgroundColor: 'var(--white)',
                width: 'max-content',
                padding: 'var(--spacing-02) var(--spacing-05)',
                marginBottom: 0,
              }}
            >
              SDG Trends
            </h4>
            <P
              className='undp-typography'
            >
              Understanding how
              {' '}
              {countryFullName}
              {' '}
              performs against the
            </P>
            <P
              className='undp-typography'
            >
              SDG targets provides a baseline landscape against
            </P>
            <P
              className='undp-typography'
            >
              which to build SDG policy pathways.
            </P>
            <P
              className='undp-typography bold margin-top-03'
              style={{
                backgroundColor: 'var(--dark-green)',
                color: 'var(--white)',
                opacity: stepValue === 'onTrack' ? 1 : 0.25,
              }}
            >
              Percent of Targets On Track
            </P>
            <P
              className='undp-typography bold margin-top-03'
              style={{
                backgroundColor: 'var(--dark-red)',
                color: 'var(--white)',
                opacity: stepValue === 'offTrack' ? 1 : 0.25,
              }}
            >
              Percent of Targets Off Track
            </P>
            <P
              className='undp-typography bold margin-top-03'
              style={{
                backgroundColor: 'var(--gray-600)',
                color: 'var(--white)',
                opacity: stepValue === 'gapsNA' ? 1 : 0.25,
              }}
            >
              Percent of Targets Missing Data
            </P>
          </div>
          <div style={{
            flexShrink: 1,
            flexGrow: 1,
            marginRight: '2rem',
            marginLeft: '2rem',
            height: 'calc(100vh - 7.1875rem - 9rem)',
          }}
          >
            {
              stepValue === 'all'
                ? <FivePChart /> : <FlowerChart status={statusByPs} tag={stepValue} />
            }
          </div>
        </div>
      </SectionEl>
      <ScrollyOverlay ref={ref1.ref} />
      <ScrollyOverlay ref={ref2.ref} />
      <ScrollyOverlay ref={ref3.ref} />
      <ScrollyOverlay ref={ref4.ref} />
      <ScrollyOverlay ref={ref5.ref} />
    </div>
  );
};
