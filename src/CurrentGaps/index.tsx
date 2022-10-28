import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Spin } from 'antd';
import { json } from 'd3-request';
import { queue } from 'd3-queue';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import uniqBy from 'lodash.uniqby';
import meanBy from 'lodash.meanby';
import { FileImageTwoTone } from '@ant-design/icons';
import domtoimage from 'dom-to-image';
import { PageTitle } from '../Components/PageTitle';
import { DonutChartCard } from './DonutChartCard';
import { SDGGapsList } from './SDGGapsList';
import { SDGStatusListType } from '../Types';
import { Nav } from '../Header/Nav';
import { Interlinkages } from './Interlinkages';
import { CaretDown, InfoIcon } from '../icons';
import { Tooltip } from '../Components/Tooltip';
import { IndicatorOverview } from './IndicatorOverview';
import { getSDGIcon } from '../utils/getSDGIcon';
import { SDGGOALS, DATASOURCELINK } from '../Constants';
import { Tag } from '../Components/Tag';
import { getYearsAndValues } from '../utils/getYearsAndValues';
import { getStatus } from '../utils/getStatus';
import CountryTaxonomy from '../Data/countryTaxonomy.json';

const SDGList:SDGStatusListType[] = require('../Data/SDGGoalList.json');

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 0 auto;
  justify-content: center;
`;

const RowEl = styled.div`
  margin-top: 2rem;
  display: flex;
  background-color: var(--black-200);
  align-items: stretch;
`;

const RowParentEl = styled.div`
  background-color: var(--black-200);
`;

const TitleEl = styled.div`
  margin: 4rem 0 0 0;
  display: flex;
  align-items: center;
`;

const IconEl = styled.div`
  margin-left: 1rem; 
`;

const IndicatorOverviewEl = styled.div`
  margin-top: 5rem;
`;

const H2 = styled.h2`
  margin-bottom: 2rem;
`;

const SummaryEl = styled.div`
  padding: 4.8rem;
  background-color: var(--black-200);
  font-size: 3rem;
  line-height: 4rem;
  margin-bottom: 2rem;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  margin: -2rem -2rem 2rem -2rem;
  padding: 2rem;
  background-color: var(--black-300);
  position: sticky;
  z-index: 100;
  top: 16.5rem;
`;

const DropdownEl = styled.div`
  margin-left: 2rem;
`;

interface ColorProps {
  fill: string;
}

const TargetBox = styled.div<ColorProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.8rem;
  height: 4.8rem;
  font-size: 1.6rem;
  font-weight: 500;
  margin-right: 1rem;
  text-align: center;
  background-color: ${(props) => props.fill};
`;

const TargetListEl = styled.div`
  display: flex;
`;

const ContainerEl = styled.div`
  background-color: var(--black-200);
  padding: 2rem 2rem 0 2rem;
`;

const DownLoadButton = styled.button`
  background-color: transparent;
  border: 0;
  color: var(--black-550);
  padding: 2rem;
  margin: 0 0 2rem 2rem;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  display: flex;
  right:0;
  align-items: center;
  &:hover{
    color: var(--primary-blue);
  }
  span {
    margin-left: 0.5rem;
  }
`;

