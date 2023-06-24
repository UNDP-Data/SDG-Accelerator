import { RadarAndDotPlot } from '../../GraphForReport/RadarAndDotPlot';
import FiscalData from '../../data/FiscalData.json';

interface Props {
  countryCode: string;
  width: number;
}
export const Graph = (props: Props) => {
  const {
    countryCode, width,
  } = props;
  const AverageFiscalData = [
    {
      iso: 'LIDC',
      'Resource revenue (% of revenue)': 12.5,
      'Revenue (% of GDP)': 14.9,
      'Government debt (% of GDP)': 48.3,
      'Natural resources rents (% of GDP)': 9.8,
      'Total external debt servicing (% of revenue)': 14.06,
      'Credit rating': 6.5,
      '10-year bond yield (%)': 15.7416,
      'DSA Rating': 2.5,
    },
    {
      iso: 'EMMIE',
      'Resource revenue (% of revenue)': 17.6,
      'Revenue (% of GDP)': 26,
      'Government debt (% of GDP)': 68.8,
      'Natural resources rents (% of GDP)': 7.6,
      'Total external debt servicing (% of revenue)': 12.26,
      'Credit rating': 9.44,
      '10-year bond yield (%)': 9.321433333,
      'DSA Rating': 2.7,
    },
    {
      iso: 'Advanced Economy',
      'Resource revenue (% of revenue)': 0.2,
      'Revenue (% of GDP)': 38.8,
      'Government debt (% of GDP)': 70.2,
      'Natural resources rents (% of GDP)': 1,
      'Total external debt servicing (% of revenue)': 5.38,
      'Credit rating': 17.9,
      '10-year bond yield (%)': 3.354942857,
      'DSA Rating': null,
    },
  ];
  return (
    <>
      <RadarAndDotPlot
        fiscalData={
          FiscalData[
            FiscalData.findIndex((d) => d.iso === countryCode)
          ]
        }
        averageData={
          AverageFiscalData[
            AverageFiscalData.findIndex(
              (d) => d.iso
                === FiscalData[
                  FiscalData.findIndex((el) => el.iso === countryCode)
                ]['IMF country grouping'],
            )
          ]
        }
        svgWidth={width}
        svgHeight={800}
      />
    </>
  );
};
