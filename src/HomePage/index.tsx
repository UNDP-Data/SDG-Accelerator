// import { useState } from 'react';
import { useEffect, useState } from 'react';
import { json } from 'd3-request';
import { queue } from 'd3-queue';
import { DefaultHomePage } from './DefaultHomePage';
import { DATASOURCELINK } from '../Constants';
import { ReportView } from './ReportView';
import { GoalStatusType, TargetStatusType, dataForReportType } from '../Types';

interface Props {
  countryCode?: string;
  countryFullName?: string;
  targetStatuses: TargetStatusType[];
  goalStatuses: GoalStatusType[];
}

export const HomePage = (props: Props) => {
  const {
    countryCode,
    countryFullName,
    targetStatuses,
    goalStatuses,
  } = props;
  const [reportData, setReportData] = useState<
    dataForReportType | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    setReportData(undefined);
    setError(undefined);
    queue()
      .defer(json, `${DATASOURCELINK}/data/ReportPages/${countryCode}.json`)
      .await(
        (
          err: any,
          data: dataForReportType,
        ) => {
          if (err) { setError('Error loading files'); }
          setReportData(data);
        },
      );
  }, [countryCode]);
  return (
    <>
      {
        countryCode && countryFullName
          ? reportData || error ? reportData ? <ReportView goalStatuses={goalStatuses} targetStatuses={targetStatuses} countryCode={countryCode} countryFullName={countryFullName} reportData={reportData} /> : <DefaultHomePage countryCode={countryCode} countryFullName={countryFullName} />
            : (
              <div style={{ margin: '10rem auto 3rem auto', minHeight: '30rem' }}>
                <div className='undp-loader' style={{ margin: 'auto' }} />
              </div>
            )
          : <DefaultHomePage />
      }
    </>
  );
};
