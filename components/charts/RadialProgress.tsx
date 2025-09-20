import React from 'react';

interface RadialProgressProps {
  score: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ score, color, size = 160, strokeWidth = 12 }) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-gray-200"
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ stroke: color }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-sm font-medium text-gray-500">Overall Score</span>
      </div>
    </div>
  );
};

export default RadialProgress;
