export interface IndicatorListType {
  Indicator: string;
  'Indicator Description': string;
}

export interface TargetListType {
  Target: string;
  'Target Description': string;
  Indicators: IndicatorListType[];
}

export interface SDGSListType {
  Goal: string;
  'Goal Name': string;
  Targets: TargetListType[];
}

export interface IndicatorYearDataSDGPush {
  year: number;
  withSDGPush: number;
  withoutSDGPush: number;
}

export interface IndicatorDataSDGPush {
  Indicator: string;
  yearlyData: IndicatorYearDataSDGPush[];
}

export interface CountryListType {
  'Alpha-3 code-1': string;
  'Country or Area': string;
  'Alpha-2 code': string;
  'Numeric code': string;
  'Group 1': string;
  'Group 2': string;
  'Group 3': string;
}
export interface CountryListTypeSDGPush {
  'Alpha-3 code-1': string;
  'Country or Area': string;
  'Alpha-2 code': string;
  'Numeric code': string;
  'Group 1': string;
  'Group 2': string;
  'Group 3': string;
  Data: IndicatorDataSDGPush[];
}

export interface DropdownOptionTypes {
  label: string;
}

export interface LinkageDataType {
  id: string;
  synergies: string[];
  tradeOffs: string[];
  notSpecified: string[];
  coordinates: [number, number];
}

export interface HoverDataType {
  xPosition: number;
  yPosition: number;
  withSDGPush?: number;
  withoutSDGPush?: number;
  year: number;
}

export interface ScatterHoverDataType {
  country: string;
  xPosition: number;
  yPosition: number;
  year: number;
  indicatorX: string;
  indicatorY: string;
  withoutSDGPush: {
    x: number;
    y: number;
  };
  withSDGPush: {
    x: number;
    y: number;
  };
}

export interface SelectOption {
  label: string;
}

export interface PrioritiesDataType {
  priorityType: string;
  priorities: string[];
}

export interface HoverBasic {
  country: string;
  xPosition: number;
  yPosition: number;
}

export interface ScenarioDataType {
  scenario: "'COVID Baseline' scenario" | "'SDG Push' scenario";
  indicator: string;
  data: {
      year: number;
      value: number;
    }[];
}

export interface LinkageHoverDataType {
  text: string;
  title: string;
  noOfSynergies: number;
  noOfTradeOff: number;
  xPosition: number;
  yPosition: number;
}

export interface LiteratureDataType {
  Publication: string;
  Author: string;
  Year: number;
  Goals: string;
  'Peer reviewed': boolean;
  'Full reference': string | null;
}

export type StatusType = 'On Track' | 'Identified Gap' | 'For Review';

export type PriorityType = 'High' | 'Medium' | 'Low';

export type InterlinkageType = 'synergies' | 'tradeOffs' | 'notSpecified';

export interface IndicatorStatusType {
  goal: string;
  target: string;
  indicator: string;
  status: StatusType | null;
}
export interface TargetStatusType {
  goal: string;
  target: string;
  status: StatusType | null;
}

export interface TargetStatusWithDetailsType extends TargetStatusType {
  description: string;
}

export interface GoalStatusType {
  goal: number;
  noOfIndicatorsWithData: number;
  status: StatusType | null;
}

export interface ValuesDataType {
  year: number;
  value: number;
  label?: string;
}

