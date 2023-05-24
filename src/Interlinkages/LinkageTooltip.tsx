import styled from 'styled-components';
import { LinkageHoverDataType } from '../Types';

interface Props {
  data: LinkageHoverDataType;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 1000;
  font-size: 1rem;
  background-color: var(--gray-100);
  word-wrap: break-word;
  top: ${(props) => props.y - 10}px;
  left: ${(props) => props.x + 15}px;
  padding: 1rem;
  width: 20rem;
`;

export const Tooltip = (props: Props) => {
  const {
    data,
  } = props;
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 375 : data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-bottom-01'>{data.title}</h6>
      <p className='margin-top-00' style={{ fontSize: '0.875rem' }}>{data.text}</p>
      <hr />
      <div className='flex-div flex-space-between'>
        <p className='small-font'>No of synergies</p>
        <p className='small-font bold'>{data.noOfSynergies}</p>
      </div>
      <div className='flex-div flex-space-between'>
        <p className='small-font'>No of trade-offs</p>
        <p className='small-font bold'>{data.noOfTradeOff}</p>
      </div>
    </TooltipEl>
  );
};
