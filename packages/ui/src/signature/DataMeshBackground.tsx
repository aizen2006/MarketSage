"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface DataMeshBackgroundProps {
  className?: string;
  /** Opacity of flow lines (default 0.15) */
  lineOpacity?: number;
  /** Whether to react to pointer movement (parallax) */
  parallax?: boolean;
}

export function DataMeshBackground({
  className = "",
  lineOpacity = 0.15,
  parallax = true,
}: DataMeshBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!parallax) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setOffset({ x: x * 8, y: y * 8 });
    },
    [parallax],
  );

  const handlePointerLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${parallax ? "pointer-events-auto" : "pointer-events-none"} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden
    >
      <svg
        ref={svgRef}
        className="absolute h-full w-full"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: parallax
            ? `translate(${offset.x}px, ${offset.y}px)`
            : undefined,
          transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--fg)"
              strokeOpacity={0.04}
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient
            id="lineGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0} />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity={lineOpacity} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />
        {/* Flow lines — circuit-like paths */}
        <path
          d="M 0 120 Q 200 80 400 120 T 800 120"
          stroke="url(#lineGrad)"
          strokeWidth="0.8"
          fill="none"
          style={{
            animation: "data-mesh-flow 20s ease-in-out infinite",
          }}
        />
        <path
          d="M 0 280 Q 150 320 350 280 T 800 280"
          stroke="var(--accent)"
          strokeOpacity={lineOpacity * 0.7}
          strokeWidth="0.6"
          fill="none"
          style={{
            animation: "data-mesh-flow 25s ease-in-out infinite reverse",
            animationDelay: "-5s",
          }}
        />
        <path
          d="M 0 440 Q 300 400 600 440 L 800 420"
          stroke="var(--primary)"
          strokeOpacity={lineOpacity * 0.5}
          strokeWidth="0.5"
          fill="none"
          style={{
            animation: "data-mesh-flow 22s ease-in-out infinite",
            animationDelay: "-10s",
          }}
        />
        <path
          d="M 100 0 L 100 200 M 100 400 L 100 600"
          stroke="var(--fg)"
          strokeOpacity={0.06}
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 400 0 L 400 300 M 400 500 L 400 600"
          stroke="var(--fg)"
          strokeOpacity={0.05}
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 700 0 L 700 600"
          stroke="var(--fg)"
          strokeOpacity={0.04}
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
      {/* Noise overlay 6–8% */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
        aria-hidden
      />
    </div>
  );
}
