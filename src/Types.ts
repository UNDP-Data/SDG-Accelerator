export interface IndicatorStatusListType {
  Indicator: string;
  'Indicator Description': string;
  Status: 'On Track' | 'Identified Gap' | 'For Review';
}

export interface TargetStatusListType {
  Target: string;
  'Target Description': string;
  Status: 'On Track' | 'Identified Gap' | 'For Review';
  Indicators: IndicatorStatusListType[];
}

export interface SDGStatusListType {
  Goal: string;
  'Goal Name': string;
  Status: 'On Track' | 'Identified Gap' | 'For Review';
  Targets: TargetStatusListType[];
}

export interface IndicatorListType {
  Indicator: string;
  'Indicator Description': string;
}

export interface TargetListType {
  Target: string;
  'Target Description': string;
  Indicators: IndicatorListType[];
}

export interface SDGListType {
  Goal: string;
  'Goal Name': string;
  Targets: TargetListType[];
}

export interface CountryListType {
  'Alpha-3 code-1': string;
  'Country or Area': string;
  'Alpha-2 code': string;
  'Numeric code': string;
  'Group 1': string;
  'Group 2': string;
  'Group 3': string;
  'SDG Gap Data': SDGStatusListType[];
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
