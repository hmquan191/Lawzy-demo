import ReactFlow, { Background, Controls, MarkerType } from 'reactflow'
import 'reactflow/dist/style.css'
import type { DiagramData } from '../types'

const DiagramSection = ({ diagramData }: { diagramData: DiagramData }) => {
  const nodes = diagramData.nodes.map((node, index) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: 100, y: index * 100 },
    type: 'default',
    style: {
      background: '#ff9f43',
      color: '#000000',
      border: '1px solid #bbb'
    }
  }))

  const edges = diagramData.edges.map((edge) => ({
    id: `${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
    label: edge.label || '',
    animated: true,
    style: { stroke: '#222' },
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  }))

  return (
    <div className='w-[400px] h-full bg-white border-l border-gray-700 p-2'>
      <h2 className='text-lg font-bold mb-2 text-black'>Sơ đồ minh họa</h2>
      <div className='h-[90%] bg-white'>
        <ReactFlow nodes={nodes} edges={edges} fitView style={{ background: '#fff' }}>
          <Background color='#eee' />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default DiagramSection
