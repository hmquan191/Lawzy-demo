// components/DiagramSection.tsx

import React from 'react'
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow'
import 'reactflow/dist/style.css'
import type { DiagramData } from '../types'

interface DiagramSectionProps {
  diagramData: DiagramData
}

const DiagramSection: React.FC<DiagramSectionProps> = ({ diagramData }) => {
  if (!diagramData || diagramData.type !== 'flowchart') return null

  // Convert nodes
  const nodes: Node[] = diagramData.nodes.map((node, index) => ({
    id: node.id,
    data: { label: node.label },
    position: node.position || { x: 100, y: index * 100 },
    type: 'default'
  }))

  // Convert edges
  const edges: Edge[] = diagramData.edges.map((edge, idx) => ({
    id: `e-${edge.from}-${edge.to}-${idx}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    type: 'default'
  }))

  return (
    <div className='w-[400px] max-w-full h-full border-l border-gray-700 bg-gray-950 p-4 overflow-auto'>
      <h2 className='text-lg font-semibold text-white mb-3'>📊 Sơ đồ minh họa</h2>
      <div style={{ height: '100%', minHeight: '500px' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default DiagramSection
