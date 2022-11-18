import styled from 'styled-components';
import { format } from 'd3-format';
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
  background-color: var(--gray-100);
  word-wrap: break-word;
  top: ${(props) => props.y - 40}px;
  left: ${(props) => props.x + 20}px;
  width: 15rem;
  z-index: 10;
  padding: 1.5rem;
`;

export const GraphTooltip = (props: Props) => {
  const { data } = props;
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 280 : data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-bottom-00'>
        {data.year}
      </h6>
      <div className='flex-div flex-space-between' style={{ color: 'var(--dark-red)' }}>
        <p className='small-font margin-bottom-00'>Without SDG Push</p>
        <p className='bold small-font margin-bottom-00'>{data.withoutSDGPush !== undefined ? Math.abs(data.withoutSDGPush) < 1 ? data.withoutSDGPush : format('.2s')(data.withoutSDGPush) : 'NA'}</p>
      </div>
      <div className='flex-div flex-space-between' style={{ color: 'var(--dark-green)' }}>
        <p className='small-font margin-bottom-00'>With SDG Push</p>
        <p className='bold small-font margin-bottom-00'>{data.withSDGPush !== undefined ? Math.abs(data.withSDGPush) < 1 ? data.withSDGPush : format('.2s')(data.withSDGPush) : 'NA'}</p>
      </div>
    </TooltipEl>
  );
};
