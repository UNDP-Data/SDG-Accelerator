import { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  title: ReactElement;
}

const TitleEl = styled.div`
  margin: 2rem 0;
`;

const LineEl = styled.div`
  width: 5rem;
  height: 0.2rem;
  margin-bottom: 1rem;
  background-color: var(--primary-blue);
`;

const H3 = styled.h3`
  margin: 0;
`;

export const SectionTitle = (props: Props) => {
  const { title } = props;
  return (
    <TitleEl>
      <LineEl />
      <H3>
        {title}
      </H3>
    </TitleEl>
  );
};
