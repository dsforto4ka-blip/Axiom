import React, { useEffect, useRef } from 'react';

export const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for technological flow
    const nodeCount = Math.min(Math.floor(window.innerWidth / 30), 45);
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulse: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;
        nodeA.pulse += 0.02;

        if (nodeA.x < 0) nodeA.x = width;
        if (nodeA.x > width) nodeA.x = 0;
        if (nodeA.y < 0) nodeA.y = height;
        if (nodeA.y > height) nodeA.y = 0;

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(111, 195, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw node
        const currentAlpha = nodeA.alpha + Math.sin(nodeA.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(42, 125, 225, ${Math.max(0.1, currentAlpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#6FC3FF';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Deep Gradient */}
      <div className="absolute inset-0 bg-[#0B0F1C]"></div>

      {/* Cybernetic Tech Grid */}
      <div className="absolute inset-0 cyber-grid opacity-35"></div>

      {/* Glowing Ambient Light Orbs */}
      <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-gradient-to-br from-[#2A7DE1]/20 to-[#6FC3FF]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-5%] w-[700px] h-[700px] bg-gradient-to-bl from-[#2A7DE1]/15 to-transparent rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-tr from-[#6FC3FF]/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

      {/* Interactive Particle & Connection Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-60" />
    </div>
  );
};
