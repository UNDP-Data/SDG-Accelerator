import { Spin } from 'antd';
import { TargetList } from './TargetList';

interface Props {
  selectedSDG : string;
  data: any;
  countryData: any
}

export const IndicatorOverview = (props: Props) => {
  const { selectedSDG, data, countryData } = props;
  return (
    <>
      {
        data
          ? (
            <TargetList
              data={data}
              timeSeriesData={countryData}
              selectedSDG={selectedSDG}
            />
          )
          : <Spin size='large' />
      }
    </>
  );
};
