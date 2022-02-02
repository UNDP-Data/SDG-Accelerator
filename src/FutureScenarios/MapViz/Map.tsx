import { useEffect, useRef, useState } from 'react';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import styled from 'styled-components';
import world from '../../Data/worldMap.json';
import { getValue } from '../../utils/getValue';
import { COLORSCALE } from '../../Constants';
import { HoverDataType, CountryListTypeSDGPush } from '../../Types';

interface Props {
  year: number;
  indicator: string;
  data: CountryListTypeSDGPush[];
}

const RootEl = styled.div`
  background-color: var(--black-100);
  position: relative;
  margin-top: 2rem;
`;

interface MarginProps {
  marginTop: string;
}

const ColorScaleEl = styled.div<MarginProps>`
  margin-top: ${(props) => props.marginTop};
  padding: 1rem 1rem 0 1rem;
  border-radius: 0.2rem;
  box-shadow: var(--shadow);
  background-color: rgba(255,255,255,0.3);
  z-index: 10;
  position: relative;
  margin-right: 1rem;
  float:right;
`;

const FlexDiv = styled.div`
  display: flex;
  margin-top: 1rem;
`;

interface ColorKeySquareProps {
  fill: string;
}
const ColorKeyRect = styled.div<ColorKeySquareProps>`
  width: 4rem;
  height: 1rem;
  background-color: ${(props) => props.fill};
`;
interface ColorKeyElProps {
  flex?: boolean;
}

const ColorKeyEl = styled.div<ColorKeyElProps>`
  margin: ${(props) => (props.flex ? '0 1rem' : '0')};
  font-size: 1.2rem;
  color: var(--navy);
  display: ${(props) => (props.flex ? 'flex' : 'inline')};
  align-items: center;
  width: fit-content;
  justify-content: flex-start;
`;

const KeyValue = styled.div`
  text-align: center;
  font-size: 1rem;
`;

const GraphDiv = styled.div`
  display: flex;
`;

const DivHalf = styled.div`
  width: calc(50% - 1px);
  &:first-of-type {
    border-right: 1px solid var(--black-500);
  }
  &:last-of-type {
    border-left: 1px solid var(--black-500);
  }
`;

const MapTitle = styled.div`
  background-color: var(--black-400);
  font-size: 1.6rem;
  font-weight: bold;
  font-style: italic;
  padding: 0.5rem 1rem;
  text-align: center;
`;

