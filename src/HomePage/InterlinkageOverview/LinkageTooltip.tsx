import styled from 'styled-components';
import { SDGList } from '../../Data/SDGGoalList';
import { REGION_FULL_NAME } from '../../Constants';

interface Props {
  data: any;
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

const TooltipFDGEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 1000;
  font-size: 1rem;
  background-color: var(--gray-100);
  word-wrap: break-word;
  top: ${(props) => props.y - 10}px;
  left: ${(props) => props.x + 15}px;
  padding: 0.5rem;
`;

export const Tooltip = (props: Props) => {
  const {
    data,
  } = props;
  const indx = SDGList.findIndex((d) => d.Goal === `SDG ${data.primaryTarget.split('.')[0]}`);

  const description = SDGList[indx].Targets[SDGList[indx].Targets.findIndex((d) => d.Target === `Target ${data.primaryTarget}`)]['Target Description'];
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 375 : data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-bottom-01'>
        Target
        {' '}
        {data.primaryTarget}
      </h6>
      <p className='margin-top-00' style={{ fontSize: '0.875rem' }}>{description}</p>
      <hr />
      <div>
        <p className='small-font margin-bottom-00'>
          No of reports that mention
          {' '}
          {data.primaryTarget}
          {' '}
          as primary target
        </p>
        <p className='bold margin-top-00'>
          {data.noOfReportsWithTarget}
          {' '}
          (out of
          {' '}
          {data.noOfReportsTotal}
          )
        </p>
      </div>
      <p className='small-font italics margin-bottom-00' style={{ color: 'var(--gray-500)' }}>
        Click to see associated targets
      </p>
    </TooltipEl>
  );
};

export const AssociatedTargetTooltip = (props: Props) => {
  const {
    data,
  } = props;
  const indx = SDGList.findIndex((d) => d.Goal === `SDG ${data.target.split('.')[0]}`);

  const description = SDGList[indx].Targets[SDGList[indx].Targets.findIndex((d) => d.Target === `Target ${data.target}`)]['Target Description'];
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 375 : data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-bottom-01'>
        Target
        {' '}
        {data.target}
      </h6>
      <p className='margin-top-00' style={{ fontSize: '0.875rem' }}>{description}</p>
      <hr />
      <div>
        <p className='small-font margin-bottom-00'>
          No of reports that mention
          {' '}
          {data.primaryTarget}
          {' '}
          as primary target associated with
          {' '}
          {data.target}
        </p>
        <p className='bold margin-top-00'>
          {data.noOfReportsWithTarget}
          {' '}
          (out of
          {' '}
          {data.noOfReportsTotal}
          )
        </p>
      </div>
    </TooltipEl>
  );
};

export const RegionTooltip = (props: Props) => {
  const {
    data,
  } = props;
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 375 : data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-bottom-01'>
        {REGION_FULL_NAME[REGION_FULL_NAME.findIndex((d) => d.id === data.region)].region}
      </h6>
      <p className='margin-top-00' style={{ fontSize: '0.875rem' }}>
        No. of Reports:
        {' '}
        <span className='bold'>{data.noOfReportsTotal}</span>
      </p>
      <p className='small-font italics margin-bottom-00' style={{ color: 'var(--gray-500)' }}>
        Click to see the list of countries
      </p>
    </TooltipEl>
  );
};

export const FDGTooltip = (props: Props) => {
  const {
    data,
  } = props;
  return (
    <TooltipFDGEl x={data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-bottom-01'>
        {data.type === 'primary' ? 'Primary' : 'Secondary'}
        {' '}
        Target:
        {' '}
        {data.id.split('_')[1]}
      </h6>
      <p className='margin-top-00' style={{ fontSize: '0.875rem' }}>{data.description}</p>
      <hr />
      <div>
        <p className='small-font margin-top-00 margin-bottom-00'>
          No of
          {' '}
          {data.type === 'primary' ? 'secondary targets' : 'primary targets'}
          {' '}
          for
          {' '}
          {data.id.split('_')[1]}
        </p>
        <p className='bold margin-top-00 margin-bottom-00'>
          {data.associatedTargets.length}
        </p>
      </div>
      {
        data.type === 'primary'
          ? (
            <p className='small-font italics margin-bottom-00' style={{ color: 'var(--gray-500)' }}>
              Click to see detail about the primary target
            </p>
          ) : null
      }
    </TooltipFDGEl>
  );
};
