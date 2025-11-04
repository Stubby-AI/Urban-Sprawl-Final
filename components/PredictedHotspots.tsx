
import React from 'react';
import type { PredictedHotspot } from '../types';

interface PredictedHotspotsProps {
  hotspots: PredictedHotspot[];
  onViewHotspot: (locationName: string) => void;
}

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PredictedHotspots: React.FC<PredictedHotspotsProps> = ({ hotspots, onViewHotspot }) => {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
        Predicted Growth Hotspots (Next 10 Years)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-start space-x-4 mb-3">
                 <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
                    <MapPinIcon className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-2">{hotspot.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-6">
                {hotspot.reason}
              </p>
            </div>
            <button
              onClick={() => onViewHotspot(hotspot.locationQuery)}
              className="mt-4 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-teal-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors duration-200"
            >
              View on Map
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PredictedHotspots;