import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import { json } from 'd3-request';
import { IndicatorStatusCard } from './IndicatorStatusCard';
import { CountryListType } from '../../Types';
import { SDGGOALS } from '../../Constants';

const CountrySDGGap:CountryListType[] = require('../../Data/countrySDGGapData.json');

export const IndicatorOverview = () => {
  const [selectedSDG, setSelectedSDG] = useState('SDG 1: No Poverty');
  const params = useParams();
  const countrySelected = params.country;
  const [data, setData] = useState<any>(undefined);
  useEffect(() => {
    json(`../../data/${countrySelected}.json`, (err: any, d: any[]) => {
      if (err) throw err;
      setData(d);
    });
  }, []);
  return (
    <>
      <Tabs type='card' size='small' onChange={(key) => { setSelectedSDG(key); }}>
        {
          SDGGOALS.map((d) => (
            <Tabs.TabPane tab={d} key={d}>
              {
                data
                  ? (
                    <IndicatorStatusCard
                      data={CountrySDGGap[CountrySDGGap.findIndex((el) => el['Alpha-3 code-1'] === countrySelected)]['SDG Gap Data']}
                      timeSeriesData={data}
                      selectedSDG={selectedSDG}
                    />
                  )
                  : <Spin size='large' />
              }
            </Tabs.TabPane>
          ))
        }
      </Tabs>
    </>
  );
};
