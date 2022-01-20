import styled from 'styled-components';

interface IconProps {
  size?: number;
  color?: string;
}

interface IconElProps {
  height?: number;
}

const IconEl = styled.div<IconElProps>`
  height: ${(props) => (props.height ? `${props.height}px` : '24px')};
`;

export const InfoIcon = (props: IconProps) => {
  const {
    size,
    color,
  } = props;
  return (
    <IconEl
      height={size}
    >
      <svg width={size || '24'} height={size || '24'} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M13 6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6ZM11.25 9.75L11.25 17.25C11.25 17.6642 11.5858 18 12 18C12.4142 18 12.75 17.6642 12.75 17.25L12.75 9.75C12.75 9.33579 12.4142 9 12 9C11.5858 9 11.25 9.33579 11.25 9.75ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5Z' fill={color || '#212121'} />
      </svg>
    </IconEl>
  );
};
