interface Props {
    number: number;
    name: string;
  }

export const SectionName = (props: Props) => {
  const { number, name } = props;
  return (
    <div className='max-width flex-div' style={{ display: 'block' }}>
      <h5 className='undp-typography margin-bottom-02'>
        {' '}
        Section
        {' '}
        {number}
      </h5>
      <h2 className='undp-typography' style={{ textTransform: 'uppercase', fontFamily: 'var(--fontFamilyHeadings)' }}>{name}</h2>
    </div>
  );
};
