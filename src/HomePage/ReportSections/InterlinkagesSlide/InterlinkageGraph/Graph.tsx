import ReactFlow, { Handle, Position } from 'reactflow';
import { EdgeData, NodeData, SummaryReportDataType } from '../../../../Types';
import { getSDGIcon } from '../../../../utils/getSDGIcon';

interface Props {
  reportData: SummaryReportDataType;
  graphHeight: number;
  graphWidth: number;
}
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
export const Graph = (props: Props) => {
  const {
    reportData,
    graphHeight,
    graphWidth,
  } = props;

  const nodes: NodeData[] = [
    {
      id: '1',
      type: 'sourceNode',
      position: { x: 0, y: 0 },
      data: { label: reportData.interlinkages.source.label.replaceAll('\n', ' '), sdg: reportData.interlinkages.source.sdg },
    },
  ];
  reportData.interlinkages.targets.forEach((d, i) => {
    if (reportData.interlinkages.targets.length % 2 === 0) {
      nodes.push({
        id: `${d}`,
        type: 'sdgIcon',
        position: { x: graphWidth - 100, y: (reportData.interlinkages.targets.length / 2 - i) * (-100) + 50 },
      });
    } else {
      nodes.push({
        id: `${d}`,
        type: 'sdgIcon',
        position: { x: graphWidth - 100, y: (Math.floor(reportData.interlinkages.targets.length / 2) - i) * (-100) },
      });
    }
  });
  const linkages: EdgeData[] = reportData.interlinkages.targets.map((d, i) => ({
    id: `el1=${i}`,
    source: '1',
    target: `${d}`,
    sourceHandle: 'a',
  }));
  const nodeTypes = { sdgIcon: SDGIconNode, sourceNode: SourceTargetNode };
  return (
    <div style={{ width: `${graphWidth - 10}px`, height: `${graphHeight - 10}px` }}>
      <ReactFlow
        nodes={nodes as any}
        edges={linkages}
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
  );
};
