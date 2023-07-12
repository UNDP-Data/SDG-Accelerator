import { Scrollama, Step } from 'react-scrollama';
import styled from 'styled-components';
import { useState } from 'react';
import { TargetStatusType } from '../../../Types';
import { FIVE_P } from '../../../Constants';
import IMAGES from '../../../img/images';
import { FivePChart } from './FivePChart';
import { FlowerChart } from './FlowerChart';

interface Props {
  targetStatuses: TargetStatusType[];
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

const ScrollyOverlay = styled.div`
  position: relative;
  justify-content: center;
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
  height: 50vh;
  background-color: var(--gray-200);
  opacity: 1;
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
  const onStepEnter = (d: any) => {
    const { data } = d;
    setStepValue(data);
  };
  return (
    <div>
      <SectionEl
        bgImage={IMAGES.TrendsBG}
        style={{
          textAlign: 'center',
          padding: '2rem 0',
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
            <h3
              className='undp-typography'
              style={{
                color: 'var(--white)',
                backgroundColor: 'var(--gray-700)',
                width: 'max-content',
                padding: 'var(--spacing-02) var(--spacing-05)',
                marginBottom: 0,
              }}
            >
              SDG Trends
            </h3>
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
              stepValue === 'all'
                ? <FivePChart /> : <FlowerChart status={statusByPs} tag={stepValue} />
            }
          </div>
        </div>
      </SectionEl>
      <Scrollama
        onStepEnter={onStepEnter}
        offset={0.5}
      >
        <Step data='all'>
          <ScrollyOverlay style={{ opacity: 0 }} />
        </Step>
        <Step data='onTrack'>
          <ScrollyOverlay style={{ opacity: 0 }} />
        </Step>
        <Step data='offTrack'>
          <ScrollyOverlay style={{ opacity: 0 }} />
        </Step>
        <Step data='gapsNA'>
          <ScrollyOverlay style={{ opacity: 0 }} />
        </Step>
        <Step data='gapsNA'>
          <ScrollyOverlay style={{ opacity: 0 }} />
        </Step>
      </Scrollama>
    </div>
  );
};
