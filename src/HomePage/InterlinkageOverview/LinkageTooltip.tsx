import styled from 'styled-components';
import { SDGList } from '../../Data/SDGGoalList';

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
  const regionFullName = [
    {
      id: 'Global',
      region: 'Global',
    },
    {
      id: 'RBA',
      region: 'Regional Bureau for Africa',
    },
    {
      id: 'RBEC',
      region: 'Regional Bureau for Europe and Central Asia',
    },
    {
      id: 'RBLAC',
      region: 'Regional Bureau for Latin America and the Caribbean',
    },
    {
      id: 'RBAS',
      region: 'Regional Bureau for Arab States',
    },
    {
      id: 'RBAP',
      region: 'Regional Bureau for Asia and the Pacific',
    },
    {
      id: 'HIC',
      region: 'High Income Countries',
    },
    {
      id: 'UMIC',
      region: 'Upper Middle Income Countries',
    },
    {
      id: 'LMIC',
      region: 'Lower Middle Income Countries',
    },
    {
      id: 'LIC',
      region: 'Low Income Countries',
    },
  ];
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 375 : data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-bottom-01'>
        {regionFullName[regionFullName.findIndex((d) => d.id === data.region)].region}
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