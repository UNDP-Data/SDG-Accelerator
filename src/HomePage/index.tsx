import { DefaultHomePage } from './DefaultHomePage';
import { COUNTRIES_WITH_DOCS } from '../Constants';
import { ReportView } from './ReportView';

interface Props {
  countryCode?: string;
  countryFullName?: string;
}

export const HomePage = (props: Props) => {
  const {
    countryCode,
    countryFullName,
  } = props;
  return (
    <>
      {
        countryCode
          ? COUNTRIES_WITH_DOCS.indexOf(countryCode) === -1
            ? <DefaultHomePage countryCode={countryCode} countryFullName={countryFullName} />
            : <ReportView countryCode={countryCode} />
          : <DefaultHomePage />
      }
    </>
  );
};
