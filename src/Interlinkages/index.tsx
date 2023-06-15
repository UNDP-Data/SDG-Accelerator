/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { Modal, Radio } from 'antd';
import {
  LinkageDataType,
  TargetStatusType, TargetStatusWithDetailsType,
} from '../Types';
import { InterlinkagesViz } from './InterlinkageViz';
import { SDGList } from '../Data/SDGGoalList';
import { NetworkGraph } from './NetworkGraph';
import { LinkageData } from '../Data/linkages';
import { LinkageData2023 } from '../Data/linkageWithDetails';
import { LiteratureData } from '../Data/Literature';
import IMAGES from '../img/images';
import { DownloadImage } from '../utils/DownloadImage';

interface Props {
  targetStatuses: TargetStatusType[];
  countryFullName: string;
}

const HeroImageEl = styled.div`
background: url(${IMAGES.heroImage}) rgba(0, 0, 0, 0.3) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const Interlinkages = (props: Props) => {
  const { targetStatuses, countryFullName } = props;
  const [selectedTarget, setSelectedTarget] = useState('All Targets');
  const [year, setYear] = useState('2023');
  const [literatureModal, setLiteratureModal] = useState(false);
  const interlinkageRef = useRef<HTMLDivElement>(null);
  const [linkageType, setLinkageTypes] = useState<'synergies' | 'tradeOffs' | 'notSpecified'>('synergies');
  let TargetMostSynergies = '';
  let mostSynergies = 0;
  LinkageData.forEach((d) => {
    TargetMostSynergies = d.synergies.length > mostSynergies ? d.id : TargetMostSynergies;
    mostSynergies = d.synergies.length > mostSynergies ? d.synergies.length : mostSynergies;
  });
  const targetStatus: TargetStatusWithDetailsType[] = [];
  SDGList.forEach((goal) => {
    goal.Targets.forEach((target) => {
      const status = targetStatuses.findIndex((el) => `Target ${el.target}` === target.Target) !== -1 ? targetStatuses[targetStatuses.findIndex((el) => `Target ${el.target}` === target.Target)].status : null;
      targetStatus.push({
        goal: goal.Goal,
        target: target.Target,
        description: target['Target Description'],
        status,
      });
    });
  });
  const linkData2023 = LinkageData2023.map((d) => ({
    ...d,
    synergies: d.synergies.map((el) => el.target),
    tradeOffs: d.tradeOffs.map((el) => el.target),
    notSpecified: d.notSpecified.map((el) => el.target),
  }));
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            SDG Interlinkages For
            {' '}
            {countryFullName}
          </h1>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div flex-wrap' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>Synergies and Tradeoffs</h2>
          </div>
          <div className='undp-section-content'>
            The SDGs do not exist in silos. Understanding the interactions across social, economic and environmental elements of sustainable development is essential to move the needle on the SDGs. SDG Interlinkages show how actions directed towards one SDG can influence the others. Uncovering and understanding these interactions helps in achieving the 2030 Agenda - avoiding the unintended deterioration of the SDGs and their 169 associated targets.
            <br />
            <br />
            The target-level interlinkages are based on the latest available methodology by the
            {' '}
            <a href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-targets' target='_blank' rel='noreferrer' className='undp-style dark-bg'>KnowSDGs Platform by European Commission</a>
            . A first literature review (
            <a href='https://publications.jrc.ec.europa.eu/repository/handle/JRC115163' target='_blank' rel='noreferrer' className='undp-style dark-bg'>Miola et al., 2019</a>
            ) was updated and expanded in
            {' '}
            <a href='https://knowsdgs.jrc.ec.europa.eu/intro-interlinkages' target='_blank' rel='noreferrer' className='undp-style dark-bg'>2021-2022</a>
            {' '}
            by a team of researchers who retrieved and analysed all relevant scientific and grey literature* on SDG interlinkages, both in Scopus and Google Scholar.
          </div>
        </div>
      </div>
      <div className='margin-top-13 max-width-1440' style={{ padding: '0 1rem' }}>
        <div className='flex-div flex-space-between flex-vert-align-center margin-bottom-05'>
          <h3 className='undp-typography bold'>Interlinkages Visualization</h3>
          <div className='flex-div flex-vert-align-center'>
            <Radio.Group className='undp-button-radio' onChange={(d) => { setYear(d.target.value); }} value={year}>
              <Radio.Button className='undp-radio' value='2019'>2019</Radio.Button>
              <Radio.Button className='undp-radio' value='2023'>2023</Radio.Button>
            </Radio.Group>
            <Radio.Group onChange={(d) => { setLinkageTypes(d.target.value); }} value={linkageType}>
              <Radio className='undp-radio' value='synergies'>Synergies</Radio>
              <Radio className='undp-radio' value='tradeOffs'>Trade Offs</Radio>
              <Radio className='undp-radio' value='notSpecified'>Not Specified</Radio>
            </Radio.Group>
          </div>
        </div>
        <p className='undp-typography small-font margin-bottom-07'>
          The synergies and tradeoffs are global, which means they are the same for all countries as mapped by the
          {' '}
          <a className='undp-style' target='_blank' href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-targets' rel='noreferrer'>KnowSDGs Platform by European Commission</a>
          .
          <br />
          <br />
          The traffic light colouring of the targets is customised based on each countries data on the SDGs. Greyed out targets occur due to a lack of data, however, the information on interlinkages still applies.
          <br />
          <br />
          <span className='italics'>Click on a target to see the interlinkages</span>
        </p>
        <button
          className='undp-button tertiary-button'
          type='button'
          style={{ color: 'var(--blue-600)', padding: 0 }}
          onClick={() => { if (interlinkageRef.current) { DownloadImage(interlinkageRef.current, `Interlinkage Graph ${countryFullName}`); } }}
        >
          Download Interlinkages as Image
        </button>
      </div>
      <div className='margin-top-07 max-width-1440 margin-bottom-13' style={{ padding: '0 1rem' }} ref={interlinkageRef}>
        <InterlinkagesViz
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
          linkageType={linkageType}
          data={targetStatus}
          linkageData={year === '2023' ? linkData2023 as LinkageDataType[] : LinkageData as LinkageDataType[]}
        />
      </div>
      <div className='margin-top-13 max-width-1440 margin-bottom-13' style={{ padding: '0 1rem' }}>
        <NetworkGraph
          data={targetStatus}
          linkageData={year === '2023' ? linkData2023 as LinkageDataType[] : LinkageData as LinkageDataType[]}
        />
      </div>
      <Modal
        className='undp-modal'
        title='Literature on Interlinkages and the method to make results comparable'
        open={literatureModal}
        onCancel={() => { setLiteratureModal(false); }}
        onOk={() => { setLiteratureModal(false); }}
      >
        <div
          className='margin-top-07 flex-div flex-wrap'
          style={{
            width: '75vw', minWidth: '60rem', maxWidth: '90rem', gap: '2rem',
          }}
        >
          {
            LiteratureData.map((d, i) => (
              <div style={{ backgroundColor: 'var(--gray-200)', padding: 'var(--spacing-07)', width: '100%' }} key={i}>
                <h5 className='undp-typography'>{d.Publication}</h5>
                <p className='undp-typography italics small-font'>{d.Author}</p>
                {
                  d['Peer reviewed'] ? <div className='undp-chip undp-chip-green undp-chip-small margin-bottom-07'>Peer Reviewed</div> : null
                }
                <div className='flex-div'>
                  <div style={{ width: 'calc(50% - 0.5rem)' }}>
                    <h6 className='undp-typography margin-bottom-03'>
                      Year
                    </h6>
                    <p className='undp-typography'>
                      {d.Year}
                    </p>
                  </div>
                  <div style={{ width: 'calc(50% - 0.5rem)' }}>
                    <h6 className='undp-typography margin-bottom-03'>
                      SDGs
                    </h6>
                    <p className='undp-typography'>
                      {d.Goals === 'all' ? 'All Goals' : d.Goals}
                    </p>
                  </div>
                </div>
                {
                  d['Full reference']
                    ? (
                      <div>
                        <h6 className='undp-typography margin-bottom-03'>
                          Full Reference
                        </h6>
                        <p className='undp-typography italics small-font'>
                          {d['Full reference']}
                        </p>
                      </div>
                    ) : null
                }
              </div>
            ))
          }
        </div>
      </Modal>
    </>
  );
};
