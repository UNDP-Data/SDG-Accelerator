import {
  NavLink,
  Route, Routes, useParams,
} from 'react-router-dom';
import uniqBy from 'lodash.uniqby';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import meanBy from 'lodash.meanby';
import { useEffect, useState } from 'react';
import { queue } from 'd3-queue';
import { json } from 'd3-request';
import { Select } from 'antd';
import sortBy from 'lodash.sortby';
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
  const [selectedCountry, setSelectedCountry] = useState('Afghanistan');
  const [error, setError] = useState <any>(null);
  const [statuses, setStatuses] = useState<any>(undefined);
  const [goalStatuses, setGoalStatuses] = useState<any>(undefined);
  const [countryData, setCountryData] = useState<any>(undefined);
  const countryFullName = CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countryCode) !== -1 ? CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countryCode)]['Country or Area'] : '';
  useEffect(() => {
    setStatuses(undefined);
    setError(undefined);
    queue()
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesData/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesToUse/${countryCode}.json`)
      .await((err: any, d: any, timeSeriesToUse: any) => {
        if (err) {
          setError(err);
          return;
        }
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
        error
          ? (
            <div className='max-width-1440 margin-top-13 margin-bottom-13' style={{ padding: 'var(--spacing-09)', backgroundColor: 'var(--gray-200)', borderTop: '1px solid var(--gray-400)' }}>
              <div>
                <p className='undp-typography'>
                  It seems like we don&apos;t have the data for the country you have selected or there is an error in the URL.
                  <br />
                  <br />
                  If we are missing data for your country/region, email us at
                  {' '}
                  <a href='mailto:data@undp.org' className='undp-style' target='_blank' rel='noreferrer'>data@undp.org</a>
                </p>
                <div className='flex-div margin-top-09'>
                  <Select
                    className='undp-select'
                    placeholder='Select Country'
                    showSearch
                    value={selectedCountry}
                    onChange={(value) => { setSelectedCountry(value); }}
                    style={{ flexGrow: 1 }}
                  >
                    {
                  sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                }
                  </Select>
                  <NavLink
                    to={`../../sdg-push-diagnostic/${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === selectedCountry)]['Alpha-3 code-1']}`}
                    style={{ color: 'var(--white)', textDecoration: 'none', flexShrink: 0 }}
                  >
                    <button type='button' className='undp-button button-primary button-arrow'>
                      Explore Country Data
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          )
          : statuses && countryData && goalStatuses
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