export const Map = (props: Props) => {
  const {
    year,
    data,
    indicator,
  } = props;
  const width = 1280;
  const height = 720;
  const map: any = world;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);
  const projection = geoEqualEarth().rotate([0, 0]).scale(265).translate([610, 380]);
  const mapSvgRight = useRef<SVGSVGElement>(null);
  const mapGRight = useRef<SVGGElement>(null);
  const mapSvgLeft = useRef<SVGSVGElement>(null);
  const mapGLeft = useRef<SVGGElement>(null);
  const GraphRef = useRef(null);
  const colorScale = scaleThreshold<number, string>().domain([20, 40, 60, 80]).range(COLORSCALE);
  const colorScaleValue = ['<20', '20-40', '40-60', '60-80', '80+'];
  useEffect(() => {
    const mapGSelectLeft = select(mapGLeft.current);
    const mapSvgSelectLeft = select(mapSvgLeft.current);
    const mapGSelectRight = select(mapGRight.current);
    const mapSvgSelectRight = select(mapSvgRight.current);
    const zoomBehaviour = zoom()
      .scaleExtent([0.8, 6])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', ({ transform }) => {
        mapGSelectLeft.attr('transform', transform);
        mapGSelectRight.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelectLeft.call(zoomBehaviour as any);
    mapSvgSelectRight.call(zoomBehaviour as any);
  }, [height, width]);

  return (
    <RootEl>
      <>
        <GraphDiv id='graph-node' ref={GraphRef}>
          <DivHalf>
            <MapTitle>Without SDG Push</MapTitle>
            <svg width='100%' viewBox={`0 0 ${width} ${height}`} ref={mapSvgLeft}>
              <g ref={mapGLeft}>
                {
                map.features.map((d: any, i: any) => {
                  if (d.properties.NAME === 'Antarctica') return null;
                  return (
                    <g
                      key={i}
                      onMouseEnter={(event) => {
                        setHoverData({
                          country: d.properties.NAME,
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          withSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withSDGPush,
                          withoutSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withoutSDGPush,
                        });
                      }}
                      onMouseMove={(event) => {
                        setHoverData({
                          country: d.properties.NAME,
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          withSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withSDGPush,
                          withoutSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withoutSDGPush,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoverData(undefined);
                      }}
                    >
                      {
                      d.properties.NAME === 'Antarctica' ? null
                        : d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: any) => {
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
                              opacity={hoverData
                                ? hoverData.country === d.properties.NAME ? 1 : 0.2 : 1}
                              d={masterPath}
                              className='streetPath'
                              stroke={!getValue(d.properties.ISO3, year, indicator, data) ? '#DADADA' : '#FFF'}
                              strokeWidth={0.5}
                              fill={!getValue(d.properties.ISO3, year, indicator, data) ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, year, indicator, data)?.withoutSDGPush as number)}
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
                              opacity={hoverData
                                ? hoverData.country === d.properties.NAME ? 1 : 0.2 : 1}
                              d={path}
                              className='streetPath'
                              stroke={!getValue(d.properties.ISO3, year, indicator, data) ? '#DADADA' : '#FFF'}
                              strokeWidth={0.5}
                              fill={!getValue(d.properties.ISO3, year, indicator, data) ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, year, indicator, data)?.withoutSDGPush as number)}
                            />
                          );
                        })
                    }
                    </g>
                  );
                })
              }
              </g>
            </svg>
          </DivHalf>
          <DivHalf>
            <MapTitle>With SDG Push</MapTitle>
            <svg width='100%' viewBox={`0 0 ${width} ${height}`} ref={mapSvgRight}>
              <g ref={mapGRight}>
                {
                map.features.map((d: any, i: any) => {
                  if (d.properties.NAME === 'Antarctica') return null;
                  return (
                    <g
                      key={i}
                      onMouseEnter={(event) => {
                        setHoverData({
                          country: d.properties.NAME,
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          withSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withSDGPush,
                          withoutSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withoutSDGPush,
                        });
                      }}
                      onMouseMove={(event) => {
                        setHoverData({
                          country: d.properties.NAME,
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                          year,
                          withSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withSDGPush,
                          withoutSDGPush: getValue(d.properties.ISO3, year, indicator, data)?.withoutSDGPush,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoverData(undefined);
                      }}
                    >
                      {
                      d.properties.NAME === 'Antarctica' ? null
                        : d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: any) => {
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
                              opacity={hoverData
                                ? hoverData.country === d.properties.NAME ? 1 : 0.2 : 1}
                              d={masterPath}
                              className='streetPath'
                              stroke={!getValue(d.properties.ISO3, year, indicator, data) ? '#DADADA' : '#FFF'}
                              strokeWidth={0.5}
                              fill={!getValue(d.properties.ISO3, year, indicator, data) ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, year, indicator, data)?.withSDGPush as number)}
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
                              opacity={hoverData
                                ? hoverData.country === d.properties.NAME ? 1 : 0.2 : 1}
                              d={path}
                              className='streetPath'
                              stroke={!getValue(d.properties.ISO3, year, indicator, data) ? '#DADADA' : '#FFF'}
                              strokeWidth={0.5}
                              fill={!getValue(d.properties.ISO3, year, indicator, data) ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, year, indicator, data)?.withSDGPush as number)}
                            />
                          );
                        })
                    }
                    </g>
                  );
                })
              }
              </g>
            </svg>
          </DivHalf>
        </GraphDiv>
      </>

      <ColorScaleEl marginTop='-6rem'>
        <FlexDiv>
          {
            COLORSCALE.map((d, i) => (
              <ColorKeyEl key={i}>
                <ColorKeyRect
                  fill={d}
                />
                <KeyValue>
                  {colorScaleValue[i]}
                </KeyValue>
              </ColorKeyEl>
            ))
          }
        </FlexDiv>
      </ColorScaleEl>
    </RootEl>
  );
};
