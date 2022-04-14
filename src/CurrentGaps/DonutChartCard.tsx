import styled from 'styled-components';
import { describeArc } from '../utils/getArc';
import { SDGStatusListType } from '../Types';

interface Props {
  centralText: string;
  data: SDGStatusListType[];
}

const ContentEl = styled.div`
  display: flex;
  align-items: flex-end;
`;

const RootEl = styled.div`
  padding: 4rem 6rem 4rem 10rem;
`;

export const DonutChartCard = (props: Props) => {
  const {
    centralText,
    data,
  } = props;

  return (
    <RootEl>
      <ContentEl>
        <svg width='340px' viewBox='0 0 360 360'>
          <path
            d={describeArc(180, 180, 140, 0, 360 * (data.filter((d) => d.Status === 'On Track').length / (data.length)))}
            fill='none'
            strokeWidth={60}
            style={{ stroke: 'var(--accent-green)' }}
          />
          <path
            d={describeArc(180, 180, 140, 360 * (data.filter((d) => d.Status === 'On Track').length / (data.length)), 360 * ((data.filter((d) => d.Status === 'On Track').length + data.filter((d) => d.Status === 'Identified Gap').length) / (data.length)))}
            fill='none'
            strokeWidth={60}
            style={{ stroke: 'var(--accent-red)' }}
          />
          <path
            d={describeArc(180, 180, 140, 360 * ((data.filter((d) => d.Status === 'On Track').length + data.filter((d) => d.Status === 'Identified Gap').length) / (data.length)), 360)}
            fill='none'
            strokeWidth={60}
            style={{ stroke: 'var(--accent-yellow)' }}
          />
          <text
            x={180}
            y={180}
            textAnchor='middle'
            fontFamily='proxima-nova'
            fontWeight='bold'
            fontSize='60px'
            dy={10}
          >
            {data.length}
          </text>
          <text
            x={180}
            y={180}
            textAnchor='middle'
            fontFamily='proxima-nova'
            fontWeight='bold'
            fontSize='20px'
            dy={35}
          >
            {centralText}
          </text>
        </svg>
      </ContentEl>
    </RootEl>
  );
};