export interface TimeSeriesDataType {
  series: string;
  goal: string;
  target: string;
  indicator: string;
  seriesDescription: string;
  values: ValuesDataType[];
  methodology?: {
    targetValue?: number,
    normativeDirection?: 'increase' | 'decrease' | 'not increase' | 'not decrease',
    value?: number;
    CAGRLimit?: number[];
    trendMethodology: 'CAGRR' | 'CAGRA' | 'Binary' | 'Likert' | 'AARRR' | 'CAGRR+AARRR' | 'Doubling' | 'Halfing' | 'SpecialGINI',
    baselineYear: number,
    baseYear: null | number,
  };
  Age?: 'ALLAGE' | '<1Y' | '<5Y' | '15-49' | '<1M' | '30-70' | '15+' | '10-14' | '15-19' | '16-65' | '10+' | '15-24' | '18-29' | '20-24' | '18-24' | '25-44' | '45-59' | '60+' | '7-17';
  Location?: 'ALLAREA' | 'URBAN' | 'RURAL' ;
  Sex?: 'BOTHSEX' | 'FEMALE' | 'MALE';
  'Reporting Type'?: string;
  Quantile?: 'B50' | '_T';
  'Name of international institution'?: 'UNGA' | 'WTO' | 'IFC' | 'IMF' | 'ECOSOC' | 'IBRD' | 'UNSC' | 'AFDB' | 'FSB';
  'Type of product'?: 'CLO' | 'MEO' | 'NFO' | 'ARM' | 'AGR' | 'TEX' | 'ALP';
  'Food Waste Sector'?: 'HHS';
  Activity?: 'ISIC4_C' | 'TOTAL' | 'INDUSTRIES' | 'ISIC4_C10T32X19' | 'ISIC4_A';
  'Level of requirement'?: 'TOTAL';
  'Frequency of Chlorophyll-a concentration'?: 'High';
  'Mountain Elevation'?: '5';
  'Type of speed'?: 'ANYS';
  'Name of non-communicable disease'?: 'CAR';
  'Type of occupation'?: 'DENT' | '_T' | 'isco08-6' | 'isco08-3' | 'isco08-9' | 'isco08-8' | 'isco08-1' | 'isco08-4' | 'isco08-7' | 'isco08-5' | 'isco08-2' | 'isco08-0' | 'isco08-X';
  'IHR Capacity'?: 'IHR09';
  'Education level'?: 'LOWSEC' | 'UPPSEC' | 'SECOND' | 'GRAD23' | 'PRIMAR';
  'Type of skill'?: 'PCPR'| 'LITE'| 'SKILL_READ';
  'Level/Status'?: '_T';
  'Deviation Level'?: 'EXTREME' | 'MEDIUM';
  'Mode of transportation'?: 'AIR' | 'ROA' | 'SEA';
  'Type of renewable technology'?: 'SOLAR';
  'Fiscal intervention stage'?: 'POSTFIS_CON_INC';
  Counterpart?: 'ZM';
  Cities?: 'JOHANNESBURG';
  'Sampling Stations'?: 'ALGOA';
  status?: 'Target Achieved' | 'On Track' | 'Target Not Achieved' | 'Fair progress but acceleration needed' | 'Limited or No Progress' | 'Insufficient Data' | 'No Data After 2015' | 'Deterioration';
  'Custodian_Agency(ies)': string;
  'Partner_Agency(ies)': string;
  'Tier_Classification': string;
}

export interface TimeSeriesDataTypeWithStatusCode extends TimeSeriesDataType {
  statusCode: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CountryDataType {
  countryCode: string;
  goalStatus: GoalStatusType[];
  targetStatus: TargetStatusType[];
  indicatorStatus: IndicatorStatusType[];
  tsData: TimeSeriesDataType[];
}

export interface StatusesType {
  goalStatus: GoalStatusType[];
  targetStatus: TargetStatusType[];
  indicatorStatus: IndicatorStatusType[];
}

export interface CountryGoalStatusType {
  countryCode: string;
  goalStatus: {
    goal: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17';
    status: StatusType | null;
  }[];
}

export interface InterlinkagesForReportType {
  'Target': string;
  'Target Text': string;
  'LinkageType': [InterlinkageType, InterlinkageType];
  'Description': string;
}

export interface dataForReportType {
  SDGMomentGDP: string;
  SDGMomentPeoplePlanet: string;
  SDGMomentConclusion: string;
  SDGMomentSubtext?: string;
  Trends?: string;
  InterlinkageBulletPoints: string;
  Interlinkages: InterlinkagesForReportType[];
  Fiscal: string;
  SDGStimulus: string;
  SDGStimulusBulletPoints?: string;
}

export type LanguageList = 'en' | 'ru' | 'fr' | 'es';
