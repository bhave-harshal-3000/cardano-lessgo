import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { TopBar } from '../components/TopBar';
import { useWallet } from '../contexts/WalletContext';
import { BarChart3, PieChart, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Chart: any;
  }
}

interface VisualizationData {
  success: boolean;
  userId: string;
  transactionCount: number;
  visualizations: Array<{
    type: string;
    title: string;
    data: {
      labels: string[];
      datasets: Array<{
        label?: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string;
        tension?: number;
      }>;
    };
  }>;
  categorization?: Record<string, string>;
  error?: string;
}

const chartColors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#4BC0C0',
  danger: '#FF6384',
  warning: '#FFCE56',
  info: '#36A2EB',
};

export const Visualizations: React.FC = () => {
  const { userId } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vizData, setVizData] = useState<VisualizationData | null>(null);
  const chartInstancesRef = useRef<Record<string, any>>({});
  const chartsLoadedRef = useRef(false);

  // Load Chart.js from CDN
  useEffect(() => {
    if (chartsLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = () => {
      chartsLoadedRef.current = true;
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchVisualizations = async () => {
    if (!userId) {
      setError('User ID not found. Please connect your wallet.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5002/visualize?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch visualizations: ${response.statusText}`);
      }

      const data: VisualizationData = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate visualizations');
      }

      setVizData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching visualizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisualizations();
  }, [userId]);

  // Render charts when data is available
  useEffect(() => {
    if (!vizData?.visualizations || !chartsLoadedRef.current) return;

    // Wait a bit for Chart.js to be available
    const timer = setTimeout(() => {
      const Chart = window.Chart;
      if (!Chart) return;

      const newChartInstances: Record<string, any> = {};

      vizData.visualizations.forEach((viz, index) => {
        const canvasId = `chart-${index}`;
        const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;

        if (!canvasElement) return;

        // Destroy existing chart if it exists
        if (chartInstancesRef.current[canvasId]) {
          chartInstancesRef.current[canvasId].destroy();
        }

        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;

        const chartConfig = {
          type: viz.type,
          data: {
            labels: viz.data.labels,
            datasets: viz.data.datasets.map((dataset) => ({
              ...dataset,
              backgroundColor:
                dataset.backgroundColor ||
                Object.values(chartColors).slice(0, viz.data.labels.length),
            })),
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as const,
                labels: {
                  font: { size: 12 },
                  padding: 15,
                },
              },
              title: {
                display: true,
                text: viz.title,
                font: { size: 14, weight: 'bold' as const },
              },
            },
            scales:
              viz.type === 'pie' || viz.type === 'doughnut'
                ? {}
                : {
                    y: {
                      beginAtZero: true,
                      ticks: { font: { size: 11 } },
                    },
                    x: {
                      ticks: { font: { size: 11 } },
                    },
                  },
          },
        };

        try {
          const chart = new Chart(ctx, chartConfig as any);
          newChartInstances[canvasId] = chart;
        } catch (err) {
          console.error(`Error creating chart ${canvasId}:`, err);
        }
      });

      chartInstancesRef.current = newChartInstances;
    }, 500);

    return () => clearTimeout(timer);
  }, [vizData]);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <TopBar />

        <div className="pt-24 pb-12 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Financial Visualizations
                </h1>
              </div>
              <p className="text-purple-200 text-lg">
                Comprehensive analysis of your transactions and spending patterns
              </p>
            </div>

            {/* Stats */}
            {vizData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg border border-purple-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-semibold mb-2">
                        Total Transactions
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {vizData.transactionCount}
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-300 opacity-50" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg border border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold mb-2">
                        Categories Found
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {vizData.categorization
                          ? Object.values(vizData.categorization).reduce(
                              (acc: Set<string>, cat: string) => {
                                acc.add(cat);
                                return acc;
                              },
                              new Set()
                            ).size || 0
                          : 0}
                      </p>
                    </div>
                    <PieChart className="w-10 h-10 text-blue-300 opacity-50" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg border border-green-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-semibold mb-2">
                        Visualizations
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {vizData.visualizations.length}
                      </p>
                    </div>
                    <BarChart3 className="w-10 h-10 text-green-300 opacity-50" />
                  </div>
                </motion.div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900 border border-red-600 rounded-lg p-6 mb-8 flex items-start gap-4"
              >
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-red-200 font-semibold mb-1">Error</h3>
                  <p className="text-red-100">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="relative w-16 h-16 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border-4 border-transparent border-t-purple-400 rounded-full"
                  />
                </div>
                <p className="text-purple-200 text-lg">
                  Generating visualizations...
                </p>
              </motion.div>
            )}

            {/* Charts Grid */}
            {vizData && !loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {vizData.visualizations.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800 rounded-lg border border-purple-500 overflow-hidden hover:border-purple-400 transition-colors"
                  >
                    <div className="h-80 p-6">
                      <canvas id={`chart-${index}`}></canvas>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            {vizData && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={fetchVisualizations}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Visualizations
                </button>
              </motion.div>
            )}

            {/* Empty State */}
            {vizData && vizData.visualizations.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-300 text-lg">
                  No visualizations available yet. Try refreshing your data.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};
