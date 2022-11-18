/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import styled from 'styled-components';
import { Modal, Radio } from 'antd';
import { LinkageDataType, LiteratureDataType } from '../Types';
import { InterlinkagesViz } from './InterlinkageViz';

import '../style/radioStyle.css';
import Background from '../img/UNDP-hero-image.png';

const LinkageData:LinkageDataType[] = require('../Data/linkages.json');
const LiteratureData:LiteratureDataType[] = require('./Literature.json');

interface Props {
  data: any;
  countryFullName: string;
}

interface TargetStatusType {
  target: string;
  status: 'On Track' | 'Identified Gap' | 'For Review' | undefined;
}

const HeroImageEl = styled.div`
  background: url(${Background}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const Interlinkages = (props: Props) => {
  const { data, countryFullName } = props;
  const [selectedTarget, setSelectedTarget] = useState('All Targets');
  const [literatureModal, setLiteratureModal] = useState(false);
  const [linkageType, setLinkageTypes] = useState<'synergies' | 'tradeOffs'>('synergies');
  const targetOptions = [{ label: 'All Targets' }];

  data.forEach((goal: any) => {
    goal.Targets.forEach((target: any) => {
      targetOptions.push({ label: `${target.Target}: ${target['Target Description']}` });
    });
  });
  let TargetMostSynergies = '';
  let mostSynergies = 0;
  LinkageData.forEach((d) => {
    TargetMostSynergies = d.synergies.length > mostSynergies ? d.id : TargetMostSynergies;
    mostSynergies = d.synergies.length > mostSynergies ? d.synergies.length : mostSynergies;
  });
  const targetStatus: TargetStatusType[] = [];
  data.forEach((goal: any) => {
    goal.Targets.forEach((target: any) => {
      targetStatus.push({
        target: target.Target,
        status: target.status,
      });
    });
  });
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            SDG Interlinkages For
            {' '}
            {countryFullName}
          </h1>
          <h5 className='undp-typography'>
            Examine how the 169 targets are interconnected and how this relates to the SDGs that are not on track to reach the 2030 goals .
          </h5>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>Synergies and Tradeoffs</h2>
          </div>
          <div className='undp-section-content'>
            The SDGs do not exist in silos, understanding how the goals are interconnected, both positively and negatively, is essential to understanding the mechanisms for achieving the targets.
            <br />
            <br />
            Identifying the most interlinked and strongest SDGs is important for acceleration. Thus, important to interrogate the interlinkages at the national level.
          </div>
        </div>
      </div>
      <div className='margin-top-13 max-width-1440'>
        <div className='flex-div flex-space-between flex-vert-align-center margin-bottom-05'>
          <h3 className='undp-typography bold'>Interlinkages Visualization</h3>
          <Radio.Group onChange={(d) => { setLinkageTypes(d.target.value); }} value={linkageType}>
            <Radio className='undp-radio' value='synergies'>Synergies</Radio>
            <Radio className='undp-radio' value='tradeOffs'>Trade Offs</Radio>
          </Radio.Group>
        </div>
        <p className='undp-typography small-font'>
          The synergies and tradeoffs are global, which means they are the same for all countries as mapped by the
          {' '}
          <a className='undp-style' target='_blank' href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-visualization' rel='noreferrer'>KnowSDGs Platform by European Commission</a>
          . The interlinkages of specific targets on a dis-aggregated level as provided by the
          {' '}
          <span className='link-button' onClick={() => { setLiteratureModal(true); }} style={{ cursor: 'pointer' }}>literature (click here to see the list of literature)</span>
          .
          <br />
          <br />
          The traffic light colouring of the targets is customised based on each countries data on the SDGs. Targets are greyed out because of lack of data, however, the information on interlinkages still applies.
          <br />
          <br />
          <span className='italics'>Click on the target to see the interlinkages</span>
        </p>
      </div>
      <div className='margin-top-07 max-width-1440 margin-bottom-13'>
        <InterlinkagesViz
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
          linkageType={linkageType}
          data={data}
          linkageData={LinkageData}
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
