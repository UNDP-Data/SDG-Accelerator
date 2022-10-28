export const getAARR = (targetYear: number, baseLineYear: number, targetValue: number, baseLineValue: number) => {
  if (targetYear === baseLineYear) return null;
  const valueRatio = targetValue / baseLineValue;
  const t = targetYear - baseLineYear;
  return (Math.log(valueRatio) / t);
};
