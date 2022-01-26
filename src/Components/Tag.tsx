import styled from 'styled-components';

interface Props {
  backgroundColor: string;
  fontColor?: string;
  text: string;
}

interface ColorProps {
  backgroundColor: string;
  fontColor?: string;
}

const TagEl = styled.div<ColorProps>`
font-size: 1.4rem;
padding: 0.5rem 1rem;
background-color: ${(props) => props.backgroundColor};
color: ${(props) => (props.fontColor ? props.fontColor : 'var(--white)')};
border-radius: 2rem;
font-weight: 600;
margin-left: 1rem;
`;

export const Tag = (props: Props) => {
  const {
    backgroundColor,
    fontColor,
    text,
  } = props;
  return (
    <TagEl backgroundColor={backgroundColor} fontColor={fontColor}>{text}</TagEl>
  );
};
