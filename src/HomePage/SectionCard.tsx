interface Props {
  cardTitle: string;
  cardDescription: string;
  cardIcon: string;
  id: string;
}

export const SectionCard = (props: Props) => {
  const {
    cardTitle, cardDescription, cardIcon, id,
  } = props;
  return (
    <div
      style={{
        backgroundColor: 'var(--gray-200)',
        width: 'calc(33.33% - 0.67rem)',
        flexGrow: '1',
        minWidth: '20rem',
        color: 'var(--black)',
        boxSizing: 'border-box',
        display: 'block',
      }}
    >
      <a href={`#${id}`} style={{ textDecoration: 'none', color: 'var(--black)' }}>
        <div style={{ padding: '2rem' }}>
          <img src={cardIcon} alt='' style={{ paddingBottom: '1rem' }} />
          <h6 className='undp-typography margin-bottom-00 margin-top-00 '>{ cardTitle }</h6>
          <p className='small-font margin-bottom-00'>{ cardDescription }</p>
        </div>
      </a>
    </div>
  );
};
