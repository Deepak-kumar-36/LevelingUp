import { useState, useMemo, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { ForceGraphMethods } from 'react-force-graph-2d';
import type { Note, NoteLink } from '../../../types';

interface GraphViewProps {
  notes: Note[];
  links: NoteLink[];
  onNodeClick: (id: string) => void;
}

export function GraphView({ notes, links, onNodeClick }: GraphViewProps) {
  const fgRef = useRef<ForceGraphMethods>(null);
  
  // Hover State
  const [hoverNode, setHoverNode] = useState<any>(null);

  // Compute graph data
  const graphData = useMemo(() => {
    const nodes = notes.map(n => {
      const neighbors = new Set<string>();
      links.forEach(l => {
        if (l.sourceNoteId === n.id) neighbors.add(l.targetNoteId);
        if (l.targetNoteId === n.id) neighbors.add(l.sourceNoteId);
      });
      return {
        id: n.id,
        name: n.title,
        val: neighbors.size === 0 ? 1 : Math.min(10, neighbors.size * 2),
        neighbors
      };
    });

    const gLinks = links.map(l => ({
      source: l.sourceNoteId,
      target: l.targetNoteId,
    }));

    return { nodes, links: gLinks };
  }, [notes, links]);

  // Handle interactions
  const handleNodeClick = useCallback((node: any) => {
    // Zoom in animation
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(4, 1000);
    }
    // Small delay before opening to let animation run
    setTimeout(() => {
      onNodeClick(node.id);
    }, 400);
  }, [onNodeClick]);

  // Canvas Drawing
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = hoverNode === node;
    const isNeighbor = hoverNode && hoverNode.neighbors.has(node.id);
    const isDimmed = hoverNode && !isHovered && !isNeighbor;
    const isOrphan = node.neighbors.size === 0;

    // Node size
    const radius = Math.max(3, node.val) * 1.5;

    // Color logic
    let color = isOrphan ? 'rgba(255, 255, 255, 0.2)' : 'rgba(16, 185, 129, 0.8)'; // default primary green-ish or white
    if (isHovered) color = 'rgba(255, 255, 255, 1)';
    else if (isNeighbor) color = 'rgba(16, 185, 129, 1)'; // primary highlight
    else if (isDimmed) color = 'rgba(255, 255, 255, 0.05)';

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    
    // Glow effect
    if ((isHovered || isNeighbor) && !isOrphan) {
      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 15;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = color;
    ctx.fill();

    // Draw Title (only at certain zooms or if hovered)
    if (isHovered || isNeighbor || globalScale > 2) {
      const fontSize = 12 / globalScale;
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isDimmed ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)';
      ctx.fillText(node.name, node.x, node.y + radius + (8 / globalScale));
    }
  }, [hoverNode]);

  return (
    <div className="w-full h-full bg-[#050505] cursor-crosshair">
      <ForceGraph2D
        ref={fgRef as any}
        graphData={graphData}
        nodeLabel={() => ''} // disable default tooltip since we draw text
        nodeCanvasObject={paintNode}
        nodeRelSize={4}
        linkColor={(link: any) => {
          if (hoverNode) {
            const isHoverLink = hoverNode.id === link.source.id || hoverNode.id === link.target.id;
            return isHoverLink ? 'rgba(16, 185, 129, 0.8)' : 'rgba(255,255,255,0.05)';
          }
          return 'rgba(255,255,255,0.2)';
        }}
        linkWidth={link => (hoverNode && (hoverNode.id === link.source.id || hoverNode.id === link.target.id)) ? 2 : 1}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={link => (hoverNode && (hoverNode.id === link.source.id || hoverNode.id === link.target.id)) ? 4 : 0} // only show particles on hover
        onNodeHover={(node) => setHoverNode(node)}
        onNodeClick={handleNodeClick}
        backgroundColor="#050505"
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
      {/* Glitch Overlay decorative */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/20 opacity-30 mix-blend-screen" 
           style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}>
      </div>
    </div>
  );
}
