import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import FileUpload from './components/FileUpload';
import HowItWorks from './components/HowItWorks';
import { analyzeCvWithTrends } from './services/geminiService';
import type { AnalysisResult, GroundingChunk } from './types';
import { NIGERIAN_GREEN, PRIMARY_BLUE } from './constants';

const App: React.FC = () => {
  const [cvText, setCvText] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileProcessed = (text: string, name: string) => {
    setCvText(text);
    setFileName(name);
    setError(null); // Clear previous errors on new file
  };

  const handleRemoveFile = () => {
    setCvText('');
    setFileName(null);
  };
  
  const handleAnalyze = useCallback(async () => {
    if (!cvText || !industry.trim()) {
      setError('Oga, you must upload your CV and enter your field of work.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setSources([]);

    try {
      const result = await analyzeCvWithTrends(cvText, industry);
      if (result) {
        setAnalysis(result.analysis);
        setSources(result.sources);
      } else {
         setError('Sorry o, something went wrong. The analysis returned empty. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Ah! E don cast. We couldn\'t analyze your CV. Please check your network or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [cvText, industry]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: NIGERIAN_GREEN }}>
            Make Your CV Stand Out, Oga!
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Let our AI give your CV a proper analysis to help you land your dream job.
          </p>
        </div>

        <HowItWorks />

        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mt-12">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                What is your Field/Industry? (e.g., "Software Engineering", "Digital Marketing")
              </label>
              <input
                type="text"
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Enter your industry here..."
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-[${PRIMARY_BLUE}]`}
                style={{borderColor: PRIMARY_BLUE}}
              />
            </div>
            
            <FileUpload
                onFileProcessed={handleFileProcessed}
                onError={setError}
                onRemoveFile={handleRemoveFile}
                fileName={fileName}
            />

            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !cvText || !industry}
                className={`inline-flex items-center justify-center px-8 py-3 font-semibold text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[${NIGERIAN_GREEN}]`}
                style={{ backgroundColor: isLoading ? NIGERIAN_GREEN : PRIMARY_BLUE }}
              >
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Analyzing... Hold on tight!</span>
                  </>
                ) : (
                  'Oya, Analyze My CV!'
                )}
              </button>
            </div>
          </div>
        </div>
        
        {error && (
            <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">
                {error}
            </div>
        )}

        {isLoading && !analysis && (
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <p className="text-lg" style={{ color: NIGERIAN_GREEN }}>Our AI is cooking... checking the latest gist for your field!</p>
          </div>
        )}

        {!isLoading && analysis && (
          <AnalysisDisplay 
            analysis={analysis}
            sources={sources}
          />
        )}
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} MyCv.ng - Your Personal Career Coach.</p>
      </footer>
    </div>
  );
};

export default App;