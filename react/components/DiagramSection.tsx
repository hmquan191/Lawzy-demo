// components/DiagramSection.tsx

import ReactFlow, { Background, Controls } from 'reactflow'
import type { DiagramData } from '../types'

const DiagramSection = ({ diagramData }: { diagramData: DiagramData }) => {
  const nodes = diagramData.nodes.map((node, index) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: 100, y: index * 100 },
    type: 'default'
  }))

  const edges = diagramData.edges.map((edge) => ({
    id: `${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    animated: true
  }))

  return (
    <div className='w-[400px] h-full bg-gray-800 border-l border-gray-700 p-2'>
      <h2 className='text-lg font-bold mb-2'>Sơ đồ minh họa</h2>
      <div className='h-[90%]'>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default DiagramSection
