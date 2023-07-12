import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { selectAll } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import ReactFlow, { Handle, Position } from 'reactflow';
import { SummaryReportDataType } from '../../../Types';
import 'reactflow/dist/style.css';

import IMAGES from '../../../img/images';
import { getSDGIcon } from '../../../utils/getSDGIcon';

interface Props {
  reportData: SummaryReportDataType;
}

interface BgInterface {
  bgImage: string;
}

const SectionEl = styled.div<BgInterface>`
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${(props) => props.bgImage}) no-repeat center;
  background-size: cover;
  background-attachment: fixed;
  min-height: calc(100vh - 7.1875rem);
  display: flex;
  padding-top: 7.1875rem;
  width: calc(100vw - 1rem);
`;

const P = styled.p`
  color: var(--white);
  background-color: var(--gray-700);
  padding: var(--spacing-03) var(--spacing-05) !important;
  margin-bottom: 0 !important;
  width: max-content;
`;

const initialNodes = [
  {
    id: '1',
    type: 'sourceNode',
    position: { x: 0, y: 0 },
    data: { label: 'Target 7.2: Increase substantially the share of renewable energy in the global energy mix', sdg: '7' },
  },
  {
    id: '8',
    type: 'sdgIcon',
    position: { x: 500, y: -150 },
    data: { label: '2' },
  },
  {
    id: '13',
    type: 'sdgIcon',
    position: { x: 500, y: -50 },
    data: { label: '2' },
  },
  {
    id: '10',
    type: 'sdgIcon',
    position: { x: 500, y: 50 },
    data: { label: '2' },
  },
  {
    id: '17',
    type: 'sdgIcon',
    position: { x: 500, y: 150 },
    data: { label: '2' },
  },
];
const initialEdges = [{
  id: 'e1-1',
  source: '1',
  target: '8',
  sourceHandle: 'a',
}, {
  id: 'e1-2',
  source: '1',
  target: '13',
  sourceHandle: 'a',
}, {
  id: 'e1-3',
  source: '1',
  target: '10',
  sourceHandle: 'a',
}, {
  id: 'e1-4',
  source: '1',
  target: '17',
  sourceHandle: 'a',
}];
const edgeOptions = {
  animated: true,
  style: {
    stroke: 'var(--dark-green)',
    strokeWidth: 3,
  },
};

const SDGIconNode = (data: any) => {
  const { id } = data;
  return (
    <>
      <div style={{
        pointerEvents: 'none',
      }}
      >
        {getSDGIcon(`SDG ${id}`, 80)}
      </div>
      <Handle type='target' position={Position.Left} />
    </>
  );
};
const SourceTargetNode = (d: any) => {
  const { data } = d;
  return (
    <>
      <div style={{
        maxWidth: '15rem',
        backgroundColor: 'var(--gray-300)',
        padding: 'var(--spacing-05)',
        borderRadius: '4px',
        display: 'flex',
        gap: 'var(--spacing-05)',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
      >
        {getSDGIcon(`SDG ${data.sdg}`, 48)}
        <p className='undp-typography margin-bottom-00 small-font bold'>
          {data.label.split(':')[0]}
          <br />
          {data.label.split(':')[1]}
        </p>
      </div>
      <Handle type='source' position={Position.Right} />
    </>
  );
};

export const InterlinkagesSlide = (props: Props) => {
  const {
    reportData,
  } = props;
  const [ref, inView] = useInView({
    threshold: 0.8,
  });
  const nodeTypes = { sdgIcon: SDGIconNode, sourceNode: SourceTargetNode };
  useEffect(() => {
    if (inView) {
      selectAll('.sdgBGIcon')
        .attr('opacity', 0.2);
      selectAll('.sdgText')
        .style('opacity', 0);
      reportData.InterlinkagesSDG.forEach((d, i) => {
        selectAll(`.sdg_${d}`)
          .transition()
          .duration(500)
          .delay(i * 500)
          .attr('opacity', 1);
        selectAll(`.sdg${d}Text`)
          .transition()
          .duration(500)
          .delay(i * 500)
          .style('opacity', 1);
      });
    }
  }, [inView]);
  return (
    <div ref={ref} className='flex-div'>
      <SectionEl
        bgImage={IMAGES.CurrencyBG}
        style={{
          textAlign: 'center',
          padding: '4rem 0',
          position: 'sticky',
          top: '115px',
          width: 'calc(100vw - 1rem)',
          height: 'calc(100vh - 200px)',
        }}
      >
        <div style={{ padding: 'var(--spacing-07)' }}>
          <h4
            className='undp-typography'
            style={{
              color: 'var(--white)',
              backgroundColor: 'var(--gray-700)',
              width: 'max-content',
              padding: 'var(--spacing-02) var(--spacing-05)',
              marginBottom: 0,
            }}
          >
            Getting over the finish line
          </h4>
          <h4
            className='undp-typography'
            style={{
              color: 'var(--white)',
              backgroundColor: 'var(--gray-700)',
              width: 'max-content',
              padding: 'var(--spacing-02) var(--spacing-05)',
              marginBottom: 0,
            }}
          >
            needs targeted investment...
          </h4>
          <P
            className='undp-typography'
          >
            Investing in these SDGs has the most potential
          </P>
          <P
            className='undp-typography'
          >
            to accelerate development.
          </P>
          <P
            className='undp-typography margin-top-05 padding-top-07 bold'
            style={{ opacity: 1, backgroundColor: UNDPColorModule.sdgColors.sdg7 }}
          >
            7.2: Increase substantially the share of renewable
          </P>
          <P
            className='undp-typography padding-top-07 bold'
            style={{ opacity: 1, backgroundColor: UNDPColorModule.sdgColors.sdg7 }}
          >
            energy in the global energy mix
          </P>
          <P
            className='undp-typography '
            style={{ opacity: 1, backgroundColor: UNDPColorModule.sdgColors.sdg7 }}
          >
            This would result in greater electricity availability,
          </P>
          <P
            className='undp-typography '
            style={{ opacity: 1, backgroundColor: UNDPColorModule.sdgColors.sdg7 }}
          >
            reduced
            {' '}
            <span className='bold'>business disruptions, environmental</span>
          </P>
          <P
            className='undp-typography '
            style={{ opacity: 1, backgroundColor: UNDPColorModule.sdgColors.sdg7 }}
          >
            <span className='bold'>protection, and decreased inequality</span>
            .
          </P>
        </div>
        <div style={{
          flexShrink: 1,
          flexGrow: 1,
          width: '100%',
          height: 'calc(100vh - 115px)',
          textAlign: 'left',
          pointerEvents: 'none',
        }}
        >
          <ReactFlow
            nodes={initialNodes as any}
            edges={initialEdges}
            draggable={false}
            zoomOnScroll={false}
            defaultEdgeOptions={edgeOptions}
            panOnDrag={false}
            nodeTypes={nodeTypes}
            style={{
              background: 'rgba(0,0,0,0)',
              pointerEvents: 'none',
            }}
            proOptions={{ hideAttribution: true }}
            fitView
          />
        </div>
      </SectionEl>
    </div>
  );
};
