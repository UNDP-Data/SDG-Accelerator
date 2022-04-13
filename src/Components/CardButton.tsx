import styled from 'styled-components';

interface Props {
  title: string;
  body: string;
  cardWidth?: string;
}

interface RootElProps {
  cardWidth?: string;
}

const RootEl = styled.div<RootElProps>`
  background-color: var(--black-100);
  padding: 2rem;
  font-size: 1.6rem;
  color: var(--black-700);
  position: relative;
  flex-grow: 0;
  flex-basis: ${(props) => (props.cardWidth ? props.cardWidth : '100%')};
  margin: 0 1rem;
  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;

const H2 = styled.h2`
  margin: 0 0 1rem 0;
`;

export const CardButton = (props: Props) => {
  const {
    title,
    body,
    cardWidth,
  } = props;
  return (
    <RootEl cardWidth={cardWidth}>
      <H2>
        {title}
      </H2>
      <div>
        {body}
      </div>
    </RootEl>
  );
};
