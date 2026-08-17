"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxRotation?: number;
  scale?: number;
  perspective?: number;
  glareOpacity?: number;
  children: React.ReactNode;
}

export function TiltCard({
  className,
  maxRotation = 12,
  scale = 1.03,
  perspective = 1000,
  glareOpacity = 0.15,
  children,
  ...props
}: TiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * maxRotation;
    const rotY = ((x - centerX) / centerX) * maxRotation;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
      }}
      className="relative transition-transform duration-200 ease-out"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transformStyle: "preserve-3d",
          transition: isHovered ? "transform 0.08s ease-out" : "transform 0.4s ease-out",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-900",
          className
        )}
        {...props}
      >
        {/* Dynamic Light Glare Overlay */}
        <div
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${
              isHovered ? glareOpacity : 0
            }) 0%, rgba(255,255,255,0) 70%)`,
            pointerEvents: "none",
          }}
          className="absolute inset-0 z-20 transition-opacity duration-300"
        />

        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
