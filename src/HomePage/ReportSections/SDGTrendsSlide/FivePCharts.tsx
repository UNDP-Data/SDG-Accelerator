import { FIVE_P } from '../../../Constants';
import { getSDGIcon } from '../../../utils/getSDGIcon';

export const FivePCharts = () => (
  <div style={{
    minWidth: '22.5rem',
    height: 'calc(100vh - 13.5rem)',
  }}
  >
    <div>
      <h5 className='undp-typography margin-bottom-07 bold' style={{ textAlign: 'left', color: 'var(--white)' }}>
        The SDG targets are organized according to the 5 P&apos;s of sustainable development
      </h5>
      <div>
        {
            FIVE_P.map((d, i) => (
              <div key={i} className='margin-top-05'>
                <h6 className='undp-typography margin-bottom-02' style={{ textAlign: 'left', color: 'var(--white)' }}>
                  {d.pValue}
                  {' '}
                  (
                  {d.totalNoOfTargets}
                  {' '}
                  Targets)
                </h6>
                <div className='flex-div'>
                  {
                    d.goals.map((g) => getSDGIcon(`SDG ${g}`, 48))
                  }
                </div>
              </div>
            ))
          }
      </div>
    </div>
  </div>
);
