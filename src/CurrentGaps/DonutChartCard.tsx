import styled from 'styled-components';
import { describeArc } from '../utils/getArc';

interface Props {
  centralText: string;
  data: any;
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
            d={describeArc(180, 180, 140, 0, 360 * (data.filter((d: any) => d.status === 'On Track').length / (17)))}
            fill='none'
            strokeWidth={60}
            style={{ stroke: 'var(--accent-green)' }}
          />
          <path
            d={describeArc(180, 180, 140, 360 * (data.filter((d: any) => d.status === 'On Track').length / (17)), 360 * ((data.filter((d: any) => d.status === 'On Track').length + data.filter((d: any) => d.status === 'Identified Gap').length) / (17)))}
            fill='none'
            strokeWidth={60}
            style={{ stroke: 'var(--accent-red)' }}
          />
          <path
            d={describeArc(180, 180, 140, 360 * ((data.filter((d: any) => d.status === 'On Track').length + data.filter((d: any) => d.status === 'Identified Gap').length) / (17)), 360)}
            fill='none'
            strokeWidth={60}
            style={{ stroke: 'var(--accent-yellow)' }}
          />
          <path
            d={describeArc(180, 180, 140, 360 * (data.length / 17), 360)}
            fill='none'
            strokeWidth={60}
            style={{ stroke: 'var(--black-550)' }}
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
            {17}
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
