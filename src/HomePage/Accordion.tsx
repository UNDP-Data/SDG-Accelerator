/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react';

interface Props {
  title: string;
  body: any;
}

export const AccordionEl = (props: Props) => {
  const { title, body } = props;
  const [openState, setOpenState] = useState(false);
  return (
    <div style={{ backgroundColor: 'var(--white)', cursor: 'pointer' }}>
      <div className='flex-div' style={{ justifyContent: 'space-between', padding: '1.5rem' }} onClick={() => { setOpenState(!openState); }}>
        <h5 className='undp-typography margin-bottom-00'>
          {title}
        </h5>
        <div style={{ flexShrink: 0 }}>
          {
            openState ? <img src='https://design.undp.org/icons/chevron-up.svg' alt='icon' /> : <img src='https://design.undp.org/icons/chevron-down.svg' alt='icon' />
          }
        </div>
      </div>
      {
        openState
          ? (
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              {body}
            </div>
          ) : null
      }
    </div>
  );
};
