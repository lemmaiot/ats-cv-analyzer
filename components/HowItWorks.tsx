import React from 'react';
import { UploadCloudIcon, BriefcaseIcon, ChartBarIcon } from './icons/Icons';
import { NIGERIAN_GREEN, PRIMARY_BLUE } from '../constants';

const Step = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center">
    <div 
      className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-blue-100"
      style={{ color: PRIMARY_BLUE }}
    >
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8" style={{ color: NIGERIAN_GREEN }}>
        Get Your Analysis in 3 Simple Steps
      </h2>
      <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 hidden md:block">
            <div className="absolute w-full h-0.5 border-t-2 border-dashed border-gray-300"></div>
        </div>
        <Step 
          icon={<UploadCloudIcon />} 
          title="1. Upload Your CV" 
          description="Securely upload your CV in PDF or TXT format." 
        />
        <Step 
          icon={<BriefcaseIcon />} 
          title="2. Add Your Industry" 
          description="Tell us your field so we can tailor the analysis." 
        />
        <Step 
          icon={<ChartBarIcon />} 
          title="3. Get Your Analysis" 
          description="Receive instant, AI-powered feedback and trends." 
        />
      </div>
    </div>
  );
};

export default HowItWorks;