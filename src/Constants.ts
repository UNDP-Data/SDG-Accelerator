export const HEADERCARDOPTION = [
  {
    title: 'Current Gaps',
    body: 'Explore SDG progress in your country which which targets are at risk of not being met by 2030',
    link: '/current-sdg-gap',
  },
  {
    title: 'Current Priorities',
    body: 'Scan reports and policy documents to identify national priority areas',
    link: '/acceleration-Opportunities',
  },
  {
    title: 'SDG Push',
    body: 'Assess multidimensional effects of COVID-19 and policy decisions using scenario modeling',
    link: '/future-scenarios',
  },
];

export const FUTURESCENARIOINDICATORS = [
  {
    Goal: 'SDG 1',
    Indicator: 'Poverty < $1.90 per day (number of people)',
    RelatedIndicator: 'Poverty < $1.90 per day (percentage of population)',
    ID: 'indicator_1_1',
  },
  {
    Goal: 'SDG 1',
    Indicator: 'Poverty < $1.90 per day (percentage of population)',
    RelatedIndicator: 'Poverty < $1.90 per day (number of people)',
    ID: 'indicator_1_2',
  },
  {
    Goal: 'SDG 1',
    Indicator: 'Female poverty head count (number of people)',
    RelatedIndicator:
      'Sex difference poverty headcount, age 25-34 (females minus males, number of people)',
    ID: 'indicator_1_3',
  },
  {
    Goal: 'SDG 1',
    Indicator:
      'Sex difference poverty headcount, age 25-34 (females minus males, number of people)',
    RelatedIndicator: 'Female poverty head count (number of people)',
    ID: 'indicator_1_4',
  },
  {
    Goal: 'SDG 2',
    Indicator: 'Malnourished children under 5 (number of children)',
    RelatedIndicator: 'Malnourished children under 5 (percentage of children)',
    ID: 'indicator_2_1',
  },
  {
    Goal: 'SDG 2',
    Indicator: 'Malnourished children under 5 (percentage of children)',
    RelatedIndicator: 'Malnourished children under 5 (number of children)',
    ID: 'indicator_2_2',
  },
  {
    Goal: 'SDG 2',
    Indicator: 'Malnourished population (number of people)',
    RelatedIndicator: 'Malnourished population (percentage of population)',
    ID: 'indicator_2_3',
  },
  {
    Goal: 'SDG 2',
    Indicator: 'Malnourished population (percentage of population)',
    RelatedIndicator: 'Malnourished population (number of people)',
    ID: 'indicator_2_4',
  },
  {
    Goal: 'SDG 2',
    Indicator: 'Stunted children under 5 (percentage)',
    RelatedIndicator: 'Children under 5 mortality rate per 1000 live births',
    ID: 'indicator_2_5',
  },
  {
    Goal: 'SDG 3',
    Indicator: 'Children under 5 mortality rate per 1000 live births',
    RelatedIndicator: 'Stunted children under 5 (percentage)',
    ID: 'indicator_3_1',
  },
  {
    Goal: 'SDG 3',
    Indicator: 'Maternal mortality (ratio)',
    RelatedIndicator: 'Neonatal mortality rate per 1000 live births',
    ID: 'indicator_3_2',
  },
  {
    Goal: 'SDG 3',
    Indicator: 'Neonatal mortality rate per 1000 live births',
    RelatedIndicator: 'Maternal mortality (ratio)',
    ID: 'indicator_3_3',
  },
  {
    Goal: 'SDG 4',
    Indicator: 'Primary education gross completion rate (percentage)',
    RelatedIndicator: 'Secondary education gross completion rate (percentage)',
    ID: 'indicator_4_1',
  },
  {
    Goal: 'SDG 4',
    Indicator: 'Secondary education gross completion rate (percentage)',
    RelatedIndicator: 'Primary education gross completion rate (percentage)',
    ID: 'indicator_4_2',
  },
  {
    Goal: 'SDG 6',
    Indicator: 'Improved sanitaion access (percentage)',
    RelatedIndicator: 'Improved water access (percentage)',
    ID: 'indicator_6_1',
  },
  {
    Goal: 'SDG 6',
    Indicator: 'Improved water access (percentage)',
    RelatedIndicator: 'Improved sanitaion access (percentage)',
    ID: 'indicator_6_2',
  },
];

