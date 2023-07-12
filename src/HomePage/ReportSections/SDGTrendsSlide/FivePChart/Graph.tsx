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
  const size = Math.min(width / 6, height / 7, 98);
  const colors = [UNDPColorModule.sdgColors.sdg1, UNDPColorModule.categoricalColors.colors[1], UNDPColorModule.categoricalColors.colors[2], UNDPColorModule.sdgColors.sdg16, UNDPColorModule.sdgColors.sdg17];
  return (
    <div style={{ flexGrow: 1, padding: 'var(--spacing-07)' }}>
      {
        FIVE_P.map((d, i) => (
          <div key={i} className={i === 0 ? '' : 'margin-top-07'}>
            <h5 className='undp-typography margin-bottom-03 bold' style={{ textAlign: 'left', color: colors[i] }}>
              {d.pValue}
              {' '}
              (
              {d.totalNoOfTargets}
              {' '}
              Targets)
            </h5>
            <div className='flex-div'>
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
