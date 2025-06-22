import { useState, useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap, MarkerType, applyNodeChanges } from 'reactflow'
import type { Node, Edge, NodeChange } from 'reactflow'
import 'reactflow/dist/style.css'
import type { DiagramData } from '../types'

const DiagramSection = ({ diagramData }: { diagramData: DiagramData }) => {
  const rootX = 250
  const rootY = 250
  const radius = 160

  // Tính toán layout hình tròn
  const initialNodes: Node[] = useMemo(() => {
    return diagramData.nodes.map((node, index) => {
      const isRoot = index === 0
      const angle = isRoot ? 0 : (index - 1) * (360 / (diagramData.nodes.length - 1))
      const rad = (angle * Math.PI) / 180
      const x = isRoot ? rootX : rootX + radius * Math.cos(rad)
      const y = isRoot ? rootY : rootY + radius * Math.sin(rad)

      return {
        id: node.id,
        type: 'default',
        position: { x, y },
        draggable: true,
        data: { label: (isRoot ? '⭐' : '📌 ') + node.label },
        style: {
          background: isRoot ? '#feca57' : '#48dbfb',
          color: '#000',
          padding: 10,
          border: '2px solid #333',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: 14
        }
      }
    })
  }, [diagramData])

  const initialEdges: Edge[] = useMemo(() => {
    return diagramData.edges.map((edge) => ({
      id: `${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      label: edge.label || '',
      animated: true,
      style: { stroke: '#1e90ff', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#1e90ff'
      }
    }))
  }, [diagramData])

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges] = useState<Edge[]>(initialEdges)

  const handleNodeChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }

  return (
    <div className='w-[400px] h-full bg-white border-l border-gray-700 p-2'>
      <div className='h-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodeChange}
          fitView
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          nodesDraggable
          nodesConnectable={false}
          style={{ background: '#f8f9fa' }}
        >
          <MiniMap />
          <Background color='#eee' />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default DiagramSection
