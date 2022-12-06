import { useEffect, useState } from 'react';
import { SDGSListType, StatusesType } from '../Types';
import { LineChart } from './LineChart';

import '../style/sideBarNav.css';

const SDGList:SDGSListType[] = require('../Data/SDGGoalList.json');

interface Props {
  statusData: StatusesType;
  countryData: any;
  selectedSDG: string;
}

export const SDGGapsData = (props: Props) => {
  const {
    statusData,
    countryData,
    selectedSDG,
  } = props;
  const targets = SDGList[SDGList.findIndex((d) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].Targets;
  const [selectedTarget, setSelectedTarget] = useState(targets[0]);
  const [selectedIndicator, setSelectedIndicator] = useState(targets[0].Indicators[0]);
  const [selectedIndicatorTS, setSelectedIndicatorTS] = useState(countryData.filter((d: any) => d.indicator === targets[0].Indicators[0].Indicator.split(' ')[1]));
  useEffect(() => {
    const targetsUpdated = SDGList[SDGList.findIndex((d) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].Targets;
    setSelectedTarget(targetsUpdated[0]);
    setSelectedIndicator(targetsUpdated[0].Indicators[0]);
    setSelectedIndicatorTS((countryData.filter((d: any) => d.indicator === targetsUpdated[0].Indicators[0].Indicator.split(' ')[1])));
  }, [selectedSDG, statusData]);
  return (
    <div className='flex-div margin-bottom-13'>
      <div className='side-bar-nav'>
        {
          targets.map((d, i) => (
            <button
              type='button'
              key={i}
              className={d.Target === selectedTarget.Target ? 'selected side-bar-el' : 'side-bar-el'}
              onClick={() => { setSelectedTarget(d); setSelectedIndicator(d.Indicators[0]); setSelectedIndicatorTS((countryData.filter((el: any) => el.indicator === d.Indicators[0].Indicator.split(' ')[1]))); }}
            >
              <div
                style={
                  {
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '1rem',
                    backgroundColor: `${statusData.targetStatus.findIndex((el) => `Target ${el.target}` === d.Target) === -1
                      ? 'var(--gray-400)'
                      : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === d.Target)].status === 'On Track'
                        ? 'var(--dark-green)'
                        : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === d.Target)].status === 'For Review'
                          ? 'var(--dark-yellow)'
                          : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === d.Target)].status === 'Identified Gap'
                            ? 'var(--dark-red)'
                            : 'var(--gray-400)'}`,
                  }
                }
              />
              {d.Target}
            </button>
          ))
        }
      </div>
      <div style={{ width: 'calc(100% - 9rem)', padding: '1rem 2rem' }}>
        <div className='flex-div flex-vert-align-center margin-bottom-05' style={{ gap: '0.5rem' }}>
          <h6 className='undp-typography margin-bottom-00'>
            {selectedTarget.Target}
          </h6>
          <div
            className={`undp-chip undp-chip-small ${statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target) === -1
              ? 'undp-chip-dark-gray'
              : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status === 'On Track'
                ? 'undp-chip-dark-green'
                : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status === 'For Review'
                  ? 'undp-chip-dark-yellow'
                  : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status === 'Identified Gap'
                    ? 'undp-chip-dark-red'
                    : 'undp-chip-dark-gray'}`}
          >
            {statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target) === -1 ? 'Gaps NA' : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status ? statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status : 'Gaps NA'}
          </div>
        </div>
        <p className='undp-typography margin-bottom-05'>
          {selectedTarget['Target Description']}
        </p>
        <div className='flex-div margin-bottom-07'>
          {
            selectedTarget.Indicators.map((d, i: number) => (
              <button
                type='button'
                className={`undp-tab-radio ${d.Indicator === selectedIndicator.Indicator ? 'selected' : ''}`}
                key={i}
                onClick={() => { setSelectedIndicator(d); setSelectedIndicatorTS((countryData.filter((el: any) => el.indicator === d.Indicator.split(' ')[1]))); }}
              >
                {d.Indicator}
              </button>
            ))
          }
        </div>
        <div className='margin-bottom-07'>
          <div className='flex-div flex-vert-align-center margin-bottom-03' style={{ gap: '0.5rem' }}>
            <h6 className='undp-typography margin-bottom-00'>
              {selectedIndicator.Indicator}
            </h6>
            <div
              className={`undp-chip undp-chip-small ${statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator) === -1
                ? 'undp-chip-dark-gray'
                : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status === 'On Track'
                  ? 'undp-chip-dark-green'
                  : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status === 'For Review'
                    ? 'undp-chip-dark-yellow'
                    : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status === 'Identified Gap'
                      ? 'undp-chip-dark-red'
                      : 'undp-chip-dark-gray'}`}
            >
              {statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator) === -1 ? 'Gaps NA' : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status ? statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status : 'Gaps NA'}
            </div>
          </div>
          <p className='undp-typography margin-bottom-07'>
            {selectedIndicator['Indicator Description']}
          </p>
        </div>
        <div className='flex-div undp-scrollbar top-scrollbars' style={{ gap: '2rem', overflow: 'auto', paddingBottom: '0.5rem' }}>
          {
            selectedIndicatorTS.map((d: any, i: number) => (
              <LineChart data={d} key={i} />
            ))
          }
          {
            selectedIndicatorTS.length === 0
              ? (
                <div
                  style={{
                    width: '85%', flexShrink: 0, minWidth: '50rem', backgroundColor: 'var(--gray-100)', padding: '1rem 2rem',
                  }}
                >
                  <h6 className='undp-typography margin-top-05'>No Data Available</h6>
                </div>
              ) : null
          }
        </div>
      </div>
    </div>
  );
};
