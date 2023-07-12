import { selectAll } from 'd3-selection';
import { useEffect } from 'react';

interface Props {
  withoutSDGPush: number;
  withSDGPush: number;
  scale: number;
  inView: boolean;
}

const PeopleIcon = (transformX: number, transformY: number, index: number) => (
  <g transform={`translate(${transformX},${transformY})`} className={`icon_${index} peopleIcons`}>
    <path d='M24 23.95C21.8 23.95 20 23.25 18.6 21.85C17.2 20.45 16.5 18.65 16.5 16.45C16.5 14.25 17.2 12.45 18.6 11.05C20 9.65001 21.8 8.95001 24 8.95001C26.2 8.95001 28 9.65001 29.4 11.05C30.8 12.45 31.5 14.25 31.5 16.45C31.5 18.65 30.8 20.45 29.4 21.85C28 23.25 26.2 23.95 24 23.95ZM8 40V35.3C8 34.0333 8.31667 32.95 8.95 32.05C9.58333 31.15 10.4 30.4667 11.4 30C13.6333 29 15.775 28.25 17.825 27.75C19.875 27.25 21.9333 27 24 27C26.0667 27 28.1167 27.2583 30.15 27.775C32.1833 28.2917 34.3167 29.0333 36.55 30C37.5833 30.4667 38.4167 31.15 39.05 32.05C39.6833 32.95 40 34.0333 40 35.3V40H8Z' fill='white' />
  </g>
);

export const Graph = (props: Props) => {
  const {
    withoutSDGPush,
    withSDGPush,
    inView,
    scale,
  } = props;
  useEffect(() => {
    if (inView) {
      const indexToHide = Array.from({ length: Math.round(withoutSDGPush / scale) }, (_, index) => index).filter((d) => d >= Math.round(withSDGPush / scale)).reverse();
      indexToHide.forEach((d, i) => {
        selectAll('.peopleIcons')
          .attr('opacity', 1);
        selectAll(`.icon_${d}`)
          .transition()
          .duration(300)
          .delay(i * 300)
          .attr('opacity', 0.2);
      });
    }
  }, [inView]);

  return (
    <svg
      width='100%'
      style={{ alignItems: 'flex-end' }}
      viewBox={`0 0 ${14 * 48} ${(Math.floor((withoutSDGPush / scale) / 10) + 1) * 48}`}
    >
      <g transform='translate(0, 10)'>
        {
           Array.from({ length: Math.round(withoutSDGPush / scale) }, (_, index) => index).map((d) => (
             PeopleIcon((d % 14) * 48, Math.floor(d / 14) * 48, d)
           ))
        }
      </g>
    </svg>
  );
};
