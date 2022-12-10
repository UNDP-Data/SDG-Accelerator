import { geoEqualEarth } from 'd3-geo';
import { Select } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { CountryGoalStatusType, SDGSListType } from '../Types';
import World from '../Data/worldMap.json';

import '../style/chipStyle.css';
import '../style/tabStyle.css';
import '../style/selectStyle.css';

const SDGList:SDGSListType[] = require('../Data/SDGGoalList.json');

interface Props {
  data: CountryGoalStatusType[];
  goal: string;
}

export interface HoverDataType {
  country: string
  xPosition: number;
  yPosition: number;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 1000;
  font-size: 0.875rem;
  background-color: var(--gray-300);
  word-wrap: break-word;
  top: ${(props) => props.y - 10}px;
  left: ${(props) => props.x}px;
  transform: translate(-50%, -100%);
  padding: 0.5rem;
`;

const StatCardsContainer = styled.div`
  width: 'calc(33.33% - 0.667rem)';
  min-width: 15rem !important;
  flex-grow: 1;
`;

export const GlobalTrendViz = (props: Props) => {
  const {
    data,
    goal,
  } = props;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);
  const [selectedGoal, setSelectedGoal] = useState('SDG 1');
  const projection = geoEqualEarth().rotate([0, 0]).scale(window.innerWidth > 960 ? 265 : 180).translate([window.innerWidth > 960 ? 550 : 430, window.innerWidth > 960 ? 380 : 280]);
  const svgHeight = window.innerWidth > 960 ? 678 : 500;
  const svgWidth = window.innerWidth > 960 ? 1280 : 960;
  const noOfOnTrack = data.filter((d) => (d.goalStatus.findIndex((el) => `SDG ${el.goal}` === goal) !== -1 ? d.goalStatus[d.goalStatus.findIndex((el) => `SDG ${el.goal}` === goal)].status === 'On Track' : false)).length;
  const noOfIdentifiedGaps = data.filter((d) => (d.goalStatus.findIndex((el) => `SDG ${el.goal}` === goal) !== -1 ? d.goalStatus[d.goalStatus.findIndex((el) => `SDG ${el.goal}` === goal)].status === 'Identified Gap' : false)).length;
  const noOfForReview = data.filter((d) => (d.goalStatus.findIndex((el) => `SDG ${el.goal}` === goal) !== -1 ? d.goalStatus[d.goalStatus.findIndex((el) => `SDG ${el.goal}` === goal)].status === 'For Review' : false)).length;
  return (
    <div className='max-width margin-top-13' style={{ padding: '0rem 1rem' }}>
      <h2 className='undp-typography margin-bottom-05'>Global SDG Trends</h2>
      <p className='undp-typography large-font margin-bottom-09'>
        At midpoint of 2030 Agenda, while progress is possible it is not inevitable. The world is not transitioning to ‘build forward better’ from Covid - on the contrary, developing countries in every region are entering a divergent social, political and economic period with sharp downside risks for the most vulnerable, and regression in gender equality.
      </p>
      <Select
        className='undp-select'
        placeholder='Select Year'
        showSearch
        value={selectedGoal}
        onChange={(value) => { setSelectedGoal(value); }}
        style={{ flexGrow: 1 }}
      >
        {
          SDGList.map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d.Goal}>{`${d.Goal}: ${d['Goal Name']}`}</Select.Option>)
        }
      </Select>
      <div className='flex-div margin-top-07 margin-bottom-07 flex-wrap'>
        <StatCardsContainer>
          <div className='stat-card'>
            <h2 className='green-text'>
              {noOfOnTrack}
            </h2>
            <p>
              No. of countries
              {' '}
              <span className='bold' style={{ color: 'var(--dark-green)' }}>&quot;On Track&quot;</span>
            </p>
          </div>
        </StatCardsContainer>
        <StatCardsContainer>
          <div className='stat-card'>
            <h2 className='yellow-text'>
              {noOfForReview}
            </h2>
            <p>
              No. of countries
              {' '}
              <span className='bold' style={{ color: 'var(--dark-yellow)' }}>&quot;For Review&quot;</span>
            </p>
          </div>
        </StatCardsContainer>
        <StatCardsContainer>
          <div className='stat-card'>
            <h2 className='red-text'>
              {noOfIdentifiedGaps}
            </h2>
            <p>
              No. of countries
              {' '}
              <span className='bold' style={{ color: 'var(--dark-red)' }}>&quot;Identified Gaps&quot;</span>
            </p>
          </div>
        </StatCardsContainer>
      </div>
      <svg width='100%' height='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ backgroundColor: 'var(--gray-100)' }}>
        <g>
          {
            (World as any).features.map((d: any, i: number) => {
              if (d.properties.NAME === 'Antarctica') return null;
              const countryIndx = data.findIndex((el) => el.countryCode === d.properties.ISO3);
              const status = countryIndx === -1
                ? 'Gaps NA'
                : data[countryIndx].goalStatus.findIndex((g) => `SDG ${g.goal}` === goal) !== -1
                  ? data[countryIndx].goalStatus[data[countryIndx].goalStatus.findIndex((g) => `SDG ${g.goal}` === goal)].status || 'Gaps NA'
                  : 'Gaps Na';
              return (
                <g
                  key={i}
                  onMouseEnter={(event) => {
                    setHoverData({
                      country: d.properties.NAME,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseMove={(event) => {
                    setHoverData({
                      country: d.properties.NAME,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                >
                  {
                    d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: any) => {
                      let masterPath = '';
                      el.forEach((geo: number[][]) => {
                        let path = ' M';
                        geo.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [number, number];
                          if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        masterPath += path;
                      });
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          strokeWidth={1}
                          style={{
                            fill: status === 'On Track' ? 'var(--dark-green)' : status === 'For Review' ? 'var(--dark-yellow)' : status === 'Identified Gap' ? 'var(--dark-red)' : 'var(--gray-400)',
                            stroke: 'var(--white)',
                          }}
                        />
                      );
                    }) : d.geometry.coordinates.map((el:any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [number, number];
                        if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      return (
                        <path
                          key={j}
                          d={path}
                          strokeWidth={1}
                          style={{
                            fill: status === 'On Track' ? 'var(--dark-green)' : status === 'For Review' ? 'var(--dark-yellow)' : status === 'Identified Gap' ? 'var(--dark-red)' : 'var(--gray-400)',
                            stroke: 'var(--white)',
                          }}
                        />
                      );
                    })
                  }
                </g>
              );
            })
          }
          {
            hoverData ? (
              (World as any).features.filter((d: any) => d.properties.NAME === hoverData.country).map((d: any, i: number) => (
                <g
                  key={i}
                >
                  {
                      d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: any) => {
                        let masterPath = '';
                        el.forEach((geo: number[][]) => {
                          let path = ' M';
                          geo.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [number, number];
                            if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          masterPath += path;
                        });
                        return (
                          <path
                            key={j}
                            d={masterPath}
                            strokeWidth={2}
                            style={{
                              fill: 'none',
                              stroke: 'var(--gray-700)',
                            }}
                          />
                        );
                      }) : d.geometry.coordinates.map((el:any, j: number) => {
                        let path = 'M';
                        el.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [number, number];
                          if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        return (
                          <path
                            key={j}
                            d={path}
                            strokeWidth={2}
                            style={{
                              fill: 'none',
                              stroke: 'var(--gray-700)',
                            }}
                          />
                        );
                      })
                    }
                </g>
              ))
            ) : null
          }
        </g>
      </svg>
      {
        hoverData
          ? (
            <TooltipEl x={hoverData.xPosition} y={hoverData.yPosition}>
              {hoverData.country}
            </TooltipEl>
          )
          : null
      }
    </div>
  );
};