export const COLORSCALE = [
  '#ffeda0',
  '#feb24c',
  '#fc4e2a',
  '#bd0026',
  '#800026',
];

export const SDGGOALS = [
  'SDG 1: No Poverty',
  'SDG 2: Zero Hunger',
  'SDG 3: Good Health And Well-Being',
  'SDG 4: Quality Education',
  'SDG 5: Gender Equality',
  'SDG 6: Clean Water And Sanitation',
  'SDG 7: Affordable And Clean Energy',
  'SDG 8: Decent Work And Economic Growth',
  'SDG 9: Industry, Innovation And Infrastructure',
  'SDG 10: Reduced Inequalities',
  'SDG 11: Sustainable Cities And Communities',
  'SDG 12: Responsible Consumption And Production',
  'SDG 13: Climate Action',
  'SDG 14: Life Below Water',
  'SDG 15: Life On Land',
  'SDG 16: Peace, Justice And Strong Institution',
  'SDG 17: Partnership For The Goals',
];

export const SDGGOALSFORFUTURESCENARIO = [
  'SDG 1: No Poverty',
  'SDG 2: Zero Hunger',
  'SDG 3: Good Health and Well-being',
  'SDG 4: Quality Education',
  'SDG 6: Clean Water and Sanitation',
];

export const KEYSTOAVOID = [
  'Reporting Type',
  'series',
  'goal',
  'target',
  'indicator',
  'seriesDescription',
  'values',
  'methodology',
  'status',
  'statusCode',
  'UNStats Methodology',
];

export const SERIES_TAGS_LABELS = [
  {
    key: 'ALLAGE',
    label: 'All ages',
  },
  {
    key: '<1Y',
    label: '< 1 Yr',
  },
  {
    key: '<5Y',
    label: '< 5 Yrs',
  },
  {
    key: '15-49',
    label: '15-49',
  },
  {
    key: '<1M',
    label: '< 1 Month',
  },
  {
    key: '30-70',
    label: '30-70',
  },
  {
    key: '15+',
    label: '15+',
  },
  {
    key: '10-14',
    label: '10-14',
  },
  {
    key: '15-19',
    label: '15-19',
  },
  {
    key: '16-65',
    label: '16-65',
  },
  {
    key: '10+',
    label: '10+',
  },
  {
    key: '15-24',
    label: '15-24',
  },
  {
    key: '18-29',
    label: '18-29',
  },
  {
    key: '20-24',
    label: '20-24',
  },
  {
    key: '18-24',
    label: '18-24',
  },
  {
    key: '25-44',
    label: '25-44',
  },
  {
    key: '45-59',
    label: '45-59',
  },
  {
    key: '60+',
    label: '60+',
  },
  {
    key: '7-17',
    label: '7-17',
  },
  {
    key: 'ALLAREA',
    label: 'All Areas',
  },
  {
    key: 'URBAN',
    label: 'Urban',
  },
  {
    key: 'RURAL',
    label: 'Rural',
  },
  {
    key: 'BOTHSEX',
    label: 'Both sexes',
  },
  {
    key: 'FEMALE',
    label: 'Female',
  },
  {
    key: 'MALE',
    label: 'Male',
  },
  {
    key: 'LOWSEC',
    label: 'Low. Sec.',
  },
  {
    key: 'UPPSEC',
    label: 'Upp. Sec.',
  },
  {
    key: 'SECOND',
    label: 'Secondary',
  },
  {
    key: 'GRAD23',
    label: 'Graduate',
  },
  {
    key: 'PRIMAR',
    label: 'Primary',
  },
  {
    key: 'EXTREME',
    label: 'Extreme',
  },
  {
    key: 'MEDIUM',
    label: 'Medium',
  },
  {
    key: 'AIR',
    label: 'Air',
  },
  {
    key: 'ROA',
    label: 'Road',
  },
  {
    key: 'SEA',
    label: 'Sea',
  },
  {
    key: 'SOLAR',
    label: 'Solar',
  },
  {
    key: 'JOHANNESBURG',
    label: 'Johannesburg',
  },
  {
    key: '_T',
    label: 'Total',
  },
  {
    key: 'Custodian_Agency(ies)',
    label: 'Custodian Agency(ies)',
  },
  {
    key: 'Partner_Agency(ies)',
    label: 'Partner Agency(ies)',
  },
  {
    key: 'Tier_Classification',
    label: 'Tier Classification',
  },
  {
    key: 'currentLevelAssessment',
    label: 'Current Level Assessment',
  },
];

