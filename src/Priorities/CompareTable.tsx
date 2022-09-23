import styled from 'styled-components';
import { getSDGIcon } from '../utils/getSDGIcon';
import SDGGoalList from '../Data/SDGGoalList.json';
import { Tag } from '../Components/Tag';

interface Props {
  data: any;
  statuses: any;
  file1: string;
  file2: string;
}

const TableTitle = styled.div`
  background-color: var(--black-100);
  font-weight: bold;
  display: flex;
`;

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--black-400);
`;

interface WidthProps {
  width: string;
}

const TableHead = styled.div<WidthProps>`
  width: ${(props) => `calc(${props.width})`};
  flex-shrink: 0;
  padding: 1rem 3rem;   
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Column = styled.div<WidthProps>`
  width: ${(props) => `calc(${props.width})`};
  flex-shrink: 0;
  padding: 2rem;   
  display: flex;
  align-items: flex-start;
`;

interface ColorProps {
  fill: string;
}

const TagEl = styled.div<ColorProps>`
  padding: 0.5rem 1rem;
  color: ${(props) => (props.fill === 'On Track' ? '#fff' : props.fill === 'Identified Gap' ? '#fff' : props.fill === 'For Review' ? 'var(--black-700)' : '#fff')};
  font-size: 1.6rem;
  font-weight: bold;
  width: fit-content;
  border-radius: 2rem;
  background-color: ${(props) => (props.fill === 'On Track' ? 'var(--accent-green)' : props.fill === 'Identified Gap' ? 'var(--accent-red)' : props.fill === 'For Review' ? 'var(--accent-yellow)' : 'var(--black-550)')};
`;

export const CompareTable = (props: Props) => {
  const {
    data, statuses, file1, file2,
  } = props;
  return (
    <>
      <TableTitle>
        <TableHead width='40%'>
          SDGs
        </TableHead>
        <TableHead width='30%'>
          {file1}
        </TableHead>
        <TableHead width='30%'>
          {file2}
        </TableHead>
      </TableTitle>
      {
        data[0].map((d: any, i: number) => (
          <TableRow key={i}>
            <Column width='40%'>
              {getSDGIcon(`SDG ${d.sdg}`, 80)}
              <div style={{ marginLeft: '1rem' }}>
                <div className='bold'>
                  {SDGGoalList[SDGGoalList.findIndex((el) => el.Goal === `SDG ${d.sdg}`)]['Goal Name']}
                </div>
                <TagEl fill={statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}>{statuses.findIndex((status: any) => status.goal === `${d.sdg}`) !== -1 ? statuses[statuses.findIndex((status: any) => status.goal === `${d.sdg}`)].status : 'Gap Unidentified'}</TagEl>
              </div>
            </Column>
            <Column width='30%'>
              <Tag
                backgroundColor={data[0][i].category === 'high' ? 'var(--accent-red)' : data[0][i].category === 'medium' ? 'var(--accent-yellow)' : data[0][i].category === 'low' && data[0][i].salience > 0 ? 'var(--accent-green)' : 'var(--black-550)'}
                text={data[0][i].category === 'high' ? 'High priority' : data[0][i].category === 'medium' ? 'Medium priority' : data[0][i].category === 'low' && data[0][i].salience > 0 ? 'Low priority' : 'No mention'}
                fontColor={data[0][i].category === 'medium' ? 'var(--black)' : 'var(--white)'}
                margin='0 0 0 0'
              />
            </Column>
            <Column width='30%'>
              <Tag
                backgroundColor={data[1][i].category === 'high' ? 'var(--accent-red)' : data[1][i].category === 'medium' ? 'var(--accent-yellow)' : data[1][i].category === 'low' && data[1][i].salience > 0 ? 'var(--accent-green)' : 'var(--black-550)'}
                text={data[1][i].category === 'high' ? 'High priority' : data[1][i].category === 'medium' ? 'Medium priority' : data[1][i].category === 'low' && data[1][i].salience > 0 ? 'Low priority' : 'No mention'}
                fontColor={data[1][i].category === 'medium' ? 'var(--black)' : 'var(--white)'}
                margin='0 0 0 0'
              />
            </Column>
          </TableRow>
        ))
      }
    </>
  );
};
