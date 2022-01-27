import styled from 'styled-components';

interface HoverDataType {
  text: string;
  xPosition: number;
  yPosition: number;
}

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
  box-shadow: 0 0 1rem rgb(0 0 0 / 15%);
  word-wrap: break-word;
  top: ${(props) => props.y - 10}px;
  left: ${(props) => props.x + 15}px;
  padding: 1rem 2rem;
  width: 32rem;
`;

export const Tooltip = (props: Props) => {
  const {
    data,
  } = props;
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 390 : data.xPosition} y={data.yPosition}>
      {data.text}
    </TooltipEl>
  );
};
