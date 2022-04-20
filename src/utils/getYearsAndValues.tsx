import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';

interface dataType {
  value: number;
  year: number;
}

export const getYearsAndValues = (data:dataType[]) => {
  if (data.length === 0) return null;
  const finalYearObj = maxBy(data, 'year');
  const baseYear = data.findIndex((d) => d.year === 2015) !== -1
    ? 2015
    : data.findIndex((d) => d.year === 2010) !== -1
      ? 2010
      : data.filter((d) => d.year < 2015 && d.year > 2010).length > 0
        ? maxBy(data.filter((d) => d.year < 2015 && d.year > 2010), 'year')?.year as number
        : minBy(data, 'year')?.year as number;
  const baseValue = data[data.findIndex((d) => d.year === baseYear)].value as number;
  return ({
    baseYear,
    baseValue,
    finalYear: finalYearObj?.year as number,
    finalValue: finalYearObj?.value as number,
  });
};
