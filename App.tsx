
import React, { useState, useEffect, useCallback } from 'react';
import { fetchGtaPopulationInfo } from './services/geminiService';
import type { GtaPopulationData } from './types';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import PopulationChart from './components/PopulationChart';
import GtaMap from './components/GtaMap';
import UrbanSprawlSection from './components/UrbanSprawlSection';
import PredictedHotspots from './components/PredictedHotspots';

const urbanSprawlFactors = [
  "Population growth",
  "Economic indicators (job growth, income levels)",
  "Land Use and Land Cover (LULC)",
  "Transportation Infrastructure",
  "Zoning and Land Use Regulations",
  "Proximity to essential services",
  "Proximity to natural features",
];


const App: React.FC = () => {
  const [data, setData] = useState<GtaPopulationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('Greater Toronto Area');
  const [showSprawl, setShowSprawl] = useState<boolean>(false);

  const fetchData = useCallback(async (loc: string) => {
    setShowSprawl(false); // Reset on new location search
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchGtaPopulationInfo(loc);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(location);
  }, [location, fetchData]);

  const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-500">
      <Header title={data?.title || 'GTA Population Growth'} />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} onRetry={() => fetchData(location)} />}
        
        <div className="max-w-4xl mx-auto space-y-8">
          <GtaMap location={location} onLocationChange={setLocation} />

          {data && !isLoading && !error && (
            <>
              <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 transform hover:scale-[1.01] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                  Executive Summary
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {data.summary}
                </p>
              </section>

              {data.urbanSprawlPredictions && data.urbanSprawlPredictions.length > 0 && (
                <div>
                  {!showSprawl ? (
                    <div className="text-center">
                      <button
                        onClick={() => setShowSprawl(true)}
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-105"
                        aria-controls="urban-sprawl-section"
                        aria-expanded={showSprawl}
                      >
                        Predict Urban Sprawl
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <UrbanSprawlSection predictions={data.urbanSprawlPredictions} />
                      {data.predictedHotspots && data.predictedHotspots.length > 0 && (
                        <PredictedHotspots hotspots={data.predictedHotspots} onViewHotspot={setLocation} />
                      )}
                       <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                          Factors Considered for Estimates
                        </h3>
                        <ul className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                          {urbanSprawlFactors.map((factor, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 mr-3 mt-1 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  )}
                </div>
              )}

              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                  Key Insights & Projections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.keyPoints.map((point, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 flex flex-col items-start space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex-shrink-0 bg-teal-100 dark:bg-teal-900 p-3 rounded-full">
                        <CheckCircleIcon className="h-6 w-6 text-teal-500 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{point.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-6">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              {data.populationTrend && data.populationTrend.length > 0 && (
                <section>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                    Population Trend for {location}
                  </h2>
                  <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                    <PopulationChart data={data.populationTrend} />
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <footer className="text-center py-6 mt-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>Generated by Google Gemini API</p>
        <p>UI/UX by a World-Class Senior Frontend React Engineer</p>
      </footer>
    </div>
  );
};

export default App;
