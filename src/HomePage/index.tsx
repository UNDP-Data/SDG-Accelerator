import { DefaultHomePage } from './DefaultHomePage';
import { COUNTRIES_WITH_DOCS } from '../Constants';
import { ReportView } from './ReportView';
import { GoalStatusType } from '../Types';

interface Props {
  countryCode?: string;
  countryFullName?: string;
  goalStatuses: GoalStatusType[];
}

export const HomePage = (props: Props) => {
  const {
    countryCode,
    countryFullName,
    goalStatuses,
  } = props;
  return (
    <>
      {
        countryCode
          ? COUNTRIES_WITH_DOCS.indexOf(countryCode) === -1
            ? <DefaultHomePage countryCode={countryCode} countryFullName={countryFullName} />
            : <ReportView countryCode={countryCode} goalStatuses={goalStatuses} />
          : <DefaultHomePage />
      }
    </>
  );
};
