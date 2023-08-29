import { useEffect, useState } from 'react';
import { json } from 'd3-request';
import { queue } from 'd3-queue';
import { DefaultHomePage } from './DefaultHomePage';
import { DATASOURCELINK } from '../Constants';
import {
  DataForReportType, CountryDataType, StatusesType,
} from '../Types';
import { DetailedReportView } from './DetailedReportView';
import CountryTaxonomy from '../Data/countryTaxonomy.json';

interface Props {
  countryCode: string;
}

export const HomePage = (props: Props) => {
  const {
    countryCode,
  } = props;
  const [reportData, setReportData] = useState<
    DataForReportType | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [statuses, setStatuses] = useState<StatusesType | undefined>(undefined);
  useEffect(() => {
    setReportData(undefined);
    setError(undefined);
    queue()
      .defer(json, `${DATASOURCELINK}/data/ReportPages/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/data/CountryData/${countryCode}.json`)
      .await(
        (
          err: any,
          data: DataForReportType,
          countryData: CountryDataType,
        ) => {
          if (err) { setError('Error loading files'); }
          const SDGs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
          const goalStatus = SDGs.map((sdg) => (countryData.goalStatus.findIndex((g) => g.goal === sdg) !== -1 ? countryData.goalStatus[countryData.goalStatus.findIndex((g) => g.goal === sdg)]
            : {
              goal: sdg,
              noOfIndicatorsWithData: 0,
              status: null,
            }));
          setStatuses({
            goalStatus,
            targetStatus: countryData.targetStatus,
            indicatorStatus: countryData.indicatorStatus,
          });
          setReportData(data);
        },
      );
  }, [countryCode]);
  return (
    <>
      { (reportData && statuses) || error ? reportData && statuses
        ? (
          <DetailedReportView
            targetStatuses={statuses.targetStatus}
            goalStatuses={statuses.goalStatus}
            countryCode={countryCode}
            countryFullName={CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countryCode.replaceAll('WithCountryGovInput', ''))]['Country or Area']}
            reportData={reportData.detailedReport}
          />
        )
        : (
          <DefaultHomePage
            countryCode={countryCode}
            countryFullName={CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countryCode.replaceAll('WithCountryGovInput', ''))]['Country or Area']}
          />
        )
        : (
          <div style={{ margin: '10rem auto 3rem auto', minHeight: '30rem' }}>
            <div className='undp-loader' style={{ margin: 'auto' }} />
          </div>
        )}
    </>
  );
};
