import { useParams } from 'react-router-dom';
import { HomePage } from './HomePage';

export const InsightReportLandingPage = () => {
  const countryCode = useParams().country || 'ZAF';
  return <HomePage countryCode={countryCode} />;
};
