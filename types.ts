
export interface KeyPoint {
  title: string;
  description: string;
}

export interface PopulationDataPoint {
  year: number;
  population: number;
  type: 'historical' | 'projected';
}

export interface UrbanSprawlPrediction {
  title: string;
  description: string;
}

export interface PredictedHotspot {
  name: string;
  locationQuery: string;
  reason: string;
}

export interface GtaPopulationData {
  title: string;
  summary: string;
  keyPoints: KeyPoint[];
  populationTrend: PopulationDataPoint[];
  urbanSprawlPredictions: UrbanSprawlPrediction[];
  predictedHotspots: PredictedHotspot[];
}