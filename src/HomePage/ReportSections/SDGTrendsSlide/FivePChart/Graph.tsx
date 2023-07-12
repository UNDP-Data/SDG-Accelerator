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
  return (
    <div>
      {
        FIVE_P.map((d, i) => (
          <div key={i} className='margin-top-07'>
            <h5 className='undp-typography margin-bottom-02' style={{ textAlign: 'left', color: 'var(--white)' }}>
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
