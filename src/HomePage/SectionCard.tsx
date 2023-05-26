interface Props {
    cardTitle: string;
    cardDescription: string;
    cardIcon: string;
  }

export const SectionCard = (props: Props) => {
  const { cardTitle, cardDescription, cardIcon } = props;
  return (
    <>
      <div
        className=''
        style={{
          backgroundColor: 'var(--gray-200)',
          width: 'calc(33.33% - 0.67rem)',
          flexGrow: '1',
          minWidth: '20rem',
          padding: '2rem',
          color: 'var(--black)',
          boxSizing: 'border-box',
          display: 'block',
        }}
      >
        <img src={cardIcon} alt='' style={{ paddingBottom: '1rem' }} />
        <h6 className='undp-typography margin-bottom-00 margin-top-00 '>{ cardTitle }</h6>
        <p className='small-font margin-bottom-00'>{ cardDescription }</p>
      </div>
    </>
  );
};
