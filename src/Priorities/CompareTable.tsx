import styled from 'styled-components';
import { getSDGIcon } from '../utils/getSDGIcon';
import SDGGoalList from '../Data/SDGGoalList.json';
import { GoalStatusType } from '../Types';

import '../style/statCardStyle.css';
import '../style/tableStyle.css';

interface Props {
  data: any;
  goalStatuses: GoalStatusType[];
  document: [string, string];
}

const StatCardsContainer = styled.div`
  width: 'calc(50% - 0.5rem)';
  min-width: 15rem !important;
  flex-grow: 1;
`;

export const CompareAnalysis = (props: Props) => {
  const {
    data, goalStatuses, document,
  } = props;
  const dataDoc1WithStatuses = data[0].map((d: any) => ({ ...d, status: goalStatuses[goalStatuses.findIndex((el) => el.goal === d.sdg)].status || 'Gaps NA' }));
  const dataDoc2WithStatuses = data[1].map((d: any) => ({ ...d, status: goalStatuses[goalStatuses.findIndex((el) => el.goal === d.sdg)].status || 'Gaps NA' }));
  let similar = 0;
  for (let i = 0; i < dataDoc1WithStatuses.length; i += 1) {
    if (dataDoc1WithStatuses[i].category === dataDoc2WithStatuses[i].category) similar += 1;
  }
  return (
    <>
      <div className='max-width-1440 margin-top-13 margin-bottom-13' style={{ padding: '0 1rem' }}>
        <h3 className='undp-typography bold'>
          Comparing
          {' '}
          {document[0]}
          {' '}
          and
          {' '}
          {document[1]}
        </h3>
        <div className='flex-div margin-top-07 margin-bottom-07 flex-wrap'>
          <StatCardsContainer>
            <div className='stat-card'>
              <h2>{similar}</h2>
              <p>No. of SDGs with same priorities</p>
            </div>
          </StatCardsContainer>
          <StatCardsContainer>
            <div className='stat-card'>
              <h2>{17 - similar}</h2>
              <p>No. of SDGs with different priorities</p>
            </div>
          </StatCardsContainer>
        </div>
        <h3 className='undp-typography bold'>
          All SDGs
        </h3>
        <div style={{ width: '100%' }} className='undp-scrollbar'>
          <div className='margin-top-07' style={{ minWidth: '64rem' }}>
            <div className='undp-table-head'>
              <div style={{ width: '33.33%' }} className='undp-table-head-cell undp-sticky-head-column'>
                SDGs
              </div>
              <div style={{ width: '33.33%' }} className='undp-table-head-cell undp-sticky-head-column'>
                {document[0]}
              </div>
              <div style={{ width: '33.33%' }} className='undp-table-head-cell undp-sticky-head-column'>
                {document[1]}
              </div>
            </div>
            {
              dataDoc1WithStatuses.map((d: any, i: number) => (
                <div className='undp-table-row' key={i}>
                  <div style={{ width: '33.33%', backgroundColor: `${dataDoc2WithStatuses[i].category !== d.category ? 'var(--gray-300)' : 'var(--white)'}` }} className='undp-table-row-cell'>
                    <div className='flex-div flex-vert-align-center'>
                      {getSDGIcon(`SDG ${d.sdg}`, 72)}
                      <div>
                        <h6 className='undp-typography margin-bottom-02'>
                          SDG
                          {' '}
                          {d.sdg}
                          :
                          {' '}
                          {SDGGoalList[SDGGoalList.findIndex((el) => el.Goal === `SDG ${d.sdg}`)]['Goal Name']}
                        </h6>
                        <div key={i} className={`undp-chip undp-chip-small ${d.status === 'On Track' ? 'undp-chip-dark-green' : d.status === 'For Review' ? 'undp-chip-dark-yellow' : d.status === 'Identified Gap' ? 'undp-chip-dark-red' : 'undp-chip-dark-gray'}`}>
                          {d.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '33.33%', backgroundColor: `${dataDoc2WithStatuses[i].category !== d.category ? 'var(--gray-300)' : 'var(--white)'}` }} className='undp-table-row-cell'>
                    <div
                      className='undp-chip'
                      style={{
                        backgroundColor: d.salience === 0 ? 'var(--gray-400)' : d.category === 'high' ? 'var(--blue-700)' : d.category === 'medium' ? 'var(--blue-400)' : 'var(--blue-200)',
                        color: d.salience === 0 ? 'var(--gray-700)' : d.category === 'high' ? 'var(--white)' : d.category === 'medium' ? 'var(--white)' : 'var(--gray-700)',
                        fontSize: '1rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {d.salience === 0 ? 'No mention' : d.category}
                    </div>
                  </div>
                  <div style={{ width: '33.33%', backgroundColor: `${dataDoc2WithStatuses[i].category !== d.category ? 'var(--gray-300)' : 'var(--white)'}` }} className='undp-table-row-cell'>
                    <div
                      className='undp-chip'
                      style={{
                        backgroundColor: dataDoc2WithStatuses[i].salience === 0 ? 'var(--gray-400)' : dataDoc2WithStatuses[i].category === 'high' ? 'var(--blue-700)' : dataDoc2WithStatuses[i].category === 'medium' ? 'var(--blue-400)' : 'var(--blue-200)',
                        color: dataDoc2WithStatuses[i].salience === 0 ? 'var(--gray-700)' : dataDoc2WithStatuses[i].category === 'high' ? 'var(--white)' : dataDoc2WithStatuses[i].category === 'medium' ? 'var(--white)' : 'var(--gray-700)',
                        fontSize: '1rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {dataDoc2WithStatuses[i].salience === 0 ? 'No mention' : dataDoc2WithStatuses[i].category}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
};
