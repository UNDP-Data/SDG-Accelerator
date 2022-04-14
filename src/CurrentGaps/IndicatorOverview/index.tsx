import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { json } from 'd3-request';
import { IndicatorStatusCard } from './IndicatorStatusCard';
import { CountryListType } from '../../Types';

const CountrySDGGap:CountryListType[] = require('../../Data/countrySDGGapData.json');

interface Props {
  selectedSDG : string;
}

export const IndicatorOverview = (props: Props) => {
  const { selectedSDG } = props;
  const params = useParams();
  const countrySelected = params.country;
  const [data, setData] = useState<any>(undefined);
  useEffect(() => {
    json(`../../data/${countrySelected}.json`, (err: any, d: any[]) => {
      if (err) throw err;
      setData(d);
    });
  }, [countrySelected]);
  return (
    <>
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
    </>
  );
};
