import React from 'react';

interface ScoreBarProps {
  area: string;
  score: number;
  feedback: string;
  color: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ area, score, feedback, color }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-md font-semibold text-gray-700">{area}</h4>
        <span className="text-md font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
            className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${score}%`, backgroundColor: color }}
        ></div>
      </div>
      <p className="text-sm text-gray-500">{feedback}</p>
    </div>
  );
};

export default ScoreBar;
