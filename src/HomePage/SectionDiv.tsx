import styled from 'styled-components';

interface SectionProps {
  color: string;
  background: string;
}

interface Props {
  sectionNo: number;
  sectionTitle: string;
  contentDiv: any;
  color: string;
  background: string;
}

const SectionEl = styled.div<SectionProps>`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  padding: var(--spacing-13);
`;

export const SectionDiv = (props: Props) => {
  const {
    sectionNo, sectionTitle, contentDiv, color, background,
  } = props;
  return (
    <SectionEl id={`section${sectionNo}`} color={color} background={background}>
      <div style={{ maxWidth: '70rem', margin: 'auto' }} className='padding-top-05 padding-bottom-05'>
        <h5 className='undp-typography margin-bottom-02'>
          Section
          {' '}
          {sectionNo}
        </h5>
        <h2 className='undp-typography'>{sectionTitle}</h2>
        <div className='margin-top-07 margin-bottom-05'>
          {contentDiv}
        </div>
      </div>
    </SectionEl>
  );
};
