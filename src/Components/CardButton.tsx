import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  title: string;
  body: string;
  link: string;
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

const LinkEl = styled.div`
  color: var(--black-700);
  &:hover {
    color: var(--primary-blue);
  }
`;

const H2 = styled.h2`
  margin: 0 0 1rem 0;
`;

const ButtonEl = styled.div`
  margin-left: -0.5rem;
  margin-bottom: 2rem;
  position: absolute;
  margin-top: 2rem; 
  bottom: 0;
`;

const BodyEl = styled.div`
  margin-bottom: 4rem;
`;

export const CardButton = (props: Props) => {
  const {
    title,
    body,
    link,
    cardWidth,
  } = props;
  const params = useParams();
  return (
    <RootEl cardWidth={cardWidth}>
      <Link to={`${params.country}${link}`}>
        <LinkEl>
          <H2>
            {title}
          </H2>
          <BodyEl>
            {body}
          </BodyEl>
          <ButtonEl>
            <button type='button' className='secondary'>Learn More</button>
          </ButtonEl>
        </LinkEl>
      </Link>
    </RootEl>
  );
};