export const SCENARIOINDICATORBASEDONSDG = [
  {
    SDG: 'SDG 1: No Poverty',
    indicators: [
      'Poverty <$1.90 per day (number of people)',
      'Poverty <$1.90 per day (percent of population)',
      'Female poverty headcount (number of people)',
    ],
  },
  {
    SDG: 'SDG 2: Zero Hunger',
    indicators: [
      'Malnourished children under 5 (number of children)',
      'Malnourished children under 5 (percent)',
      'Malnourished population (number of people)',
      'Malnourished population (percent)',
      'Stunted children under 5 (rate)',
    ],
  },
  {
    SDG: 'SDG 3: Good Health and Well-being',
    indicators: [
      'Children under 5 mortality (rate per 1000 live births)',
      'Maternal mortality (ratio)',
      'Neonatal mortality rate (number of neonatal deaths per 1000 live births)',
    ],
  },
  {
    SDG: 'SDG 4: Quality Education',
    indicators: [
      'Primary education gross completion rate (percent)',
      'Secondary education gross completion rate (percent)',
    ],
  },
  {
    SDG: 'SDG 6: Clean Water and Sanitation',
    indicators: [
      'Improved sanitation access (percent)',
      'Improved water access (percent)',
    ],
  },
];

export const SDG_COLOR_ARRAY = [
  '#e5243b',
  '#DDA63A',
  '#4C9F38',
  '#C5192D',
  '#FF3A21',
  '#26BDE2',
  '#FCC30B',
  '#A21942',
  '#FD6925',
  '#DD1367',
  '#FD9D24',
  '#BF8B2E',
  '#3F7E44',
  '#0A97D9',
  '#56C02B',
  '#00689D',
  '#19486A',
];

export const DATASOURCELINK = 'https://raw.githubusercontent.com/UNDP-Data/SDG-Accelerator-Data-Repo/main';
// export const DATASOURCELINK = '../..';

export const SDG_ICON_SIZE = 64;

export const TargetIndicatorCount = [
  {
    sdg: 1,
    noOfTargets: 7,
    noOfIndicators: 13,
  },
  {
    sdg: 2,
    noOfTargets: 8,
    noOfIndicators: 14,
  },
  {
    sdg: 3,
    noOfTargets: 13,
    noOfIndicators: 28,
  },
  {
    sdg: 4,
    noOfTargets: 10,
    noOfIndicators: 12,
  },
  {
    sdg: 5,
    noOfTargets: 9,
    noOfIndicators: 14,
  },
  {
    sdg: 6,
    noOfTargets: 8,
    noOfIndicators: 11,
  },
  {
    sdg: 7,
    noOfTargets: 5,
    noOfIndicators: 6,
  },
  {
    sdg: 8,
    noOfTargets: 12,
    noOfIndicators: 16,
  },
  {
    sdg: 9,
    noOfTargets: 8,
    noOfIndicators: 12,
  },
  {
    sdg: 10,
    noOfTargets: 10,
    noOfIndicators: 14,
  },
  {
    sdg: 11,
    noOfTargets: 10,
    noOfIndicators: 15,
  },
  {
    sdg: 12,
    noOfTargets: 11,
    noOfIndicators: 13,
  },
  {
    sdg: 13,
    noOfTargets: 5,
    noOfIndicators: 8,
  },
  {
    sdg: 14,
    noOfTargets: 10,
    noOfIndicators: 10,
  },
  {
    sdg: 15,
    noOfTargets: 12,
    noOfIndicators: 14,
  },
  {
    sdg: 16,
    noOfTargets: 12,
    noOfIndicators: 24,
  },
  {
    sdg: 17,
    noOfTargets: 19,
    noOfIndicators: 24,
  },
];

