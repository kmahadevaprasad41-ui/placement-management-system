"use client";

import * as React from "react";

export function Floating3DShapes() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse tracking for 3D parallax tilt
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetRotY = ((mouseX - width / 2) / width) * 0.8;
      targetRotX = -((mouseY - height / 2) / height) * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 3D Polyhedron Node Vertices (Icosahedron & Octahedron)
    interface Node3D {
      x: number;
      y: number;
      z: number;
    }

    interface Shape3D {
      cx: number;
      cy: number;
      cz: number;
      radius: number;
      nodes: Node3D[];
      edges: [number, number][];
      rotX: number;
      rotY: number;
      rotZ: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      color: string;
      glowColor: string;
    }

    // Helper: Create 3D Octahedron vertices
    const createOctahedron = (cx: number, cy: number, cz: number, r: number, color: string, glow: string): Shape3D => {
      const nodes: Node3D[] = [
        { x: 0, y: -r, z: 0 },
        { x: r, y: 0, z: 0 },
        { x: 0, y: 0, z: r },
        { x: -r, y: 0, z: 0 },
        { x: 0, y: 0, z: -r },
        { x: 0, y: r, z: 0 },
      ];

      const edges: [number, number][] = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [5, 1], [5, 2], [5, 3], [5, 4],
        [1, 2], [2, 3], [3, 4], [4, 1],
      ];

      return {
        cx,
        cy,
        cz,
        radius: r,
        nodes,
        edges,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speedX: 0.008 + Math.random() * 0.008,
        speedY: 0.01 + Math.random() * 0.008,
        speedZ: 0.006 + Math.random() * 0.006,
        color,
        glowColor: glow,
      };
    };

    // Helper: Create 3D Cube vertices
    const createCube = (cx: number, cy: number, cz: number, size: number, color: string, glow: string): Shape3D => {
      const s = size / 2;
      const nodes: Node3D[] = [
        { x: -s, y: -s, z: -s },
        { x: s, y: -s, z: -s },
        { x: s, y: s, z: -s },
        { x: -s, y: s, z: -s },
        { x: -s, y: -s, z: s },
        { x: s, y: -s, z: s },
        { x: s, y: s, z: s },
        { x: -s, y: s, z: s },
      ];

      const edges: [number, number][] = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      return {
        cx,
        cy,
        cz,
        radius: size,
        nodes,
        edges,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speedX: 0.006 + Math.random() * 0.006,
        speedY: 0.008 + Math.random() * 0.006,
        speedZ: 0.005 + Math.random() * 0.005,
        color,
        glowColor: glow,
      };
    };

    const shapes: Shape3D[] = [
      createOctahedron(width * 0.12, height * 0.25, 0, 42, "rgba(59, 130, 246, 0.7)", "rgba(59, 130, 246, 0.3)"),
      createCube(width * 0.88, height * 0.32, 0, 50, "rgba(168, 85, 247, 0.7)", "rgba(168, 85, 247, 0.3)"),
      createOctahedron(width * 0.85, height * 0.78, 0, 36, "rgba(16, 185, 129, 0.7)", "rgba(16, 185, 129, 0.3)"),
      createCube(width * 0.15, height * 0.75, 0, 40, "rgba(245, 158, 11, 0.7)", "rgba(245, 158, 11, 0.3)"),
    ];

    const fov = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse rotation interpolation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      shapes.forEach((shape) => {
        shape.rotX += shape.speedX;
        shape.rotY += shape.speedY;
        shape.rotZ += shape.speedZ;

        const totalRotX = shape.rotX + currentRotX;
        const totalRotY = shape.rotY + currentRotY;

        // Project 3D vertices to 2D
        const projectedNodes = shape.nodes.map((node) => {
          // Rotate around X
          let y1 = node.y * Math.cos(totalRotX) - node.z * Math.sin(totalRotX);
          let z1 = node.y * Math.sin(totalRotX) + node.z * Math.cos(totalRotX);

          // Rotate around Y
          let x2 = node.x * Math.cos(totalRotY) + z1 * Math.sin(totalRotY);
          let z2 = -node.x * Math.sin(totalRotY) + z1 * Math.cos(totalRotY);

          // Rotate around Z
          let x3 = x2 * Math.cos(shape.rotZ) - y1 * Math.sin(shape.rotZ);
          let y3 = x2 * Math.sin(shape.rotZ) + y1 * Math.cos(shape.rotZ);

          const depth = fov / (fov + z2 + shape.cz + 200);
          return {
            x: shape.cx + x3 * depth,
            y: shape.cy + y3 * depth,
            scale: depth,
          };
        });

        // Draw glowing 3D Edges
        ctx.save();
        ctx.shadowColor = shape.glowColor;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.6;

        shape.edges.forEach(([startIdx, endIdx]) => {
          const p1 = projectedNodes[startIdx];
          const p2 = projectedNodes[endIdx];

          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Draw glowing Vertices
        projectedNodes.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = shape.color;
          ctx.fill();
        });

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70 dark:opacity-85"
    />
  );
}
