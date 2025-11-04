
import React from 'react';
import type { UrbanSprawlPrediction } from '../types';

interface UrbanSprawlSectionProps {
  predictions: UrbanSprawlPrediction[];
}

const BuildingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
  </svg>
);


const UrbanSprawlSection: React.FC<UrbanSprawlSectionProps> = ({ predictions }) => {
  return (
    <section id="urban-sprawl-section">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
        Future of Urban Sprawl
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.map((prediction, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 flex flex-col items-start space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
              <BuildingIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{prediction.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-6">
                {prediction.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UrbanSprawlSection;
