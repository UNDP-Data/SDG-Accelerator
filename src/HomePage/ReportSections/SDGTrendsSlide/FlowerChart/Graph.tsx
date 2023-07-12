import { selectAll } from 'd3-selection';
import max from 'lodash.max';
import { useEffect } from 'react';
import UNDPColorModule from 'undp-viz-colors';

interface StatusByPsProps {
  onTrack: number;
  offTrack: number;
  gapsNA: number;
  pValue: string;
  totalNoOfTargets: number;
  position: number[];
  goals: string[];
}
interface Props {
  status: StatusByPsProps[];
  width: number;
  height: number;
  tag: 'onTrack' | 'offTrack' | 'gapsNA';
}
export const Graph = (props: Props) => {
  const {
    status, width, height, tag,
  } = props;

  const maxValue = (max(status.map((d) => Math.max(d.onTrack, d.offTrack, d.gapsNA))) || 50) + 20;
  const barSize = width / 2 > (height - 50) / 2 ? (height - 50) / 2 : width / 2;
  const colors = [UNDPColorModule.sdgColors.sdg1, UNDPColorModule.categoricalColors.colors[1], UNDPColorModule.categoricalColors.colors[2], UNDPColorModule.sdgColors.sdg16, UNDPColorModule.sdgColors.sdg17];
  useEffect(() => {
    status.forEach((d) => {
      selectAll(`.${d.pValue}Line`)
        .transition()
        .duration(500)
        .attr('x2', (barSize * d[tag]) / maxValue);
      selectAll(`.${d.pValue}PValue`)
        .transition()
        .duration(500)
        .attr('transform', `translate(${(barSize * d[tag]) / maxValue},0)`);
      selectAll(`.${d.pValue}Percent`)
        .transition()
        .duration(500)
        .text((d[tag]).toFixed(1));
    });
  }, [tag]);
  return (
    <svg
      width='100%'
      style={{
        alignItems: 'flex-end',
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      {
        status.map((d, i) => (
          <g key={i} transform={`translate(${width / 2},${(height) / 2}) rotate(${72 * (i)})`}>
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={0}
              strokeWidth={48}
              className={`${d.pValue}Line`}
              stroke={colors[i]}
              opacity={0.9}
              strokeLinecap='round'
            />
            <g transform='translate(0,0)' className={`${d.pValue}PValue`}>
              <text
                x1={0}
                x={0}
                y={5}
                dy={0}
                dx={i === 2 || i === 1 || i === 3 ? -30 : 30}
                className={`${d.pValue}Percent`}
                style={{
                  fill: colors[i],
                }}
                fontSize={18}
                fontWeight='bold'
                transform={i === 2 || i === 1 || i === 3 ? 'rotate(180)' : 'rotate(0)'}
                textAnchor={i === 2 || i === 1 || i === 3 ? 'end' : 'start'}
              />
            </g>
          </g>
        ))
      }
      <circle
        cx={width / 2}
        cy={(height) / 2}
        r={24}
        opacity={0.9}
        fill='#fff'
      />
    </svg>
  );
};
