'use client';

/**
 * Animated SVG background: music-themed nodes and connecting lines.
 * Keeps existing slate/indigo/cyan palette; animations in globals.css.
 */
export function LandingBackground() {
  // Node positions [x%, y%] — spread across viewport for a network feel
  const nodes = [
    [15, 20],
    [85, 15],
    [25, 55],
    [75, 50],
    [50, 75],
    [10, 70],
    [90, 80],
    [45, 35],
    [55, 45],
    [30, 85],
    [70, 25],
  ];
  // Line connections [fromIndex, toIndex]
  const edges = [
    [0, 7],
    [1, 8],
    [7, 8],
    [2, 7],
    [3, 8],
    [4, 2],
    [4, 3],
    [5, 0],
    [5, 2],
    [6, 1],
    [6, 3],
    [7, 4],
    [8, 4],
    [9, 5],
    [9, 4],
    [10, 1],
    [10, 7],
  ];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full text-slate-500/40"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id="lineGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgb(129,140,248)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="rgb(56,189,248)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(129,140,248)" stopOpacity="0.15" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Connecting lines */}
        <g stroke="url(#lineGrad)" strokeWidth="0.15" fill="none">
          {edges.map(([a, b], i) => (
            <line
              key={`edge-${i}`}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
              className="landing-line"
            />
          ))}
        </g>
        {/* Nodes */}
        <g fill="currentColor" filter="url(#glow)">
          {nodes.map(([x, y], i) => (
            <g key={`node-${i}`} className="landing-node">
              <circle
                cx={x}
                cy={y}
                r={i % 3 === 0 ? 0.5 : 0.35}
                className="opacity-70"
              />
            </g>
          ))}
        </g>
      </svg>
      {/* Soft central haze so hero text stays readable */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(15,23,42,0.85),transparent_70%)]"
        aria-hidden
      />
      {/* Subtle particle layer */}
      <div className="landing-particles absolute inset-0" aria-hidden />
    </div>
  );
}
