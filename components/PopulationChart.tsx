
import React, { useState, useMemo } from 'react';
import type { PopulationDataPoint } from '../types';

interface PopulationChartProps {
  data: PopulationDataPoint[];
}

interface TooltipData {
  x: number;
  y: number;
  data: PopulationDataPoint;
}

const PopulationChart: React.FC<PopulationChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const chartDimensions = {
    width: 600,
    height: 350,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 50,
    marginLeft: 80,
  };

  const { yMin, yMax, bars, xTicks, yTicks } = useMemo(() => {
    const populations = data.map(d => d.population);
    const minPop = Math.min(...populations);
    const maxPop = Math.max(...populations);

    const yMin = Math.floor(minPop / 500000) * 500000;
    const yMax = Math.ceil(maxPop / 500000) * 500000;
    
    const chartWidth = chartDimensions.width - chartDimensions.marginLeft - chartDimensions.marginRight;
    const chartHeight = chartDimensions.height - chartDimensions.marginTop - chartDimensions.marginBottom;

    const xScale = (index: number) => chartDimensions.marginLeft + index * (chartWidth / data.length);
    const yScale = (population: number) => chartDimensions.height - chartDimensions.marginBottom - ((population - yMin) / (yMax - yMin)) * chartHeight;

    const barWidth = chartWidth / data.length * 0.7;

    const bars = data.map((d, i) => ({
      x: xScale(i) + (chartWidth / data.length - barWidth) / 2,
      y: yScale(d.population),
      width: barWidth,
      height: chartDimensions.height - chartDimensions.marginBottom - yScale(d.population),
      fill: d.type === 'historical' ? 'currentColor' : '#38bdf8', // teal-500, blue-400
      data: d,
    }));
    
    const xTicks = data.map((d, i) => ({
        value: d.year,
        xOffset: xScale(i) + (chartWidth / data.length) / 2,
    }));

    const numYTicks = 5;
    const yTicks = Array.from({ length: numYTicks + 1 }, (_, i) => {
      const value = yMin + (i * (yMax - yMin)) / numYTicks;
      return {
        value: (value / 1000000).toFixed(1) + 'M',
        yOffset: yScale(value),
      };
    });

    return { yMin, yMax, bars, xTicks, yTicks };
  }, [data, chartDimensions]);

  return (
    <div className="relative text-teal-500 dark:text-teal-400">
      <svg viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`} className="w-full h-auto font-sans">
        {/* Y-axis */}
        <g className="text-gray-400 dark:text-gray-500">
          {yTicks.map(({ value, yOffset }) => (
            <g key={value} transform={`translate(0, ${yOffset})`}>
              <line x1={chartDimensions.marginLeft} x2={chartDimensions.width - chartDimensions.marginRight} stroke="currentColor" strokeDasharray="2,2" strokeWidth="0.5" />
              <text x={chartDimensions.marginLeft - 8} alignmentBaseline="middle" textAnchor="end" className="text-xs fill-current">
                {value}
              </text>
            </g>
          ))}
          <text
            transform={`translate(${chartDimensions.marginLeft / 3}, ${chartDimensions.height / 2}) rotate(-90)`}
            textAnchor="middle"
            className="text-sm fill-current"
          >
            Population
          </text>
        </g>
        
        {/* X-axis */}
        <g className="text-gray-400 dark:text-gray-500">
           <line x1={chartDimensions.marginLeft} y1={chartDimensions.height - chartDimensions.marginBottom} x2={chartDimensions.width - chartDimensions.marginRight} y2={chartDimensions.height - chartDimensions.marginBottom} stroke="currentColor" strokeWidth="0.5" />
           {xTicks.map(({ value, xOffset }) => (
             <text key={value} x={xOffset} y={chartDimensions.height - chartDimensions.marginBottom + 20} textAnchor="middle" className="text-xs fill-current">
                {value}
             </text>
           ))}
        </g>

        {/* Bars */}
        <g>
          {bars.map((bar) => (
            <rect
              key={bar.data.year}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              className={`fill-current transition-opacity duration-200 ${bar.data.type === 'projected' ? 'text-blue-400 dark:text-blue-500' : ''}`}
              onMouseMove={(e) => {
                const svgRect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                setTooltip({
                  x: e.clientX - svgRect.left,
                  y: e.clientY - svgRect.top,
                  data: bar.data,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </g>
      </svg>
      {tooltip && (
         <div
          className="absolute p-2 text-sm bg-slate-800 text-white rounded-md shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+10px)]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-bold">{tooltip.data.year}</div>
          <div>Population: {tooltip.data.population.toLocaleString()}</div>
          <div className="text-xs capitalize opacity-70">{tooltip.data.type}</div>
        </div>
      )}
      <div className="flex justify-center items-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm bg-teal-500 dark:bg-teal-400"></div>
            <span>Historical</span>
        </div>
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-500"></div>
            <span>Projected</span>
        </div>
      </div>
    </div>
  );
};

export default PopulationChart;
