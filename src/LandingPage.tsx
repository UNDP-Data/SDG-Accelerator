import {
  Route, Routes, useParams,
} from 'react-router-dom';
import uniqBy from 'lodash.uniqby';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import meanBy from 'lodash.meanby';
import { useEffect, useState } from 'react';
import { queue } from 'd3-queue';
import { json } from 'd3-request';
import { Header } from './Header';
import { CurrentGaps } from './CurrentGaps';
import { HomePage } from './HomePage';
import { Priorities } from './Priorities';
import { FutureScenariosList } from './FutureScenarios';
import { Footer } from './Footer';
import { DATASOURCELINK } from './Constants';
import { getYearsAndValues } from './utils/getYearsAndValues';
import { getStatus } from './utils/getStatus';
import { SDGStatusListType } from './Types';
import CountryTaxonomy from './Data/countryTaxonomy.json';

import './style/heroSections.css';
import { Interlinkages } from './Interlinkages';

const SDGList:SDGStatusListType[] = require('./Data/SDGGoalList.json');

export const LandingPage = () => {
  const countryCode = useParams().country || 'ZAF';
  const countryFullName = CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countryCode)]['Country or Area'];
  const [statuses, setStatuses] = useState<any>(undefined);
  const [goalStatuses, setGoalStatuses] = useState<any>(undefined);
  const [countryData, setCountryData] = useState<any>(undefined);
  useEffect(() => {
    setStatuses(undefined);
    queue()
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesData/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesToUse/${countryCode}.json`)
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
              : element.values.filter((val: any) => val.year < 2015).length === 0 ? undefined
                : meanBy(element.values.filter((val: any) => val.year > 2014), 'value') < meanBy(element.values.filter((val: any) => val.year < 2015), 'value') ? 'Deterioration'
                  : meanBy(element.values.filter((val: any) => val.year > 2014), 'value') > 1.5 ? 'Fair progress but acceleration needed'
                    : 'Limited or No Progress'
            : targetValue === null || trendMethodology === 'NA'
              ? undefined
              : yearsAndValues === null
                ? 'Insufficient Data'
                : getStatus(yearsAndValues, targetValue.targetValue, targetValue.type, trendMethodology || 'CAGR');
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
        const allGoals = Array.from({ length: 17 }, (_, i) => i + 1);
        const goalStatus = allGoals.map((goal: number) => {
          const filtered = targetStatus.filter((el: any) => el.goal === `${goal}` && el.status && el.status !== 'Insufficient Data');
          const noOfTargets = SDGList[SDGList.findIndex((el) => el.Goal === `SDG ${goal}`)].Targets.length;
          let noOfIndicators = 0;
          SDGList[SDGList.findIndex((el) => el.Goal === `SDG ${goal}`)].Targets.forEach((el) => {
            noOfIndicators += el.Indicators.length;
          });
          if (filtered.length === 0) {
            return {
              goal,
              noOfTargets,
              noOfIndicators,
              noOfIndicatorWithDataAndMethodology: indicatorsStatus.filter((el: any) => el.goal === `${goal}`).length,
              status: undefined,
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
              goal,
              noOfTargets,
              noOfIndicators,
              noOfIndicatorWithDataAndMethodology: indicatorsStatus.filter((el: any) => el.goal === `${goal}`).length,
              status: 'On Track',
            };
          }
          if (Math.round(total / filtered.length) === 3) {
            return {
              goal,
              noOfTargets,
              noOfIndicators,
              noOfIndicatorWithDataAndMethodology: indicatorsStatus.filter((el: any) => el.goal === `${goal}`).length,
              status: 'Identified Gap',
            };
          }
          return {
            goal,
            noOfTargets,
            noOfIndicators,
            noOfIndicatorWithDataAndMethodology: indicatorsStatus.filter((el: any) => el.goal === `${goal}`).length,
            status: 'For Review',
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
  }, [countryCode]);
  return (
    <>
      <Header
        country={countryCode}
      />
      {
        statuses && countryData && goalStatuses
          ? (
            <Routes>
              <Route
                path='/'
                element={(
                  <HomePage
                    countryCode={countryCode}
                    countryFullName={countryFullName}
                  />
                )}
              />
              <Route
                path='/sdg-trends'
                element={(
                  <CurrentGaps
                    statuses={statuses}
                    countryData={countryData}
                    goalStatuses={goalStatuses}
                    countryFullName={countryFullName}
                  />
                )}
              />
              <Route
                path='/synergies-and-tradeoffs'
                element={(
                  <Interlinkages
                    data={statuses}
                    countryFullName={countryFullName}
                  />
                )}
              />
              <Route
                path='/current-priorities'
                element={(
                  <Priorities
                    countrySelected={countryCode}
                    goalStatuses={goalStatuses}
                    countryFullName={countryFullName}
                  />
                )}
              />
              <Route
                path='/future-scenarios'
                element={(
                  <FutureScenariosList
                    countryCode={countryCode}
                    countryFullName={countryFullName}
                  />
                )}
              />
            </Routes>
          ) : (
            <div style={{ margin: '10rem auto 3rem auto', minHeight: '30rem' }}>
              <div className='undp-loader' style={{ margin: 'auto' }} />
            </div>
          )
      }
      <Footer />
    </>
  );
};
