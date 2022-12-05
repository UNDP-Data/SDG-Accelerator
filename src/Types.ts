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
      'year': number;
      'value': number;
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

export interface IndicatorStatusType {
  goal: string;
  target: string;
  indicator: string;
  status: 'On Track' | 'Identified Gap' | 'For Review' | null;
}
export interface TargetStatusType {
  goal: string;
  target: string;
  status: 'On Track' | 'Identified Gap' | 'For Review' | null;
}

export interface TargetStatusWithDetailsType extends TargetStatusType {
  description: string;
}

export interface GoalStatusType {
  goal: number;
  noOfIndicatorsWithData: number;
  status: 'On Track' | 'Identified Gap' | 'For Review' | null;
}

export interface CountryDataType {
  countryCode: string;
  goalStatus: GoalStatusType[];
  targetStatus: TargetStatusType[];
  indicatorStatus: IndicatorStatusType[];
  tsData: any;
}

export interface StatusesType {
  goalStatus: GoalStatusType[];
  targetStatus: TargetStatusType[];
  indicatorStatus: IndicatorStatusType[];
}
