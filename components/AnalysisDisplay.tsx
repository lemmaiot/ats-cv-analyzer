import React from 'react';
import type { AnalysisResult, GroundingChunk } from '../types';
import { NIGERIAN_GREEN, PRIMARY_BLUE } from '../constants';
import { TrendingUpIcon, LinkIcon, CheckCircleIcon, SparklesIcon } from './icons/Icons';
import RadialProgress from './charts/RadialProgress';
import ScoreBar from './charts/ScoreBar';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  sources: GroundingChunk[];
}

const getScoreColor = (score: number): string => {
    if (score >= 80) return NIGERIAN_GREEN;
    if (score >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, sources }) => {
  const scoreColor = getScoreColor(analysis.overallScore);

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <h2 className="text-3xl font-bold text-center" style={{ color: NIGERIAN_GREEN }}>Your CV Analysis</h2>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 flex justify-center">
            <RadialProgress score={analysis.overallScore} color={scoreColor} />
        </div>
        <div className="md:col-span-2 space-y-4">
             <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                    <div className="mr-3 text-gray-500 pt-1"><SparklesIcon/></div>
                    <div>
                        <h4 className="font-bold text-gray-800">Summary</h4>
                        <p className="text-gray-600">{analysis.summary}</p>
                    </div>
                </div>
             </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                    <div className="mr-3 text-gray-500 pt-1"><CheckCircleIcon/></div>
                    <div>
                        <h4 className="font-bold text-gray-800">Key Improvement</h4>
                        <p className="text-gray-600">{analysis.keyImprovement}</p>
                    </div>
                </div>
             </div>
        </div>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: NIGERIAN_GREEN }}>Score Breakdown</h3>
        <div className="space-y-6">
            {analysis.scoreBreakdown.map((item, index) => (
                <ScoreBar key={index} area={item.area} score={item.score} feedback={item.feedback} color={getScoreColor(item.score)} />
            ))}
        </div>
      </div>

      {analysis.trends && analysis.trends.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
                <div className="mr-3" style={{ color: PRIMARY_BLUE }}><TrendingUpIcon /></div>
                <h3 className="text-2xl font-bold" style={{ color: PRIMARY_BLUE }}>Latest Gist For Your Field</h3>
            </div>
            <ul className="space-y-3">
              {analysis.trends.map((trend, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 pt-1 text-green-500"><SparklesIcon /></div>
                  <p className="text-gray-700">{trend}</p>
                </li>
              ))}
            </ul>
        </div>
      )}
      
      {sources && sources.length > 0 && (
          <div className="bg-gray-100 p-6 rounded-xl">
             <div className="flex items-center mb-3">
                <div className="mr-3 text-gray-500"><LinkIcon/></div>
                <h4 className="text-lg font-semibold text-gray-800">Sources from Our Research</h4>
             </div>
              <ul className="space-y-2">
                  {sources.map((source, index) => (
                      <li key={index}>
                          <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: PRIMARY_BLUE }}>
                              {source.web.title || source.web.uri}
                          </a>
                      </li>
                  ))}
              </ul>
          </div>
      )}
    </div>
  );
};

export default AnalysisDisplay;