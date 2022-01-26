import { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  color: 'yellow' | 'red' | 'green';
  content: ReactElement;
}

interface ColorProps {
  color: string;
}

const BannerEl = styled.div<ColorProps>`
  background-color: ${(props) => (props.color === 'yellow' ? 'var(--accent-yellow-light)' : props.color === 'green' ? 'var(--accent-green-light)' : 'var(--accent-red-light)')};
  border: 1px solid ${(props) => (props.color === 'yellow' ? 'var(--accent-yellow)' : props.color === 'green' ? 'var(--accent-green)' : 'var(--accent-red)')};
  border-radius: 2px;
  margin: 2rem 0 1rem 0;
  padding: 1.5rem 2rem;
  font-size: 2rem;
`;

export const Banner = (props: Props) => {
  const {
    color,
    content,
  } = props;
  return (
    <BannerEl
      color={color}
    >
      {content}
    </BannerEl>
  );
};
