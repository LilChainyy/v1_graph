'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import { buildSeries, ChartSeries } from '@/lib/compute';

interface ChartClientProps {
  ticker: string;
  highlightDate?: string;
}

export default function ChartClient({ ticker, highlightDate }: ChartClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<ChartSeries | null>(null);

  useEffect(() => {
    // Load chart data
    const loadData = async () => {
      const data = await buildSeries(
        ticker,
        '2025-01-01',
        '2025-09-10',
        '2025-12-31',
        highlightDate
      );
      setChartData(data);
    };
    
    loadData();
  }, [ticker, highlightDate]);

  useEffect(() => {
    if (!canvasRef.current || !chartData) return;

    // Dynamic import of Chart.js
    const loadChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      
      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Close Price (Actual)',
              data: chartData.actual,
              borderColor: '#0a8a0a',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              tension: 0,
            },
            {
              label: 'Close Price (Future)',
              data: chartData.stub,
              borderColor: '#9ca3af',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [6, 6],
              pointRadius: 0,
              tension: 0,
            },
            {
              label: 'Event Highlight',
              data: chartData.earningsDots,
              borderColor: 'transparent',
              backgroundColor: 'transparent',
              showLine: false,
              pointRadius: 8,
              pointHoverRadius: 10,
              pointBackgroundColor: '#6b46c1',
              pointBorderColor: '#6b46c1',
              pointBorderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Price ($)'
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      });
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="w-full h-96 bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {ticker} Price Chart
        </h3>
        {highlightDate && (
          <span className="text-sm text-gray-600">
            Highlighting: {new Date(highlightDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}