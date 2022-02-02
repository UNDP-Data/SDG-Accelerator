import { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import styled from 'styled-components';
import world from '../../Data/worldMap.json';
import { CountryListType, HoverBasic } from '../../Types';
import { BasicHoverTooltip } from '../../Components/BasicHoverTooltip';

interface Props {
  data: CountryListType[];
  selectedOption: string;
}

interface DataListType {
  key: string;
  status: 'On Track' | 'Identified Gap' | 'For Review';
}

interface CountryDataListType {
  country: string;
  'ISO-3': string;
  data: DataListType[];
}

const FlexDiv = styled.div`
  display: flex;
`;

const LeftColumn = styled.div`
  width: 30%;
`;

const RowTitleEl = styled.div`
  display: flex;
  margin: 2rem 0 ;
  align-items: center;
`;

interface ColorProps {
  fill: string;
}

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

export const Map = (props: Props) => {
  const {
    data,
    selectedOption,
  } = props;
  const width = 1280;
  const height = 720;
  const GraphRef = useRef(null);
  const [hoverData, setHoverData] = useState<HoverBasic | undefined>(undefined);
  const map: any = world;
  const projection = geoEqualEarth().rotate([0, 0]).scale(265).translate([610, 380]);
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 3])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [height, width]);

  const countryList: CountryDataListType[] = [];

  data.forEach((d) => {
    const dataList: DataListType[] = [];
    d['SDG Gap Data'].forEach((goal) => {
      dataList.push({
        key: goal.Goal,
        status: goal.Status,
      });
      goal.Targets.forEach((target) => {
        dataList.push({
          key: target.Target,
          status: target.Status,
        });
        target.Indicators.forEach((indicator) => {
          dataList.push({
            key: indicator.Indicator,
            status: indicator.Status,
          });
        });
      });
    });
    countryList.push({
      country: d['Country or Area'],
      'ISO-3': d['Alpha-3 code-1'],
      data: dataList,
    });
  });

  return (
    <>
      <FlexDiv>
        <LeftColumn>
          <RowTitleEl>
            <LegendIcon fill='var(--accent-green)' />
            <LegendText fill='var(--accent-green)'>
              On Track:
              {' '}
              {countryList.filter((d) => d.data[d.data.findIndex((el) => el.key === selectedOption.split(':')[0])].status === 'On Track').length}
              {' '}
              <SubText>
                countries out of
                {' '}
                {countryList.length}
              </SubText>
            </LegendText>
          </RowTitleEl>
          <RowTitleEl>
            <LegendIcon fill='var(--accent-red)' />
            <LegendText fill='var(--accent-red)'>
              Identified Gap:
              {' '}
              {countryList.filter((d) => d.data[d.data.findIndex((el) => el.key === selectedOption.split(':')[0])].status === 'Identified Gap').length}
              {' '}
              <SubText>
                countries out of
                {' '}
                {countryList.length}
              </SubText>
            </LegendText>
          </RowTitleEl>
          <RowTitleEl>
            <LegendIcon fill='var(--accent-yellow)' />
            <LegendText fill='var(--accent-yellow)'>
              For Review:
              {' '}
              {countryList.filter((d) => d.data[d.data.findIndex((el) => el.key === selectedOption.split(':')[0])].status === 'For Review').length}
              {' '}
              <SubText>
                countries out of
                {' '}
                {countryList.length}
              </SubText>
            </LegendText>
          </RowTitleEl>
        </LeftColumn>
        <div ref={GraphRef} id='graph-node' style={{ flexGrow: 1 }}>
          <svg style={{ width: '100%' }} viewBox={`0 0 ${width} ${height}`} ref={mapSvg}>
            <g ref={mapG}>
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
                        d.properties.NAME === 'Antarctica' ? null
                          : d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el: any, j: any) => {
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
                                stroke='#FAFAFA'
                                strokeWidth={0.5}
                                fill={
                                  countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3) === -1
                                    ? '#fafafa'
                                    : countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data[countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data.findIndex((d1) => d1.key === selectedOption.split(':')[0])].status === 'On Track'
                                      ? '#59BA47' : countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data[countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data.findIndex((d1) => d1.key === selectedOption.split(':')[0])].status === 'Identified Gap'
                                        ? '#D12800' : '#FBC412'
                                  }
                              />
                            );
                          }) : d.geometry.coordinates.map((el: any, j: number) => {
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
                                stroke='#FAFAFA'
                                strokeWidth={0.5}
                                fill={
                                  countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3) === -1
                                    ? '#fafafa'
                                    : countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data[countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data.findIndex((d1) => d1.key === selectedOption.split(':')[0])].status === 'On Track'
                                      ? '#59BA47' : countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data[countryList[countryList.findIndex((country) => country['ISO-3'] === d.properties.ISO3)].data.findIndex((d1) => d1.key === selectedOption.split(':')[0])].status === 'Identified Gap'
                                        ? '#D12800' : '#FBC412'
                                  }
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
          {
            hoverData
              ? (
                <BasicHoverTooltip
                  data={hoverData}
                />
              )
              : null
          }
        </div>
      </FlexDiv>
    </>
  );
};
