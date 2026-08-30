"use client";

interface ComfortGaugeProps {
  score: number;
  cityName: string;
}

export function ComfortGauge({ score, cityName }: ComfortGaugeProps) {
  const radius = 100;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 70
      ? "var(--high-comfort)"
      : score >= 40
        ? "var(--moderate)"
        : "var(--low-comfort)";

  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);
  const svgHeight = radius + strokeWidth + 30;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={radius * 2}
        height={svgHeight}
        viewBox={`0 0 ${radius * 2} ${svgHeight}`}
        className="w-40 h-28 sm:w-64 sm:h-44"
      >
        {ticks.map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = radius + (normalizedRadius - 6) * Math.cos(angle);
          const y1 = radius + strokeWidth / 2 + 20 + (normalizedRadius - 6) * Math.sin(angle);
          const x2 = radius + normalizedRadius * Math.cos(angle);
          const y2 = radius + strokeWidth / 2 + 20 + normalizedRadius * Math.sin(angle);

          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--secondary)"
                strokeWidth={tick % 50 === 0 ? 2 : 1}
                opacity={0.6}
              />
              {tick % 50 === 0 && (
                <text
                  x={radius + (normalizedRadius + 12) * Math.cos(angle)}
                  y={radius + strokeWidth / 2 + 20 + (normalizedRadius + 12) * Math.sin(angle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--secondary)"
                  fontSize={11}
                  fontFamily="var(--font-ibm-plex-mono)"
                >
                  {tick}
                </text>
              )}
            </g>
          );
        })}

        <path
          d={`M ${strokeWidth / 2} ${radius + strokeWidth / 2 + 20} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth / 2} ${radius + strokeWidth / 2 + 20}`}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={strokeWidth}
          opacity={0.2}
          strokeLinecap="round"
        />

        <path
          d={`M ${strokeWidth / 2} ${radius + strokeWidth / 2 + 20} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth / 2} ${radius + strokeWidth / 2 + 20}`}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />

        {(() => {
          const angle = Math.PI - (score / 100) * Math.PI;
          const needleLength = normalizedRadius - 20;
          const nx = radius + needleLength * Math.cos(angle);
          const ny = radius + strokeWidth / 2 + 20 + needleLength * Math.sin(angle);
          return (
            <line
              x1={radius}
              y1={radius + strokeWidth / 2 + 20}
              x2={nx}
              y2={ny}
              stroke="var(--foreground)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          );
        })()}

        <circle
          cx={radius}
          cy={radius + strokeWidth / 2 + 20}
          r={4}
          fill="var(--foreground)"
        />
      </svg>

      <div className="text-center mt-2">
        <div
          className="text-3xl sm:text-4xl font-bold font-mono"
          style={{ color: scoreColor }}
        >
          {score}
        </div>
        <div className="text-sm text-secondary mt-1">{cityName}</div>
      </div>
    </div>
  );
}
