export const getCAGR = (targetYear: number, baseLineYear: number, targetValue: number, baseLineValue: number) => {
  if (targetYear === baseLineYear) return null;
  const valueRatio = targetValue / baseLineValue;
  const power = 1 / (targetYear - baseLineYear);
  return ((valueRatio ** power) - 1);
};
