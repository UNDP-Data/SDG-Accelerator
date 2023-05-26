import { useEffect, useRef, useState } from 'react';
import {
  forceCenter,
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import { Checkbox, Radio } from 'antd';
import { SDG_COLOR_ARRAY } from '../Constants';
import { getSDGIconWoBg } from '../utils/getSDGIcon';
import { PriorityType, StatusType } from '../Types';
import { DownloadImage } from '../utils/DownloadImage';

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
  const [graphOrientation, setGraphOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const bubbleChartRef = useRef<HTMLDivElement>(null);
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
      .force('x', forceX().strength(1).x(graphOrientation === 'horizontal' ? (d: any) => (d.sdg * 15) : 0))
      .force('y', forceY().strength(1).y(graphOrientation === 'vertical' ? (d: any) => (d.sdg * 15) : 0))
      .force('collision', forceCollide().radius((d: any) => (d.importance * 50) + 4))
      .tick(10000)
      .on('end', () => { setNodeData(dataTemp); });
  }, [data, graphOrientation]);
  return (
    <>
      <div className='max-width-1440 margin-top-09 flex-div' style={{ padding: '0 1rem', gap: 'var(--spacing-05)' }}>
        <div style={{
          width: 'calc(25% - 1rem)',
        }}
        >
          <p className='undp-typography italics margin-bottom-05' style={{ fontSize: '1rem', color: 'var(--gray-600)' }}>Click on the icons to view the common words/phrases by SDG</p>
          <p className='undp-typography label margin-bottom-03'>
            Highlight SDGs by priorities
          </p>
          <div className='flex-div flex-vert-align-center margin-bottom-07 flex-wrap'>
            <Checkbox
              className='undp-checkbox'
              checked={highlightSettings.High}
              style={{ marginInlineStart: 0 }}
              onChange={(e) => {
                setHighlightSettings({ ...highlightSettings, High: e.target.checked });
              }}
            >
              High
            </Checkbox>
            <Checkbox
              className='undp-checkbox'
              checked={highlightSettings.Medium}
              style={{ marginInlineStart: 0 }}
              onChange={(e) => {
                setHighlightSettings({ ...highlightSettings, Medium: e.target.checked });
              }}
            >
              Medium
            </Checkbox>
            <Checkbox
              className='undp-checkbox'
              checked={highlightSettings.Low}
              style={{ marginInlineStart: 0 }}
              onChange={(e) => {
                setHighlightSettings({ ...highlightSettings, Low: e.target.checked });
              }}
            >
              Low
            </Checkbox>
          </div>
          <p className='undp-typography label margin-bottom-02'>
            Highlight SDGs by Trends
          </p>
          <div className='margin-bottom-05' style={{ display: 'grid' }}>
            <Checkbox
              className='undp-checkbox'
              checked={highlightSettings['On Track']}
              onChange={(e) => {
                setHighlightSettings({ ...highlightSettings, 'On Track': e.target.checked });
              }}
              style={{ marginInlineStart: 0 }}
            >
              On Track
            </Checkbox>
            <Checkbox
              className='undp-checkbox'
              checked={highlightSettings['For Review']}
              onChange={(e) => {
                setHighlightSettings({ ...highlightSettings, 'For Review': e.target.checked });
              }}
              style={{ marginInlineStart: 0 }}
            >
              For Review
            </Checkbox>
            <Checkbox
              className='undp-checkbox'
              checked={highlightSettings['Identified Gap']}
              onChange={(e) => {
                setHighlightSettings({ ...highlightSettings, 'Identified Gap': e.target.checked });
              }}
              style={{ marginInlineStart: 0 }}
            >
              Off Track
            </Checkbox>
            <Checkbox
              className='undp-checkbox'
              checked={highlightSettings['Gaps NA']}
              onChange={(e) => {
                setHighlightSettings({ ...highlightSettings, 'Gaps NA': e.target.checked });
              }}
              style={{ marginInlineStart: 0 }}
            >
              Trend NA
            </Checkbox>
          </div>
          <div className='margin-bottom-07'>
            <p className='undp-typography label margin-bottom-02'>
              Choose orientation
            </p>
            <Radio.Group value={graphOrientation} onChange={(e) => { setGraphOrientation(e.target.value); }}>
              <Radio className='undp-radio' value='horizontal'>Horizontal</Radio>
              <Radio className='undp-radio' value='vertical'>Vertical</Radio>
            </Radio.Group>
          </div>
          <button
            className='undp-button tertiary-button'
            type='button'
            style={{ color: nodeData === null ? 'var(--gray-400)' : 'var(--blue-600)', padding: 0, textAlign: 'left' }}
            disabled={nodeData === null}
            onClick={() => { if (bubbleChartRef.current) { DownloadImage(bubbleChartRef.current, 'Bubble Chart'); } }}
          >
            Download Bubble Chart
          </button>
        </div>
        {
          nodeData
            ? (
              <div
                style={{
                  width: '100%', display: 'flex', justifyContent: 'center',
                }}
                ref={bubbleChartRef}
              >
                <svg width='calc(75% - 1rem)' style={{ maxWidth: graphOrientation === 'horizontal' ? '75rem' : '40rem', margin: 'auto' }} viewBox={graphOrientation === 'horizontal' ? '0 0 450 250' : '0 0 250 450'}>
                  <g transform={graphOrientation === 'horizontal' ? 'translate(225,125)' : 'translate(125,225)'}>
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
              </div>
            )
            : (
              <div style={{
                width: 'calc(75% - 1rem)', height: '400px', backgroundColor: 'var(--gray-100)', paddingTop: '80px',
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
