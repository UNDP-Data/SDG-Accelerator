import styled from 'styled-components';
import { line, curveMonotoneX } from 'd3-shape';
import { format } from 'd3-format';
import max from 'lodash.max';
import min from 'lodash.min';
import uniqBy from 'lodash.uniqby';
import { scaleLinear } from 'd3-scale';
import meanBy from 'lodash.meanby';
import { KEYSTOAVOID } from '../../Constants';
import { getYearsAndValues } from '../../utils/getYearsAndValues';
import { getCAGR } from '../../utils/getCAGR';

interface Props {
  data: any;
}

interface yearAndValueDataType {
  baseYear: number;
  baseValue: number;
  finalYear: number;
  finalValue: number;
}

const RootEl = styled.div`
  margin: 1rem 0;
  padding: 2rem;
  width: calc(50% - 1rem);
  background-color: var(--black-100);
`;

const TitleEl = styled.div`
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
  font-weight: bold;
`;

const SubNote = styled.div`
  font-size: 1.4rem;
  display: flex;
  flex-wrap: wrap;
  div {
    margin-right: 1rem;
    padding: 0.3rem 1rem;
    background-color: var(--black-300);
    border-radius: 0.2rem;
  }
`;

interface StatusTagProps {
  status: string;
}

const StatusTag = styled.div<StatusTagProps>`
  font-size: 1.6rem;
  display: flex;
  width: fit-content;
  font-weight: 500;
  border-radius: 5rem;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background-color: ${(props) => (props.status === 'Fair progress but acceleration needed'
    ? 'var(--accent-yellow)'
    : props.status === 'Limited or No Progress'
      ? 'var(--accent-orange)'
      : props.status === 'Deterioration'
        ? 'var(--accent-red)'
        : props.status === 'Insufficient Data'
          ? 'var(--black-500)'
          : 'var(--accent-green)')};
  color: ${(props) => (props.status === 'Fair progress but acceleration needed' || props.status === 'Insufficient Data' ? 'var(--black-700)' : 'var(--white)')};
`;

const getStatus = (yearsAndValues: yearAndValueDataType, targetValue: number, type: string) => {
  if (type === 'min') if (yearsAndValues.finalValue < targetValue) return 'Target Achieved';
  if (type === 'max') if (yearsAndValues.finalValue > targetValue) return 'Target Achieved';
  const CARGA = getCAGR(yearsAndValues.finalYear, yearsAndValues.baseYear, yearsAndValues.finalValue, yearsAndValues.baseValue);
  const CARGT = getCAGR(2030, yearsAndValues.baseYear, targetValue, yearsAndValues.baseValue);
  if (CARGA === null || CARGT === null) return 'Insufficient Data';
  const CR = CARGA / CARGT;
  if (Number.isNaN(CR)) return 'Insufficient Data';
  if (CR >= 0.95) return 'On Track';
  if (CR >= 0.5 && CR < 0.95) return 'Fair progress but acceleration needed';
  if (CR >= -0.1 && CR < 0.5) return 'Limited or No Progress';
  return 'Deterioration';
};

