import UNDPColorModule from 'undp-viz-colors';
import { FIVE_P } from '../../../../Constants';
import { getSDGIcon } from '../../../../utils/getSDGIcon';

interface Props {
  width: number;
  height: number;
}

export const Graph = (props: Props) => {
  const {
    width,
    height,
  } = props;
  const size = Math.min(width / 6, height / 7, 64);
  const colors = [UNDPColorModule.sdgColors.sdg1, UNDPColorModule.categoricalColors.colors[1], UNDPColorModule.categoricalColors.colors[2], UNDPColorModule.sdgColors.sdg16, UNDPColorModule.sdgColors.sdg17];
  return (
    <div className='flex-div flex-wrap gap-09' style={{ flexGrow: 1, padding: 'var(--spacing-07)' }}>
      {
        FIVE_P.map((d, i) => (
          <div key={i} style={{ width: 'calc(50% - 1.5rem)' }}>
            <h6 className='undp-typography margin-bottom-03 bold' style={{ textAlign: 'left', color: colors[i] }}>
              {d.pValue}
              {' '}
              (
              {d.totalNoOfTargets}
              {' '}
              Targets)
            </h6>
            <div className='flex-div gap-03 flex-wrap'>
              {
                d.goals.map((g) => getSDGIcon(`SDG ${g}`, size))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
};
