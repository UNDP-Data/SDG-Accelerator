import styled from 'styled-components';
import { HoverDataType } from '../Types';

interface Props {
  data: HoverDataType;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 10;
  border-radius: 1rem;
  font-size: 1.4rem;
  background-color: var(--white);
  box-shadow: var(--shadow);
  word-wrap: break-word;
  top: ${(props) => props.y - 40}px;
  left: ${(props) => props.x + 20}px;
  width: 20rem;
  z-index: 1000;
`;

const TooltipBodyContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 2rem;
  font-size: 1.4rem;
  line-height: 2rem;
  color: var(--black);
`;

const YearEl = styled.div`
  font-size: 1.4rem;
  color: var(--black-550);
`;

const RowEl = styled.div`
  color: var(--black);
  margin: 2rem 0 0 0;
`;

const ValueEl = styled.div`
  font-size: 1.6rem;
  margin-top: 0.3rem;
`;

export const GraphTooltip = (props: Props) => {
  const { data } = props;
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 240 : data.xPosition} y={data.yPosition}>
      <TooltipBodyContainer>
        <YearEl>
          Year:
          {' '}
          <span className='bold'>{data.year}</span>
        </YearEl>
        <RowEl style={{ color: '#ed4347' }}>
          <>Without SDG Push</>
          <ValueEl className='bold'>{data.withoutSDGPush}</ValueEl>
        </RowEl>
        <RowEl style={{ color: '#009788' }}>
          <>With SDG Push</>
          <ValueEl className='bold'>{data.withSDGPush}</ValueEl>
        </RowEl>
      </TooltipBodyContainer>
    </TooltipEl>
  );
};
