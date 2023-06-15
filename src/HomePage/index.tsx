// import { useState } from 'react';
import { DefaultHomePage } from './DefaultHomePage';
/*
import { COUNTRIES_WITH_DOCS } from '../Constants';
import { ReportView } from './ReportView';
import { GoalStatusType, TargetStatusType } from '../Types';
*/

interface Props {
  countryCode?: string;
  countryFullName?: string;
  // goalStatuses: GoalStatusType[];
  // targetStatuses: TargetStatusType[];
}

export const HomePage = (props: Props) => {
  const {
    countryCode,
    countryFullName,
    // goalStatuses,
    // targetStatuses,
  } = props;
  // const [error, setError] = useState<string | undefined>(undefined);
  return (
    <>
      {
        countryCode
          ? <DefaultHomePage countryCode={countryCode} countryFullName={countryFullName} />
          : <DefaultHomePage />
      }
    </>
  );
};
