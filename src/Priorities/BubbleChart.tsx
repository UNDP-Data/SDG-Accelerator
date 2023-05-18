import { useEffect, useState } from 'react';
import {
  forceCenter,
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import { Checkbox } from 'antd';
import { SDG_COLOR_ARRAY } from '../Constants';
import { getSDGIconWoBg } from '../utils/getSDGIcon';
import { PriorityType, StatusType } from '../Types';

interface Props {
  data: any;
  // eslint-disable-next-line no-unused-vars
  setSelectedSDG: (_d: any) => void;
}

export const BubbleChart = (props: Props) => {
  const {
    data,
    setSelectedSDG,
  } = props;
  const [nodeData, setNodeData] = useState<any>(null);
  const [highlightSettings, setHighlightSettings] = useState({
    High: true,
    Low: false,
    Medium: true,
    'On Track': true,
    'For Review': true,
    'Identified Gap': true,
    'Gaps NA': true,
  });
  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(data)).filter((d: any) => d.importance !== 0);
    forceSimulation(dataTemp)
      .force('charge', forceManyBody().strength(2.25))
      .force('center', forceCenter())
      .force('x', forceX().strength(1).x((d: any) => (d.sdg * 15)))
      .force('y', forceY().strength(1).y(0))
      .force('collision', forceCollide().radius((d: any) => (d.importance * 50) + 4))
      .tick(10000)
      .on('end', () => { setNodeData(dataTemp); });
  }, [data]);
  return (
    <>
      <div className='max-width-1440 margin-top-09' style={{ padding: '0 1rem' }}>
        <p className='undp-typography label margin-bottom-03'>
          Highlight by priorities and trends
        </p>
        <div className='flex-div flex-vert-align-center margin-bottom-09'>
          <Checkbox
            className='undp-checkbox'
            checked={highlightSettings.High}
            onChange={(e) => {
              setHighlightSettings({ ...highlightSettings, High: e.target.checked });
            }}
          >
            High Priority
          </Checkbox>
          <Checkbox
            className='undp-checkbox'
            checked={highlightSettings.Medium}
            onChange={(e) => {
              setHighlightSettings({ ...highlightSettings, Medium: e.target.checked });
            }}
          >
            Medium Priority
          </Checkbox>
          <Checkbox
            className='undp-checkbox'
            checked={highlightSettings.Low}
            onChange={(e) => {
              setHighlightSettings({ ...highlightSettings, Low: e.target.checked });
            }}
          >
            Low Priority
          </Checkbox>
          <Checkbox
            className='undp-checkbox'
            checked={highlightSettings['On Track']}
            onChange={(e) => {
              setHighlightSettings({ ...highlightSettings, 'On Track': e.target.checked });
            }}
          >
            On Track
          </Checkbox>
          <Checkbox
            className='undp-checkbox'
            checked={highlightSettings['For Review']}
            onChange={(e) => {
              setHighlightSettings({ ...highlightSettings, 'For Review': e.target.checked });
            }}
          >
            For Review
          </Checkbox>
          <Checkbox
            className='undp-checkbox'
            checked={highlightSettings['Identified Gap']}
            onChange={(e) => {
              setHighlightSettings({ ...highlightSettings, 'Identified Gap': e.target.checked });
            }}
          >
            Identified Gap
          </Checkbox>
          <Checkbox
            className='undp-checkbox'
            checked={highlightSettings['Gaps NA']}
            onChange={(e) => {
              setHighlightSettings({ ...highlightSettings, 'Gaps NA': e.target.checked });
            }}
          >
            Gaps NA
          </Checkbox>
        </div>
        {
          nodeData
            ? (
              <svg width='calc(100% - 32px)' viewBox='0 0 720 200'>
                <g transform='translate(360,100)'>
                  {
                    nodeData.map((d: any, i: number) => (
                      <g
                        key={i}
                        transform={`translate(${d.x},${d.y})`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => { setSelectedSDG(d); }}
                        opacity={highlightSettings[d.category as PriorityType] && highlightSettings[d.status as StatusType] ? 1 : 0.4}
                      >
                        <circle
                          cx={0}
                          cy={0}
                          r={d.importance * 50}
                          fill={SDG_COLOR_ARRAY[d.sdg - 1]}
                        />
                        {
                          d.importance * 50 < 10 ? null
                            : (
                              <g transform={`translate(${0 - d.importance * 35},${0 - d.importance * 35})`}>
                                {getSDGIconWoBg(`SDG ${d.sdg}`, d.importance * 70)}
                              </g>
                            )
                        }
                      </g>
                    ))
                  }
                </g>
              </svg>
            )
            : (
              <div style={{
                width: '100%', height: '200px', backgroundColor: 'var(--gray-100)', paddingTop: '80px',
              }}
              >
                <div className='undp-loader' style={{ margin: 'auto' }} />
              </div>
            )
        }
      </div>
    </>
  );
};
