import { useState } from 'react';
import styled from 'styled-components';
import { InfoIcon } from '../icons';
import { Tooltip } from './Tooltip';

interface Props {
  title: string;
  description: string;
}

const RootEl = styled.div`
  border-bottom: 1px solid var(--black-300);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  max-width: 128rem;
  margin: auto;
  padding: 2rem  0 1.5rem 0;
`;

const IconEl = styled.div`
  margin-left: 1rem; 
`;

export const PageTitle = (props: Props) => {
  const { title, description } = props;
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <RootEl>
      <h2>{title}</h2>
      <div onMouseEnter={() => { setShowPopUp(true); }} onMouseLeave={() => { setShowPopUp(false); }}>
        <IconEl>
          <InfoIcon
            size={18}
          />
        </IconEl>
        {
          showPopUp
            ? (
              <Tooltip
                text={description}
              />
            ) : null
        }
      </div>
    </RootEl>
  );
};
