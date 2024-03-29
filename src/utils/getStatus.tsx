import { getCAGR } from './getCAGR';
import { getAARR } from './getAARR';

interface yearAndValueDataType {
  baseYear: number;
  baseValue: number;
  finalYear: number;
  finalValue: number;
}

export const getStatus = (yearsAndValues: yearAndValueDataType, targetValue: number, type: string, trendMethodology: string) => {
  if (trendMethodology === 'CAGR' || !trendMethodology) {
    if (type === 'min') if (yearsAndValues.finalValue < targetValue) return 'Target Achieved';
    if (type === 'max') if (yearsAndValues.finalValue > targetValue) return 'Target Achieved';
    const CARGA = getCAGR(yearsAndValues.finalYear, yearsAndValues.baseYear, yearsAndValues.finalValue, yearsAndValues.baseValue);
    const CARGT = getCAGR(2030, yearsAndValues.baseYear, targetValue, yearsAndValues.baseValue);
    if (CARGA === null || CARGT === null) return 'Insufficient Data';
    const CR = CARGA / CARGT;
    if (Number.isNaN(CR)) return 'Insufficient Data';
    if (CR >= 0.95) return 'On Track';
    if (CR >= 0.5 && CR < 0.95) return 'Fair progress but acceleration needed';
    if (CR >= -0.1 && CR < 0.5) return 'Limited or No Progress';
    return 'Deterioration';
  }
  if (type === 'min') if (yearsAndValues.finalValue < targetValue) return 'Target Achieved';
  if (type === 'max') if (yearsAndValues.finalValue > targetValue) return 'Target Achieved';
  const AARRObserved = getAARR(yearsAndValues.finalYear, yearsAndValues.baseYear, yearsAndValues.finalValue, yearsAndValues.baseValue);
  const AARRRequire = getAARR(2030, yearsAndValues.baseYear, targetValue, yearsAndValues.baseValue);
  if (AARRObserved === null || AARRRequire === null) return 'Insufficient Data';
  if (AARRObserved >= AARRRequire) return 'On Track';
  if (AARRObserved >= 0.5) return 'Fair progress but acceleration needed';
  if (AARRObserved > -0.5 && AARRObserved < 0.5) return 'Limited or No Progress';
  return 'Deterioration';
};
