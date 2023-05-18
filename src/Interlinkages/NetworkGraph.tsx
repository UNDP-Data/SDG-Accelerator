import { Select } from 'antd';
import {
  forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation,
} from 'd3-force';
import uniq from 'lodash.uniq';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LinkageDataType, TargetStatusWithDetailsType } from '../Types';

interface Props {
  data: TargetStatusWithDetailsType[];
  linkageData: LinkageDataType[];
}

interface TargetProps {
  id: string;
  description: string;
  status: 'For Review' | 'Identified Gap';
  sdg: number;
}

interface SynergiesLinkProps {
  source: string;
  target: string;
  value: number;
}

interface WidthProps {
  width: string;
}

const GraphContainer = styled.div<WidthProps>`
  width: ${(props) => props.width};
  @media (max-width: 960px) {
    width: 100%;
  }
`;

export const NetworkGraph = (props: Props) => {
  const {
    data,
    linkageData,
  } = props;
  const [networkData, setNetworkData] = useState<any>(null);
  const [hoverData, setHoverData] = useState<any>(null);
  const [selectedTargetData, setSelectedTargetData] = useState<any>(null);
  const width = 720;
  const height = 400;
  const radiusScale = 4;
  const targetStatusForSelect: TargetProps[] = data.filter((d) => d.status === 'For Review' || d.status === 'Identified Gap').map((d) => ({
    id: d.target,
    description: d.description,
    status: d.status as 'For Review' | 'Identified Gap',
    sdg: parseInt(d.goal, 10),
  }));
  useEffect(() => {
    setNetworkData(null);
    const targetStatus: TargetProps[] = data.filter((d) => d.status === 'For Review' || d.status === 'Identified Gap').map((d) => ({
      id: d.target,
      description: d.description,
      status: d.status as 'For Review' | 'Identified Gap',
      sdg: parseInt(d.goal, 10),
    }));
    const linkageDataFiltered = linkageData.map((d) => {
      const synergies = uniq(d.synergies.map((el) => `Target ${el}`).filter((el) => targetStatus.findIndex((el1) => el1.id === el) !== -1));
      const tradeOffs = uniq(d.tradeOffs.map((el) => `Target ${el}`).filter((el) => targetStatus.findIndex((el1) => el1.id === el) !== -1));
      return ({
        id: d.id,
        synergies,
        tradeOffs,
      });
    }).filter((d) => targetStatus.findIndex((el) => el.id === d.id) !== -1);
    const linkageDataFormattedAndFiltered = linkageDataFiltered.map((d) => ({
      ...d,
      description: targetStatus[targetStatus.findIndex((el) => el.id === d.id)].description,
      status: targetStatus[targetStatus.findIndex((el) => el.id === d.id)].status,
      sdg: targetStatus[targetStatus.findIndex((el) => el.id === d.id)].sdg,
    }));
    const synergyLinks: SynergiesLinkProps[] = [];
    linkageDataFormattedAndFiltered.forEach((d) => {
      const source = d.id;
      d.synergies.forEach((el) => {
        const target = el;
        const value = 1;
        synergyLinks.push({
          target,
          source,
          value,
        });
      });
    });
    const synergyLinksFiltered: SynergiesLinkProps[] = [];
    synergyLinks.forEach((d, i) => {
      const { target } = d;
      const targetIndx = synergyLinks.findIndex((el) => el.source === target);
      // eslint-disable-next-line no-console
      if (targetIndx === -1) console.error(d);
      if (targetIndx > i) synergyLinksFiltered.push(d);
    });
    const graphData = {
      nodes: linkageDataFormattedAndFiltered,
      links: synergyLinksFiltered,
    };
    const boxForce = () => {
      for (let i = 0; i < graphData.nodes.length; i += 1) {
        const currNode: any = graphData.nodes[i];
        const radius = (graphData.nodes[i].synergies.length + 1) * radiusScale;
        currNode.x = Math.max(radius, Math.min(width - radius, currNode.x));
        currNode.y = Math.max(radius, Math.min(height - radius, currNode.y));
      }
    };
    const simulation = forceSimulation(graphData.nodes as any)
      .alpha(1)
      .force('link', forceLink(graphData.links).id((d: any) => d.id).strength(1))
      .force('charge', forceManyBody().strength(-10))
      .force('collide', forceCollide().radius((d: any) => (d.synergies.length + 1) * radiusScale + 15))
      .force('center', forceCenter(width / 2, height / 2))
      .force('boxForce', boxForce)
      .on('end', () => { setNetworkData(graphData); });
    (simulation.force('link') as any).links(graphData.links);
  }, [data]);
  return (
    <>
      <div className='flex-div flex-space-between flex-wrap'>
        <GraphContainer width='calc(33.33% - 1rem)'>
          <div className='flex-div flex-space-between flex-vert-align-center margin-bottom-03'>
            <h3 className='undp-typography bold margin-bottom-00'>Network Approach for Linkages</h3>
          </div>
          <p className='undp-typography small-font'>
            See the interlinkages through a systems lens, with targets that are Off-Track and For-Review and how they are interconnected, identified.
          </p>
          <div className='margin-top-07'>
            <p className='label undp-typography'>Select Target</p>
            <Select
              className='undp-select'
              placeholder='Select Target'
              value={selectedTargetData ? selectedTargetData.id : null}
              allowClear
              clearIcon={<div className='clearIcon' />}
              onChange={(value) => {
                setSelectedTargetData(networkData.nodes[networkData.nodes.findIndex((d: any) => d.id === value)]);
              }}
            >
              {
                targetStatusForSelect.map((d: any, i: number) => <Select.Option key={i} className='undp-select-option' value={d.id}>{d.id}</Select.Option>)
              }
            </Select>
          </div>
          {
            hoverData ? (
              <p className='margin-top-07 small-font'>
                <span className='bold'>{hoverData.id}</span>
                <br />
                {hoverData.description}
              </p>
            ) : selectedTargetData ? (
              <p className='margin-top-07 small-font'>
                <span className='bold'>{selectedTargetData.id}</span>
                <br />
                {selectedTargetData.description}
              </p>
            ) : null
          }
        </GraphContainer>
        {
          networkData
            ? (
              <GraphContainer width='calc(66.67% - 1rem)'>
                <svg width='100%' viewBox={`0 0 ${width + 40} ${height + 40}`}>
                  <rect
                    x={0}
                    y={0}
                    width={width + 40}
                    height={height + 40}
                    fill='#fff'
                    opacity={0}
                    onClick={() => { setSelectedTargetData(null); }}
                  />
                  <g transform='translate(20, 20)'>
                    {
                      networkData.links.map((d: any, i: any) => (
                        <g
                          key={i}
                          opacity={
                            hoverData
                              ? hoverData.id === d.source.id || hoverData.id === d.target.id
                                ? 1
                                : 0.25
                              : selectedTargetData
                                ? selectedTargetData.id === d.source.id || selectedTargetData.id === d.target.id
                                  ? 1
                                  : 0.25
                                : 1
                          }
                        >
                          <line
                            x1={d.source.x}
                            x2={d.target.x}
                            y1={d.source.y}
                            y2={d.target.y}
                            stroke='#D4D6D8'
                            strokeWidth={1}
                          />
                        </g>
                      ))
                    }
                    {
                      networkData.nodes.map((d: any, i: any) => (
                        <g
                          transform={`translate(${Math.max((d.synergies.length + 1) * radiusScale, Math.min(width - (d.synergies.length + 1) * radiusScale, d.x))}, ${d.y})`}
                          key={i}
                          onMouseEnter={() => { setHoverData(d); }}
                          onMouseLeave={() => { setHoverData(null); }}
                          onClick={() => {
                            if (selectedTargetData) {
                              if (selectedTargetData.id === d.id) setSelectedTargetData(null);
                              else setSelectedTargetData(d);
                            }
                            setSelectedTargetData(d);
                          }}
                          opacity={
                            hoverData
                              ? hoverData.id === d.id || hoverData.synergies.indexOf(d.id) !== -1
                                ? 1
                                : 0.25
                              : selectedTargetData
                                ? selectedTargetData.id === d.id || selectedTargetData.synergies.indexOf(d.id) !== -1
                                  ? 1
                                  : 0.25
                                : 1
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <circle
                            cx={0}
                            cy={0}
                            opacity={1}
                            r={(d.synergies.length + 1) * radiusScale}
                            style={{ fill: d.status === 'For Review' ? 'var(--light-yellow)' : 'var(--light-red)' }}
                          />
                          {
                            d.synergies.length > 0
                              ? (
                                <text
                                  x={0}
                                  y={0}
                                  fontSize={10}
                                  color='#fff'
                                  fontWeight='bold'
                                  textAnchor='middle'
                                  dy={3}
                                >
                                  {d.id.split(' ')[1]}
                                </text>
                              ) : null
                          }
                        </g>
                      ))
                    }
                  </g>
                </svg>
              </GraphContainer>
            )
            : (
              <GraphContainer
                width='calc(66.67% - 1rem)'
                style={{
                  height: '400px', backgroundColor: 'var(--gray-100)', paddingTop: '150px',
                }}
              >
                <div className='undp-loader' style={{ margin: 'auto' }} />
              </GraphContainer>
            )
        }
      </div>
    </>
  );
};
