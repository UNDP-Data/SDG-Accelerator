import {
  NavLink,
  Route, Routes, useParams,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { json } from 'd3-request';
import { Select } from 'antd';
import sortBy from 'lodash.sortby';
import { Header } from './Header';
import { CurrentGaps } from './CurrentGaps';
import { Priorities } from './Priorities';
import { FutureScenariosList } from './FutureScenarios';
import { Footer } from './Footer';
import { DATASOURCELINK } from './Constants';
import CountryTaxonomy from './Data/countryTaxonomy.json';

import { Interlinkages } from './Interlinkages';
import { CountryDataType, StatusesType, TimeSeriesDataTypeWithStatusCode } from './Types';
import { DefaultHomePage } from './HomePage/DefaultHomePage';

export const LandingPage = () => {
  const countryCode = useParams().country || 'ZAF';
  const [selectedCountry, setSelectedCountry] = useState('Afghanistan');
  const [error, setError] = useState <any>(null);
  const [statuses, setStatuses] = useState<StatusesType | undefined>(undefined);
  const [countryData, setCountryData] = useState<TimeSeriesDataTypeWithStatusCode[] | undefined>(undefined);
  const countryFullName = CountryTaxonomy.findIndex((d) => (d['Alpha-3 code-1'] === countryCode.replaceAll('WithCountryGovInput', ''))) !== -1 ? CountryTaxonomy[CountryTaxonomy.findIndex((d) => (d['Alpha-3 code-1'] === countryCode.replaceAll('WithCountryGovInput', '')))]['Country or Area'] : '';
  useEffect(() => {
    setStatuses(undefined);
    setError(undefined);
    json(`${DATASOURCELINK}/data/CountryData/${countryCode}.json`, (err: any, d: CountryDataType) => {
      if (err) { setError(err); }
      setCountryData(d.tsData.map((el) => (
        {
          ...el,
          statusCode: el.status === 'On Track' || el.status === 'Target Achieved'
            ? 4
            : el.status === 'Fair progress but acceleration needed' || el.status === 'Target Not Achieved'
              ? 3
              : el.status === 'Limited or No Progress'
                ? 2
                : el.status === 'Deterioration'
                  ? 1
                  : 5,
        }
      )));
      const SDGs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
      const goalStatus = SDGs.map((sdg) => (d.goalStatus.findIndex((g) => g.goal === sdg) !== -1 ? d.goalStatus[d.goalStatus.findIndex((g) => g.goal === sdg)]
        : {
          goal: sdg,
          noOfIndicatorsWithData: 0,
          status: null,
        }));
      setStatuses({
        goalStatus,
        targetStatus: d.targetStatus,
        indicatorStatus: d.indicatorStatus,
      });
    });
  }, [countryCode]);
  return (
    <>
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
                    to={`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === selectedCountry)]['Alpha-3 code-1'] === 'IDN' ? 'IDNWithCountryGovInput' : CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === selectedCountry)]['Alpha-3 code-1']}`}
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
          : statuses && countryData
            ? (
              <>
                <Header
                  country={countryCode}
                />
                <Routes>
                  <Route
                    path='/'
                    element={(
                      <DefaultHomePage
                        countryCode={countryCode}
                        countryFullName={CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countryCode.replaceAll('WithCountryGovInput', ''))]['Country or Area']}
                      />
                    )}
                  />
                  <Route
                    path='/sdg-trends'
                    element={(
                      <CurrentGaps
                        statuses={statuses}
                        countryData={countryData}
                        goalStatuses={statuses.goalStatus}
                        countryFullName={countryFullName}
                        countryCode={countryCode}
                        targetStatuses={statuses.targetStatus}
                        trendsByGoals={countryCode === 'VNMWithCountryGovInput'}
                      />
                    )}
                  />
                  <Route
                    path='/synergies-and-tradeoffs'
                    element={(
                      <Interlinkages
                        targetStatuses={statuses.targetStatus}
                        countryFullName={countryFullName}
                      />
                    )}
                  />
                  <Route
                    path='/current-priorities'
                    element={(
                      <Priorities
                        countrySelected={countryCode.replaceAll('WithCountryGovInput', '')}
                        goalStatuses={statuses.goalStatus}
                        countryFullName={countryFullName}
                      />
                    )}
                  />
                  <Route
                    path='/future-scenarios'
                    element={(
                      <FutureScenariosList
                        countryCode={countryCode.replaceAll('WithCountryGovInput', '')}
                        countryFullName={countryFullName}
                      />
                    )}
                  />
                </Routes>
              </>
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
