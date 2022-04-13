import styled from 'styled-components';
import { describeArc } from '../utils/getArc';
import { SDGStatusListType } from '../Types';

interface Props {
  title: string;
  centralText: string;
  selectedSDG: string;
  data: SDGStatusListType[];
}

const ContentEl = styled.div`
  display: flex;
  align-items: flex-end;
`;

const RootEl = styled.div`
  width: calc(50% - 1rem);
  padding: 2rem;
  background-color: var(--black-200);
  margin-bottom: 2rem;
`;

interface ColorProps {
  fill: string;
}

const LegendEl = styled.div`
  display: flex;
  margin: 1rem 0 1rem 2rem;
  align-items: center;
`;

const LegendIcon = styled.div<ColorProps>`
  width: 1.2rem;
  height: 1.2rem;
  background-color: ${(props) => props.fill};
  border-radius: 0.6rem;
  margin-right: 1rem;
`;

const LegendText = styled.div<ColorProps>`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.fill};
`;

const SubText = styled.span`
  font-size: 1.4rem;
  font-weight: normal;
`;

const H3 = styled.h3`
  margin: 0 0 2rem 0;
`;

export const DonutChartCard = (props: Props) => {
  const {
    title,
    centralText,
    selectedSDG,
    data,
  } = props;

  const outOfValue = selectedSDG === 'All SDG Status' ? data.length : data[data.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets.length;

  return (
    <RootEl>
      <H3>{title}</H3>
      <ContentEl>
        <svg width='50%' viewBox='0 0 275 275'>
          <path
            d={describeArc(137.5, 137.5, 110, 0, 360 * (data.filter((d) => d.Status === 'On Track').length / (data.length)))}
            fill='none'
            strokeWidth={40}
            style={{ stroke: 'var(--accent-green)' }}
          />
          <path
            d={describeArc(137.5, 137.5, 110, 360 * (data.filter((d) => d.Status === 'On Track').length / (data.length)), 360 * ((data.filter((d) => d.Status === 'On Track').length + data.filter((d) => d.Status === 'Identified Gap').length) / (data.length)))}
            fill='none'
            strokeWidth={40}
            style={{ stroke: 'var(--accent-red)' }}
          />
          <path
            d={describeArc(137.5, 137.5, 110, 360 * ((data.filter((d) => d.Status === 'On Track').length + data.filter((d) => d.Status === 'Identified Gap').length) / (data.length)), 360)}
            fill='none'
            strokeWidth={40}
            style={{ stroke: 'var(--accent-yellow)' }}
          />
          <text
            x={137.5}
            y={137.5}
            textAnchor='middle'
            fontFamily='proxima-nova'
            fontWeight='bold'
            fontSize='60px'
            dy={10}
          >
            {data.length}
          </text>
          <text
            x={137.5}
            y={137.5}
            textAnchor='middle'
            fontFamily='proxima-nova'
            fontWeight='bold'
            fontSize='20px'
            dy={35}
          >
            {centralText}
          </text>
        </svg>
        <div>
          <LegendEl>
            <LegendIcon fill='var(--accent-green)' />
            <LegendText fill='var(--accent-green)'>
              On Track:
              {' '}
              {selectedSDG === 'All SDG Status'
                ? data.filter((d) => d.Status === 'On Track').length
                : data[data.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets.filter((d) => d.Status === 'On Track').length}
              {' '}
              <SubText>
                out of
                {' '}
                {outOfValue}
              </SubText>
            </LegendText>
          </LegendEl>
          <LegendEl>
            <LegendIcon fill='var(--accent-red)' />
            <LegendText fill='var(--accent-red)'>
              Identified Gap:
              {' '}
              {selectedSDG === 'All SDG Status'
                ? data.filter((d) => d.Status === 'Identified Gap').length
                : data[data.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets.filter((d) => d.Status === 'Identified Gap').length}
              {' '}
              <SubText>
                out of
                {' '}
                {outOfValue}
              </SubText>
            </LegendText>
          </LegendEl>
          <LegendEl>
            <LegendIcon fill='var(--accent-yellow)' />
            <LegendText fill='var(--accent-yellow)'>
              For Review:
              {' '}
              {selectedSDG === 'All SDG Status'
                ? data.filter((d) => d.Status === 'For Review').length
                : data[data.findIndex((d) => d.Goal === selectedSDG.split(':')[0])].Targets.filter((d) => d.Status === 'For Review').length}
              {' '}
              <SubText>
                out of
                {' '}
                {outOfValue}
              </SubText>
            </LegendText>
          </LegendEl>
        </div>
      </ContentEl>
    </RootEl>
  );
};
