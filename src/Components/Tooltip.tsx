import styled from 'styled-components';

interface Props {
  text: string;
}

const TooltipEl = styled.div`
  display: block;
  position: absolute;
  z-index: 10;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.4rem;
  background-color: var(--white);
  box-shadow: 0px 10px 20px 0px rgb(9 105 250 / 15%);
  max-width: 40rem;
  word-wrap: break-word;
  font-size: 1.4rem;
  color: var(--black-700);
  margin-top: -3rem;
  margin-left: 3.5rem;
`;

export const Tooltip = (props: Props) => {
  const {
    text,
  } = props;
  return (
    <TooltipEl>
      {text}
    </TooltipEl>
  );
};
