import styled from 'styled-components';
import { ScatterHoverDataType } from '../Types';

interface Props {
  data: ScatterHoverDataType;
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

const TooltipTitle = styled.div`
  color: var(--white);  
  background: var(--blue-medium);
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  position: relative;
  font-weight: 700;
  font-size: 2rem;
  line-height: 2.4rem;
  border-radius: 1rem 1rem 0 0;
`;

const TooltipBodyContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  font-size: 1.4rem;
  line-height: 2rem;
  color: var(--black);
`;

const YearEl = styled.div`
  font-size: 1.4rem;
  color: var(--black-550);
`;

export const ScatterPlotTooltip = (props: Props) => {
  const { data } = props;
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 240 : data.xPosition} y={data.yPosition}>
      <TooltipTitle>
        {data.country}
      </TooltipTitle>
      <TooltipBodyContainer>
        <YearEl>
          Year:
          {' '}
          <span className='bold'>{data.year}</span>
        </YearEl>
      </TooltipBodyContainer>
    </TooltipEl>
  );
};
