"use client";

import * as React from "react";
import { Sparkles, ArrowRight, RotateCw, CheckCircle2, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlipCardProps {
  frontBadge?: string;
  frontTitle: string;
  frontSubtitle: string;
  frontMetrics: { label: string; value: string }[];
  backTitle: string;
  backDescription: string;
  backPoints: string[];
  accentColor?: string;
}

export function Interactive3DFlipCard({
  frontBadge = "Featured",
  frontTitle,
  frontSubtitle,
  frontMetrics,
  backTitle,
  backDescription,
  backPoints,
  accentColor = "from-blue-600 to-indigo-600",
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="w-full h-80 perspective-1000 cursor-pointer select-none group"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y + (isFlipped ? 180 : 0)}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        className="relative w-full h-full rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl"
      >
        {/* FRONT FACE */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 rounded-3xl p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden"
        >
          {/* Holographic Top Banner */}
          <div className="flex items-center justify-between">
            <Badge variant="blue" size="sm" className="font-bold">
              {frontBadge}
            </Badge>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
              <RotateCw className="w-3 h-3" /> Click to Flip 3D
            </span>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-1 my-auto">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 transition-colors">
              {frontTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {frontSubtitle}
            </p>
          </div>

          {/* Front Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            {frontMetrics.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{m.label}</p>
                <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BACK FACE (Flipped 180 deg) */}
        <div
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
          className="absolute inset-0 rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border-2 border-indigo-500/50 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <Badge variant="purple" size="sm">Deep Intelligence</Badge>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Flip Back
            </span>
          </div>

          <div className="space-y-2 my-auto">
            <h4 className="text-base font-extrabold text-white">{backTitle}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{backDescription}</p>

            <ul className="space-y-1.5 pt-2">
              {backPoints.map((pt, pIdx) => (
                <li key={pIdx} className="text-[11px] text-slate-200 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-indigo-300">
            <span>Enterprise Engine</span>
            <span className="flex items-center gap-1">Active Verified <Sparkles className="w-3 h-3 text-amber-300" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
