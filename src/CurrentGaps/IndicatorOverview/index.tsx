import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { json } from 'd3-request';
import { TargetList } from './TargetList';
import { SDGListType } from '../../Types';

const SDGGoalList:SDGListType[] = require('../../Data/SDGGoalList.json');

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
            <TargetList
              data={SDGGoalList}
              timeSeriesData={data}
              selectedSDG={selectedSDG}
            />
          )
          : <Spin size='large' />
      }
    </>
  );
};
