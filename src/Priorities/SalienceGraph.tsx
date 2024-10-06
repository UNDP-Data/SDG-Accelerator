import styled from 'styled-components';
import { GoalStatusType } from '../Types';

interface Props {
  data: any;
  goalStatuses: GoalStatusType[];
}

const ColorKeyBox = styled.div`
  width: 1rem;
  height: 1rem;
`;

export const SalienceGraph = (props: Props) => {
  const {
    data,
    goalStatuses,
  } = props;

  return (
    <>
      <div className='max-width-1440 margin-top-13' style={{ padding: '0 1rem' }}>
        <h3 className='undp-typography bold'>
          Relative Salience
        </h3>
        <p className='undp-typography'>
          Relative Salience is a measure of the amount of text content linked to each SDG as compared to the Goal, which is the most salient in the text. Relative Salience can help to understand which of the SDGs covered in the document receive most attention and which ones are only briefly treated.
        </p>
        <div className='flex-div flex-vert-align-center flex-wrap margin-bottom-05' style={{ gap: '1rem' }}>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--dark-green)' }} />
            <p className='small-font margin-top-00 margin-bottom-00'>On track</p>
          </div>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--dark-yellow)' }} />
            <p className='small-font margin-top-00 margin-bottom-00'>For review</p>
          </div>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--dark-red)' }} />
            <p className='small-font margin-top-00 margin-bottom-00'>Off Track</p>
          </div>
          <div className='flex-div flex-vert-align-center' style={{ gap: '0.5rem' }}>
            <ColorKeyBox style={{ backgroundColor: 'var(--gray-400)' }} />
            <p className='small-font margin-top-00 margin-bottom-00'>Trend NA</p>
          </div>
        </div>
        <svg width='100%' viewBox='0 0 1280 430' style={{ marginBottom: '4rem' }}>
          <rect
            x={0}
            width={1280}
            y={400 - (375 * 0.25)}
            height={(375 * 0.25) + 10}
            fill='#F7F7F7'
          />
          <rect
            x={0}
            width={1280}
            y={0}
            height={(375 * 0.25) + 10}
            fill='#F7F7F7'
          />
          <g
            transform={`translate(0,${((375 * 0.25) + 10) / 2})`}
          >
            <text
              fontSize={12}
              x={0}
              y={0}
              dy={12}
              transform='rotate(-90)'
              textAnchor='middle'
              fill='#55606E'
            >
              High Priority
            </text>
          </g>
          <g
            transform='translate(0,210)'
          >
            <text
              fontSize={12}
              x={0}
              y={0}
              dy={12}
              transform='rotate(-90)'
              textAnchor='middle'
              fill='#55606E'
            >
              Medium Priority
            </text>
          </g>
          <g
            transform={`translate(0,${(400 - (375 * 0.125))})`}
          >
            <text
              fontSize={12}
              x={0}
              y={0}
              dy={12}
              transform='rotate(-90)'
              textAnchor='middle'
              fill='#55606E'
            >
              Low Priority
            </text>
          </g>
          {
            data.map((d: any, i: number) => (
              <g
                key={i}
                transform={`translate(${i * 75},10)`}
              >
                <circle
                  cx={37.5}
                  r={15}
                  cy={400 - (375 * d.importance)}
                  style={{
                    fill: goalStatuses.findIndex((el) => el.goal === d.id) !== -1 ? goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'On Track' ? 'var(--dark-green)' : goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'For Review' ? 'var(--dark-yellow)' : goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'Identified Gap' ? 'var(--dark-red)' : 'var(--gray-500)' : 'var(--gray-500)',
                  }}
                />
                <line
                  strokeWidth={2}
                  width={45}
                  x1={37.5}
                  x2={37.5}
                  y1={400 - (375 * d.importance)}
                  y2={400}
                  style={{
                    stroke: goalStatuses.findIndex((el) => el.goal === d.id) !== -1 ? goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'On Track' ? 'var(--dark-green)' : goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'For Review' ? 'var(--dark-yellow)' : goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'Identified Gap' ? 'var(--dark-red)' : 'var(--gray-500)' : 'var(--gray-500)',
                  }}
                />
                <text
                  x={37.5}
                  y={400 - (375 * d.importance)}
                  dy={-20}
                  style={{
                    fill: goalStatuses.findIndex((el) => el.goal === d.id) !== -1 ? goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'On Track' ? 'var(--dark-green)' : goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'For Review' ? 'var(--dark-yellow)' : goalStatuses[goalStatuses.findIndex((el) => el.goal === d.id)].status === 'Identified Gap' ? 'var(--dark-red)' : 'var(--gray-500)' : 'var(--gray-500)',
                  }}
                  fontSize={12}
                  textAnchor='middle'
                >
                  {(d.importance)?.toFixed(3)}
                </text>
                <text
                  x={37.5}
                  y={400}
                  dy={20}
                  fill='#212121'
                  fontSize={16}
                  textAnchor='middle'
                >
                  SDG
                  {' '}
                  {d.id}
                </text>
              </g>
            ))
          }
        </svg>
      </div>
    </>
  );
};
