import styled from 'styled-components';
import { HoverBasic } from '../Types';

interface Props {
  data: HoverBasic;
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
  z-index: 1000;
  padding: 1rem;
`;
export const BasicHoverTooltip = (props: Props) => {
  const { data } = props;
  return (
    <TooltipEl x={data.xPosition} y={data.yPosition}>
      {data.country}
    </TooltipEl>
  );
};
