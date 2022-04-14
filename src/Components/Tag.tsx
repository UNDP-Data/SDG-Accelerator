import styled from 'styled-components';

interface Props {
  backgroundColor: string;
  fontColor?: string;
  text: string;
  margin?:string
}

interface ColorProps {
  backgroundColor: string;
  fontColor?: string;
  margin?: string
}

const TagEl = styled.div<ColorProps>`
  font-size: 1.4rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => (props.fontColor ? props.fontColor : 'var(--white)')};
  border-radius: 2rem;
  font-weight: 600;
  margin: ${(props) => (props.margin ? props.margin : '0 0 0 1rem')};
  width: fit-content;
`;

export const Tag = (props: Props) => {
  const {
    backgroundColor,
    fontColor,
    text,
    margin,
  } = props;
  return (
    <TagEl backgroundColor={backgroundColor} fontColor={fontColor} margin={margin}>{text}</TagEl>
  );
};