export const LineChart = (props: Props) => {
  const { data } = props;
  const svgWidth = 550;
  const svgHeight = 365;
  const margin = {
    top: 20,
    bottom: 50,
    left: 20,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const values = uniqBy(data.values, 'year').filter((d: any) => d.value !== null);
  const targetValue = data.targetfor2030 !== 0 ? data.targetfor2030 : null;

  const yearsAndValues = getYearsAndValues(values as any);
  const status = data.indicator === '8.1.1'
    ? meanBy(data.values.filter((val: any) => val.year > 2014), 'value') > 2 ? 'On Track'
      : meanBy(data.values.filter((val: any) => val.year > 2014), 'value') > 1.5 ? 'Fair progress but acceleration needed'
        : meanBy(data.values.filter((val: any) => val.year > 2014), 'value') > 1 ? 'Limited or No Progress'
          : 'Deterioration'
    : targetValue === null
      ? undefined
      : yearsAndValues === null
        ? 'Insufficient Data'
        : getStatus(yearsAndValues, targetValue.targetValue, targetValue.type);

  const minParam = min(values.map((d: any) => d.value)) ? min(values.map((d: any) => d.value)) as number > 0 ? 0 : min(values.map((d: any) => d.value)) : 0;

  const maxParam = max(values.map((d: any) => d.value)) ? max(values.map((d: any) => d.value)) : 0;

  const minYearFiltered: number = min(values.map((d: any) => d.year)) ? min(values.map((d: any) => d.year)) as number : 2000;
  const maxYearFiltered: number = max(values.map((d: any) => d.year)) ? max(values.map((d: any) => d.year)) as number : 2020;
  const x = scaleLinear().domain([minYearFiltered, maxYearFiltered]).range([0, graphWidth]);
  const y = scaleLinear().domain([minParam as number, maxParam as number]).range([graphHeight, 0]).nice();
  const lineShape1 = line()
    .defined((d: any) => d.value !== null || d.value !== undefined)
    .x((d: any) => x(d.year))
    .y((d: any) => (d.value === '>95' ? y(95) : y(d.value)))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(maxYearFiltered - minYearFiltered > 10 ? 10 : maxYearFiltered - minYearFiltered === 0 ? 1 : maxYearFiltered - minYearFiltered);

  return (
    <RootEl>
      <TitleEl>{data.seriesDescription}</TitleEl>
      <SubNote>
        {
          Object.keys(data).map((d) => {
            if (KEYSTOAVOID.indexOf(d) !== -1) return null;
            return (
              <div>
                {d}
                :
                {' '}
                <span className='bold'>{data[d]}</span>
              </div>
            );
          })
        }
      </SubNote>
      {
        status
          ? (
            <StatusTag status={status}>
              {status}
            </StatusTag>
          ) : null
      }
      {
        values.length === 0 ? 'No Data Avalaiable'
          : (
            <>
              <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                  <line
                    y1={y(0)}
                    y2={y(0)}
                    x1={0}
                    x2={graphWidth + 15}
                    stroke='#212121'
                    strokeWidth={1}
                  />
                  <text
                    x={0}
                    y={y(0)}
                    fill='#666'
                    textAnchor='start'
                    fontSize={12}
                    dy={-3}
                  >
                    0
                  </text>
                  <g>
                    {
                      yTicks.map((d, i) => (
                        <g key={i}>
                          <line
                            y1={y(d)}
                            y2={y(d)}
                            x1={-15}
                            x2={graphWidth}
                            stroke='#AAA'
                            strokeWidth={1}
                            strokeDasharray='4,8'
                            opacity={d === 0 ? 0 : 1}
                          />
                          <text
                            x={0}
                            y={y(d)}
                            fill='#666'
                            textAnchor='start'
                            fontSize={12}
                            dy={-3}
                            opacity={d === 0 ? 0 : 1}
                          >
                            {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                          </text>
                        </g>
                      ))
                    }
                  </g>
                  <g>
                    {
                      xTicks.map((d, i) => (
                        <g key={i}>
                          <text
                            y={graphHeight}
                            x={x(d)}
                            fill='#AAA'
                            textAnchor='middle'
                            fontSize={12}
                            dy={15}
                          >
                            {d}
                          </text>
                        </g>
                      ))
                    }
                  </g>
                  <g>
                    <path d={lineShape1(uniqBy(data.values, 'year') as any) as string} fill='none' stroke='#0969FA' strokeWidth={2} />
                    {
                      values.map((d: any, i: number) => (
                        <g
                          key={i}
                        >
                          <circle
                            cx={x(d.year)}
                            cy={y(d.value)}
                            r={4}
                            fill='#0969FA'
                          />
                          <text
                            x={x(d.year)}
                            y={y(d.value)}
                            dy={-8}
                            fontSize={12}
                            textAnchor='middle'
                            strokeWidth={0.25}
                            stroke='#fff'
                            fill='#0969FA'
                            fontWeight='bold'
                          >
                            {d.value < 1 ? d.value : format('.2s')(d.value)}
                          </text>
                        </g>
                      ))

                    }
                  </g>
                </g>
              </svg>
            </>
          )
      }
    </RootEl>
  );
};
