import styled from 'styled-components';

interface Props {
  cardTitle: string;
  cardDescription: string;
  cardIcon: string;
  id: string;
}

const Container = styled.div`
  background-color: var(--gray-200);
  width: calc(33.33% - 0.67rem);
  flex-grow: 1;
  min-width: 20rem;
  color: var(--black);
  box-sizing: border-box;
  display: 'block';
  cursor: pointer;
  &:hover {
    background-color: var(--gray-300);
  }
`;

export const SectionCard = (props: Props) => {
  const {
    cardTitle, cardDescription, cardIcon, id,
  } = props;
  return (
    <Container>
      <a href={`#${id}`} style={{ textDecoration: 'none', color: 'var(--black)' }}>
        <div style={{ padding: '2rem' }}>
          <img src={cardIcon} alt='' style={{ paddingBottom: '1rem' }} />
          <h6 className='undp-typography margin-bottom-00 margin-top-00 '>{ cardTitle }</h6>
          <p className='small-font margin-bottom-00'>{ cardDescription }</p>
        </div>
      </a>
    </Container>
  );
};
