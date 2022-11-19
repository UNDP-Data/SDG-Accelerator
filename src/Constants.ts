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
    RelatedIndicator: 'Sex difference poverty headcount, age 25-34 (females minus males, number of people)',
    ID: 'indicator_1_3',
  },
  {
    Goal: 'SDG 1',
    Indicator: 'Sex difference poverty headcount, age 25-34 (females minus males, number of people)',
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

export const COLORSCALE = ['#ffeda0', '#feb24c', '#fc4e2a', '#bd0026', '#800026'];

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
  'targets',
  'trendMethodology',
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

export const DATASOURCELINK = process.env.NODE_ENV === 'production' ? 'https://data.undp.org/sdg-push-diagnostic' : '../..';

export const SDG_ICON_SIZE = 64;
