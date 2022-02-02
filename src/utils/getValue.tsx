import { CountryListTypeSDGPush } from '../Types';

export const getValue = (iso3: string, year: number, indicator: string, data: CountryListTypeSDGPush[]) => {
  const countryIndex = data.findIndex((d) => d['Alpha-3 code-1'] === iso3);
  if (countryIndex === -1) return undefined;
  const indicatorIndex = data[countryIndex].Data.findIndex((d) => d.Indicator === indicator);
  const yearIndex = data[countryIndex].Data[indicatorIndex].yearlyData.findIndex((d) => d.year === year);
  return data[countryIndex].Data[indicatorIndex].yearlyData[yearIndex];
};
