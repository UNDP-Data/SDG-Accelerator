import { useState } from 'react';
import { DefaultHomePage } from './DefaultHomePage';
import { COUNTRIES_WITH_DOCS } from '../Constants';
import { ReportView } from './ReportView';
import { GoalStatusType, TargetStatusType } from '../Types';

interface Props {
  countryCode?: string;
  countryFullName?: string;
  goalStatuses: GoalStatusType[];
  targetStatuses: TargetStatusType[];
}

export const HomePage = (props: Props) => {
  const {
    countryCode,
    countryFullName,
    goalStatuses,
    targetStatuses,
  } = props;
  const [error, setError] = useState<string | undefined>(undefined);
  return (
    <>
      {
        countryCode
          ? COUNTRIES_WITH_DOCS.indexOf(countryCode) === -1 || error
            ? <DefaultHomePage countryCode={countryCode} countryFullName={countryFullName} />
            : (
              <ReportView
                countryCode={countryCode}
                goalStatuses={goalStatuses}
                targetStatuses={targetStatuses}
                setError={setError}
              />
            )
          : <DefaultHomePage />
      }
    </>
  );
};
