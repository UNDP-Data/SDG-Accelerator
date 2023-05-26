import sortBy from 'lodash.sortby';
import { SDG_ICON_SIZE } from '../Constants';
import { getSDGIcon } from '../utils/getSDGIcon';
import { GoalStatusType } from '../Types';

interface Props {
  goalStatuses: GoalStatusType[];
}

export const SDGGoalGapList = (props: Props) => {
  const { goalStatuses } = props;
  const onTrack = sortBy(goalStatuses.filter((d) => d.status === 'On Track'), 'goal');
  const identifiedGap = sortBy(goalStatuses.filter((d) => d.status === 'Identified Gap'), 'goal');
  const forReview = sortBy(goalStatuses.filter((d) => d.status === 'For Review'), 'goal');
  const gapsNA = sortBy(goalStatuses.filter((d) => !d.status), 'goal');
  return (
    <div>
      <div
        style={{ backgroundColor: 'var(--white)', padding: '3rem' }}
      >
        <div className='margin-bottom-09'>
          <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-green)' }}>
            <span className='bold'>
              {onTrack.length > 0 ? onTrack.length : 'No'}
              {' '}
              {onTrack.length > 1 ? 'SDGs' : 'SDG'}
            </span>
            {' '}
            On Track
          </h4>
          <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>The country is on track to fulfil the SDG by 2030</p>
          <div className='flex-div flex-wrap margin-bottom-11'>
            <div className='flex-div flex-wrap'>
              {
                  onTrack.map((d, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
            </div>
          </div>
        </div>
        <div className='margin-bottom-09'>
          <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-yellow)' }}>
            <span className='bold'>
              {forReview.length > 0 ? forReview.length : 'No'}
              {' '}
              {forReview.length > 1 ? 'SDGs' : 'SDG'}
            </span>
            {' '}
            For Review
          </h4>
          <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>With current progress the country will miss the SDG by 2030 by a small margin</p>
          <div className='flex-div flex-wrap margin-bottom-11'>
            <div className='flex-div flex-wrap'>
              {
                  forReview.map((d, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
            </div>
          </div>
        </div>
        <div className='margin-bottom-09'>
          <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-red)' }}>
            <span className='bold'>
              {identifiedGap.length}
              {' '}
              SDG
            </span>
            {' '}
            Off Track
          </h4>
          <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>With current progress the country will miss the SDG by 2030 by a large margin</p>
          <div className='flex-div flex-wrap margin-bottom-11'>
            <div className='flex-div flex-wrap'>
              {
                  identifiedGap.map((d, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
            </div>
          </div>
        </div>
        <div>
          <h4 className='undp-typography margin-bottom-00' style={{ color: 'var(--gray-600)' }}>
            <span className='bold'>
              {gapsNA.length}
              {' '}
              SDG
            </span>
            {' '}
            Trend NA
          </h4>
          <p className='undp-typography small-font italics' style={{ color: 'var(--gray-500)' }}>Country doesn’t have enough data to identify the progress of the SDG</p>
          <div className='flex-div flex-wrap margin-bottom-11'>
            <div className='flex-div flex-wrap'>
              {
                  gapsNA.map((d, i: number) => (
                    <div key={i}>
                      {getSDGIcon(`SDG ${d.goal}`, SDG_ICON_SIZE)}
                    </div>
                  ))
                }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