export const FIVE_P = [
  {
    pValue: 'People',
    totalNoOfTargets: 47,
    position: [300, 270],
    goals: ['1', '2', '3', '4', '5'],
  },
  {
    pValue: 'Planet',
    totalNoOfTargets: 46,
    position: [260, 405],
    goals: ['6', '12', '13', '14', '15'],
  },
  {
    pValue: 'Prosperity',
    totalNoOfTargets: 45,
    position: [300, 535],
    goals: ['7', '8', '9', '10', '11'],
  },
  {
    pValue: 'Peace',
    totalNoOfTargets: 12,
    position: [350, 375],
    goals: ['16'],
  },
  {
    pValue: 'Partnership',
    totalNoOfTargets: 19,
    position: [355, 445],
    goals: ['17'],
  },
];

export const REGION_FULL_NAME = [
  {
    id: 'Global',
    region: 'Global',
  },
  {
    id: 'RBA*',
    region: 'Africa',
  },
  {
    id: 'RBEC*',
    region: 'Europe and Central Asia',
  },
  {
    id: 'RBLAC*',
    region: 'Latin America and the Caribbean',
  },
  {
    id: 'RBAS*',
    region: 'Arab States',
  },
  {
    id: 'RBAP*',
    region: 'Asia and the Pacific',
  },
  {
    id: 'HIC',
    region: 'High Income Countries',
  },
  {
    id: 'UMIC',
    region: 'Upper Middle Income Countries',
  },
  {
    id: 'LMIC',
    region: 'Lower Middle Income Countries',
  },
  {
    id: 'LIC',
    region: 'Low Income Countries',
  },
];

export const COUNTRIES_WITH_REPORT = [
  'AGO',
  'BEN',
  'BWA',
  'BFA',
  'BDI',
  'CPV',
  'CMR',
  'CAR',
  'TCD',
  'COM',
  'CIV',
  'COD',
  'GNQ',
  'SWZ',
  'ETH',
  'GAB',
  'GMB',
  'GHA',
  'GIN',
  'GNB',
  'KEN',
  'LSO',
  'LBR',
  'MDG',
  'MWI',
  'MLI',
  'MRT',
  'MUS',
  'MOZ',
  'NAM',
  'NGA',
  'COG',
  'RWA',
  'STP',
  'SEN',
  'SYC',
  'SLE',
  'ZAF',
  'SSD',
  'TZA',
  'TGO',
  'UGA',
  'ZMB',
  'ZWE',
  'BGD',
  'BTN',
  'KHM',
  'IDN',
  'MDV',
  'MNG',
  'NPL',
  'PAK',
  'LKA',
  'VUT',
  'VNM',
  'DJI',
  'EGY',
  'IRQ',
  'JOR',
  'KWT',
  'PSE',
  'SOM',
  'TUN',
  'AZE',
  'GEO',
  'KAZ',
  'KGZ',
  'MDA',
  'MKD',
  'MNE',
  'SRB',
  'TJK',
  'TKM',
  'UZB',
  'ARG',
  'CHL',
  'CRI',
  'CUB',
  'DOM',
  'ECU',
  'SLV',
  'HTI',
  'PAN',
  'PER',
  // 'TTO',
  'URY',
  'WSM',
  'PNG',
  'TLS',
  'THA',
];

export const AIAAS_API_BASE_URL = import.meta.env.VITE_AIAAS_API_BASE_URL;
export const AIAAS_API_KEY = import.meta.env.VITE_AIAAS_API_KEY;

export const FILES_LIMIT = 30;
