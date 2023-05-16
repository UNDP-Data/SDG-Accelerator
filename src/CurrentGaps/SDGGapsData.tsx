import { useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import { StatusesType, TimeSeriesDataTypeWithStatusCode } from '../Types';
import AllSeries from '../Data/FullMethodology.json';
import { LineChart } from './LineChart';
import { SDGList } from '../Data/SDGGoalList';

interface Props {
  statusData: StatusesType;
  countryData: TimeSeriesDataTypeWithStatusCode[];
  selectedSDG: string;
}

interface ColorProps {
  backgroundColor: string;
}

const ColorCircle = styled.div<ColorProps>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 1rem;
  background-color: ${(props) => props.backgroundColor};
`;

const SideBarNavEl = styled.div`
  margin-right: -2px;
  border-right: 2px solid var(--gray-200);
  width: 9rem !important;
  min-width: 9rem !important;
`;

interface SelectedProps{
  selected: boolean;
}

const SideBarButtonEl = styled.button<SelectedProps>`
  width: 100%;
  background-color: transparent;
  display: flex;
  gap: 0.375rem;
  align-items: center;
  padding: 1rem 0;
  border: 0;
  border-right: ${(props) => (props.selected ? '2px solid var(--blue-600)' : '2px solid var(--gray-200)')};
  color: ${(props) => (props.selected ? 'var(--blue-600)' : 'var(--black)')};
  font-size: 1rem;
  font-weight: ${(props) => (!props.selected ? 'normal' : '700')};
  cursor: pointer;
`;

export const SDGGapsData = (props: Props) => {
  const {
    statusData,
    countryData,
    selectedSDG,
  } = props;
  const targets = SDGList[SDGList.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets;
  const [selectedTarget, setSelectedTarget] = useState(targets[0]);
  const [selectedIndicator, setSelectedIndicator] = useState(targets[0].Indicators[0]);
  const [selectedIndicatorTS, setSelectedIndicatorTS] = useState(countryData.filter((d) => d.indicator === targets[0].Indicators[0].Indicator.split(' ')[1]));
  useEffect(() => {
    const targetsUpdated = SDGList[SDGList.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets;
    setSelectedTarget(targetsUpdated[0]);
    setSelectedIndicator(targetsUpdated[0].Indicators[0]);
    setSelectedIndicatorTS((countryData.filter((d) => `${d.indicator}` === `${targetsUpdated[0].Indicators[0].Indicator.split(' ')[1]}`)));
  }, [selectedSDG, statusData]);
  const AllSeriesForIndicator = AllSeries.filter((d: any) => d.indicator.indexOf(`${selectedIndicator.Indicator}`.split(' ')[1]) !== -1 && selectedIndicatorTS.findIndex((el) => el.series === d.series) === -1).map((d) => ({
    ...d,
    values: [],
    statusCode: 6,
  }));
  console.log(AllSeriesForIndicator.map((d) => d.indicator[0]), selectedIndicator.Indicator.split(' ')[1]);
  return (
    <div className='flex-div margin-bottom-13'>
      <SideBarNavEl>
        {
          targets.map((d, i) => (
            <SideBarButtonEl
              type='button'
              key={i}
              selected={d.Target === selectedTarget.Target}
              onClick={() => { setSelectedTarget(d); setSelectedIndicator(d.Indicators[0]); setSelectedIndicatorTS((countryData.filter((el) => el.indicator === d.Indicators[0].Indicator.split(' ')[1]))); }}
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
            </SideBarButtonEl>
          ))
        }
      </SideBarNavEl>
      <div style={{ width: 'calc(100% - 14rem)', padding: '1rem 2rem' }}>
        <div className='flex-div flex-vert-align-center margin-bottom-05' style={{ gap: '0.5rem' }}>
          <h6 className='undp-typography margin-bottom-00'>
            {selectedTarget.Target}
          </h6>
          <div
            className={`undp-chip undp-chip-small ${statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target) === -1
              ? 'undp-chip-gray'
              : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status === 'On Track'
                ? 'undp-chip-green'
                : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status === 'For Review'
                  ? 'undp-chip-yellow'
                  : statusData.targetStatus[statusData.targetStatus.findIndex((el) => `Target ${el.target}` === selectedTarget.Target)].status === 'Identified Gap'
                    ? 'undp-chip-red'
                    : 'undp-chip-gray'}`}
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
                style={{ gap: '0.5rem' }}
                className={`undp-tab-radio flex-div flex-vert-align-center ${d.Indicator === selectedIndicator.Indicator ? 'selected' : ''}`}
                key={i}
                onClick={() => { setSelectedIndicator(d); setSelectedIndicatorTS((countryData.filter((el) => el.indicator === d.Indicator.split(' ')[1]))); }}
              >
                <ColorCircle
                  backgroundColor={statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === d.Indicator) === -1
                    ? 'var(--gray-300)'
                    : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === d.Indicator)].status === 'On Track'
                      ? 'var(--dark-green)'
                      : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === d.Indicator)].status === 'For Review'
                        ? 'var(--dark-yellow)'
                        : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === d.Indicator)].status === 'Identified Gap'
                          ? 'var(--dark-red)'
                          : 'var(--gray-300)'}
                />
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
                ? 'undp-chip-gray'
                : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status === 'On Track'
                  ? 'undp-chip-green'
                  : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status === 'For Review'
                    ? 'undp-chip-yellow'
                    : statusData.indicatorStatus[statusData.indicatorStatus.findIndex((el) => `Indicator ${el.indicator}` === selectedIndicator.Indicator)].status === 'Identified Gap'
                      ? 'undp-chip-red'
                      : 'undp-chip-gray'}`}
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
            sortBy(selectedIndicatorTS.concat(AllSeriesForIndicator), 'statusCode').map((d, i: number) => (
              <LineChart
                data={d}
                key={i}
                cursor={
                  selectedIndicatorTS.concat(AllSeriesForIndicator).length === 1
                    ? 'auto'
                    : i < selectedIndicatorTS.concat(AllSeriesForIndicator).length - 1
                      ? 'url(https://design.undp.org/static/media/arrow-right.125a0586.svg), auto'
                      : 'url(https://design.undp.org/static/media/arrow-left.14de54ea.svg), auto'
                  }
              />
            ))
          }
          {
            selectedIndicatorTS.concat(AllSeriesForIndicator).length === 0
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