export const CurrentGaps = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [statuses, setStatuses] = useState<any>(undefined);
  const [goalStatuses, setGoalStatuses] = useState<any>(undefined);
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  const [countryData, setCountryData] = useState<any>(undefined);

  const goalDetailDiv = useRef(null);
  const GraphRef = useRef(null);

  const countrySelected = useParams().country || 'ZAF';
  const countryFullName = CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['Country or Area'];

  useEffect(() => {
    setStatuses(undefined);
    queue()
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesData/${countrySelected}.json`)
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesToUse/${countrySelected}.json`)
      .await((err: any, d: any, timeSeriesToUse: any) => {
        if (err) throw err;
        const filteredTimeseriesData:any = [];
        d.forEach((el:any) => {
          if (timeSeriesToUse.findIndex((el1: any) => isEqual(el1, omit(el, ['values', 'targets', 'trendMethodology']))) !== -1 || el.series === '***') filteredTimeseriesData.push(el);
        });
        setCountryData(filteredTimeseriesData);
        const filteredTimeseriesDataWithStatus = filteredTimeseriesData.map((element: any) => {
          const values = uniqBy(element.values, 'year').filter((el: any) => el.value !== null);

          const targetValue = element.targets !== 0 || element.targets !== null ? element.targets : null;
          const trendMethodology = element.trendMethodology ? element.trendMethodology : 'CAGR';
          const yearsAndValues = getYearsAndValues(values as any);
          const status = element.indicator === '8.1.1'
            ? meanBy(element.values.filter((val: any) => val.year > 2014), 'value') > 2 ? 'On Track'
              : meanBy(element.values.filter((val: any) => val.year > 2014), 'value') > 1.5 ? 'Fair progress but acceleration needed'
                : meanBy(element.values.filter((val: any) => val.year > 2014), 'value') > 1 ? 'Limited or No Progress'
                  : 'Deterioration'
            : targetValue === null || trendMethodology === 'NA'
              ? undefined
              : yearsAndValues === null
                ? 'Insufficient Data'
                : getStatus(yearsAndValues, targetValue.targetValue, targetValue.type, trendMethodology);
          return { ...element, status };
        });
        const allIndicators = uniqBy(filteredTimeseriesDataWithStatus.filter((el: any) => el.status), 'indicator').map((el: any) => el.indicator);
        const indicatorsStatus = allIndicators.map((indicator: string) => {
          const filtered = filteredTimeseriesDataWithStatus.filter((el: any) => el.indicator === indicator && el.status && el.status !== 'Insufficient Data');
          if (filtered.length === 0) {
            return {
              indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: undefined,
            };
          }
          let total = 0;
          filtered.forEach((f: any) => {
            switch (f.status) {
              case 'Target Achieved':
                total += 1;
                break;
              case 'On Track':
                total += 1;
                break;
              case 'Fair progress but acceleration needed':
                total += 2;
                break;
              case 'Limited or No Progress':
                total += 3;
                break;
              case 'Deterioration':
                total += 4;
                break;
              default:
              // eslint-disable-next-line no-console
                console.log(f);
                break;
            }
          });
          if (total / filtered.length < 1.5) {
            return {
              indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: 'On Track',
            };
          }
          if (total / filtered.length > 2.499) {
            return {
              indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: 'Identified Gap',
            };
          }
          return {
            indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: 'For Review',
          };
        });
        const allTargets = uniqBy(indicatorsStatus.filter((el: any) => el.status), 'target').map((el: any) => el.target);
        const targetStatus = allTargets.map((target: string) => {
          const filtered = indicatorsStatus.filter((el: any) => el.target === target && el.status && el.status !== 'Insufficient Data');
          if (filtered.length === 0) {
            return {
              target, goal: target.split('.')[0], status: undefined,
            };
          }
          let total = 0;
          filtered.forEach((f: any) => {
            switch (f.status) {
              case 'On Track':
                total += 1;
                break;
              case 'Identified Gap':
                total += 3;
                break;
              case 'For Review':
                total += 2;
                break;
              default:
              // eslint-disable-next-line no-console
                console.log(f);
                break;
            }
          });
          if (Math.round(total / filtered.length) === 1) {
            return {
              target, goal: target.split('.')[0], status: 'On Track',
            };
          }
          if (Math.round(total / filtered.length) === 3) {
            return {
              target, goal: target.split('.')[0], status: 'Identified Gap',
            };
          }
          return {
            target, goal: target.split('.')[0], status: 'For Review',
          };
        });
        const allGoals = uniqBy(targetStatus.filter((el: any) => el.status), 'goal').map((el: any) => el.goal);
        const goalStatus = allGoals.map((goal: string) => {
          const filtered = targetStatus.filter((el: any) => el.goal === goal && el.status && el.status !== 'Insufficient Data');
          if (filtered.length === 0) {
            return {
              goal, status: undefined,
            };
          }
          let total = 0;
          filtered.forEach((f: any) => {
            switch (f.status) {
              case 'On Track':
                total += 1;
                break;
              case 'Identified Gap':
                total += 3;
                break;
              case 'For Review':
                total += 2;
                break;
              default:
              // eslint-disable-next-line no-console
                console.log(f);
                break;
            }
          });
          if (Math.round(total / filtered.length) === 1) {
            return {
              goal, status: 'On Track',
            };
          }
          if (Math.round(total / filtered.length) === 3) {
            return {
              goal, status: 'Identified Gap',
            };
          }
          return {
            goal, status: 'For Review',
          };
        });
        const gaps = SDGList.map((el) => {
          const targetGaps = el.Targets.map((target) => {
            const indicatorGaps = target.Indicators.map((indicator) => ({ ...indicator, status: indicatorsStatus.findIndex((status) => `Indicator ${status.indicator}` === indicator.Indicator) === -1 ? undefined : indicatorsStatus[indicatorsStatus.findIndex((status) => `Indicator ${status.indicator}` === indicator.Indicator)].status }));
            return ({
              Target: target.Target,
              'Target Description': target['Target Description'],
              status: targetStatus.findIndex((status) => `Target ${status.target}` === target.Target) === -1 ? undefined : targetStatus[targetStatus.findIndex((status) => `Target ${status.target}` === target.Target)].status,
              Indicators: indicatorGaps,
            });
          });
          return ({
            Goal: el.Goal,
            'Goal Name': el['Goal Name'],
            status: goalStatus.findIndex((status) => `SDG ${status.goal}` === el.Goal) === -1 ? undefined : goalStatus[goalStatus.findIndex((status) => `SDG ${status.goal}` === el.Goal)].status,
            Targets: targetGaps,
          });
        });
        setStatuses(gaps);
        setGoalStatuses(goalStatus);
      });
  }, [countrySelected]);
  return (
    <>
      <Nav
        pageURL='current-sdg-gaps'
      />
      <PageTitle
        title='Current Gaps'
        description='Visualization of SDG gaps nationally allows for easy identification of where SDG goals are being left behind. Using up to date data, explore SDG progress in your country and which targets are at risk of not being met by 2030. These insights will be the basis for evidence-based, holistic dialogue at the national level.'
      />
      {
        goalStatuses && statuses && countryData
          ? (
            <RootEl>
              <SummaryEl>
                For
                {' '}
                <span className='bold'>{countryFullName}</span>
                , out of 17 SDG goals,
                {' '}
                <span style={{ color: 'var(--accent-green)' }} className='bold'>
                  {goalStatuses.filter((d: any) => d.status === 'On Track').length}
                  {' '}
                  are On Track,
                </span>
                <span style={{ color: 'var(--accent-red)' }} className='bold'>
                  {' '}
                  {goalStatuses.filter((d: any) => d.status === 'Identified Gap').length}
                  {' '}
                  are Identified Gaps
                </span>
                {' '}
                and,
                <span style={{ color: 'var(--accent-yellow)' }} className='bold'>
                  {' '}
                  {goalStatuses.filter((d: any) => d.status === 'For Review').length}
                  {' '}
                  are For Review
                </span>
              </SummaryEl>
              <RowParentEl>
                <RowEl ref={GraphRef}>
                  <DonutChartCard
                    centralText='All SDG Status'
                    data={goalStatuses}
                  />
                  <SDGGapsList
                    data={goalStatuses}
                    setSelectedSDG={setSelectedSDG}
                    divRef={goalDetailDiv}
                  />
                </RowEl>
                <DownLoadButton
                  type='button'
                  onClick={() => {
                    if (GraphRef.current) {
                      const node = GraphRef.current;
                      domtoimage
                        .toPng(node as any, { height: (node as any).scrollHeight })
                        .then((dataUrl: any) => {
                          const link = document.createElement('a');
                          link.download = 'graph.png';
                          link.href = dataUrl;
                          link.click();
                        });
                    }
                  }}
                >
                  Download Image
                  <FileImageTwoTone style={{ fontSize: '18px' }} />
                </DownLoadButton>
              </RowParentEl>
              <>
                <TitleEl>
                  <h2>Target Overview</h2>
                  <div onMouseEnter={() => { setShowPopUp(true); }} onMouseLeave={() => { setShowPopUp(false); }}>
                    <IconEl>
                      <InfoIcon
                        size={18}
                      />
                    </IconEl>
                    {
                      showPopUp
                        ? (
                          <Tooltip
                            text='Identify which targets have the biggest effect on other SDG targets, and explore which targets to pursue which have the highest positive interlinkage (“synergy”) with other SDG targets. This is an exercise in understanding how we can speed development forward in a positive and sustainable manner based on the identified gaps and priorities.'
                          />
                        ) : null
                    }
                  </div>
                </TitleEl>
                <Interlinkages
                  data={statuses}
                />
              </>
              <IndicatorOverviewEl ref={goalDetailDiv}>
                <H2>SDG Overview</H2>
                <ContainerEl>
                  <FlexDiv>
                    {getSDGIcon(selectedSDG.split(':')[0], 80)}
                    <DropdownEl>
                      <Select
                        value={selectedSDG}
                        className='SDGSelector'
                        onChange={(d) => { setSelectedSDG(d); }}
                        suffixIcon={<div style={{ marginTop: '-0.2rem' }}><CaretDown size={24} /></div>}
                      >
                        {
                          SDGGOALS.map((d, i) => (
                            <Select.Option value={d} key={i}>
                              {d}
                            </Select.Option>
                          ))
                        }
                      </Select>
                      <Tag
                        backgroundColor={
                          statuses[statuses.findIndex((d: any) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].status === 'On Track'
                            ? 'var(--accent-green)'
                            : statuses[statuses.findIndex((d: any) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].status === 'Identified Gap'
                              ? 'var(--accent-red)'
                              : statuses[statuses.findIndex((d: any) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].status === 'For Review'
                                ? 'var(--accent-yellow)'
                                : 'var(--black-550)'
                        }
                        text={statuses[statuses.findIndex((d: any) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].status || 'Gap Unidentified'}
                        fontColor={statuses[statuses.findIndex((d: any) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].status === 'For Review' ? 'var(--black)' : 'var(--white)'}
                        margin='0.5rem 0 0 0'
                      />
                    </DropdownEl>
                  </FlexDiv>
                  <SummaryEl style={{ marginBottom: '4rem' }}>
                    <h3>Status of Targets</h3>
                    <TargetListEl>
                      {
                        statuses[statuses.findIndex((d: any) => `${d.Goal}: ${d['Goal Name']}` === selectedSDG)].Targets.map((d: any) => (
                          <TargetBox
                            fill={d.status === 'On Track' ? '#C5EFC4' : d.status === 'Identified Gap' ? '#FEC8C4' : d.status === 'For Review' ? '#FEE697' : '#AAA'}
                          >
                            {d.Target.split(' ')[1]}
                          </TargetBox>
                        ))
                      }
                    </TargetListEl>
                  </SummaryEl>
                  <IndicatorOverview
                    selectedSDG={selectedSDG}
                    data={statuses}
                    countryData={countryData}
                  />
                </ContainerEl>
              </IndicatorOverviewEl>
            </RootEl>
          )
          : (
            <RootEl>
              <Spin size='large' />
            </RootEl>
          )
      }
    </>
  );
};
