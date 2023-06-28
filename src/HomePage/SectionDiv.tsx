import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
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
  // eslint-disable-next-line no-unused-vars
  setSectionNo: (_d: number) => void;
}

const SectionEl = styled.div<SectionProps>`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  padding: var(--spacing-13) var(--spacing-05);
`;

export const SectionDiv = (props: Props) => {
  const {
    sectionNo, sectionTitle, contentDiv, color, background, setSectionNo,
  } = props;
  const { ref, inView } = useInView({
    threshold: 0.25,
  });
  useEffect(() => {
    if (inView) {
      setSectionNo(sectionNo);
    }
  }, [inView]);
  return (
    <SectionEl id={`section${sectionNo}`} color={color} background={background} ref={ref}>
      <div style={{ maxWidth: '100rem', margin: 'auto' }} className='padding-top-05 padding-bottom-05'>
        <h5 className='undp-typography margin-bottom-02'>
          Section
          {' '}
          {sectionNo}
        </h5>
        <h1 className='undp-typography'>{sectionTitle}</h1>
        <div className='margin-top-07 margin-bottom-05'>
          {contentDiv}
        </div>
      </div>
    </SectionEl>
  );
};
