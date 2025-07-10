import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ChartBarIcon, UsersIcon, CurrencyDollarIcon, TrendingUpIcon } from '@/components/ui/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import * as d3 from 'd3';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data generator
const generateMockData = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const revenue = months.map(() => Math.floor(Math.random() * 50000) + 20000);
  const users = months.map(() => Math.floor(Math.random() * 1000) + 500);
  const sessions = months.map(() => Math.floor(Math.random() * 5000) + 2000);
  
  return {
    months,
    revenue,
    users,
    sessions,
    totalRevenue: revenue.reduce((a, b) => a + b, 0),
    totalUsers: users.reduce((a, b) => a + b, 0),
    avgSessions: Math.floor(sessions.reduce((a, b) => a + b, 0) / sessions.length),
    growth: ((revenue[revenue.length - 1] - revenue[0]) / revenue[0] * 100).toFixed(1)
  };
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('12m');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData(generateMockData());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  useEffect(() => {
    // D3.js Visualization Example
    if (data) {
      createD3Visualization(data);
    }
  }, [data]);

  const createD3Visualization = (data) => {
    // Clear previous visualization
    d3.select('#d3-chart').selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select('#d3-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.months.slice(-6)) // Last 6 months
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.revenue.slice(-6))])
      .range([height, 0]);

    // Add bars
    svg.selectAll('.bar')
      .data(data.revenue.slice(-6))
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => x(data.months.slice(-6)[i]))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d))
      .attr('height', d => height - y(d))
      .attr('fill', '#3B82F6')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#1D4ED8');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#3B82F6');
      });

    // Add x axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add y axis
    svg.append('g')
      .call(d3.axisLeft(y));
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando datos analíticos...</p>
        </div>
      </div>
    );
  }

  const revenueChartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Ingresos ($)',
        data: data.revenue,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const userGrowthData = {
    labels: data.months,
    datasets: [
      {
        label: 'Usuarios Activos',
        data: data.users,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const trafficSourceData = {
    labels: ['Orgánico', 'Redes Sociales', 'Email', 'Directo', 'Pagado'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Head>
        <title>Analytics Dashboard - Full Integration Examples</title>
        <meta name="description" content="Dashboard de analíticas interactivo con Chart.js y D3.js" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📊 Analytics Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Dashboard interactivo con Chart.js y D3.js
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="12m">Últimos 12 meses</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${data.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Usuarios Totales
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Sesiones Promedio
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.avgSessions.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUpIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Crecimiento
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.growth}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ingresos Mensuales
              </h3>
              <Bar data={revenueChartData} options={chartOptions} />
            </div>

            {/* User Growth Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Crecimiento de Usuarios
              </h3>
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Sources */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fuentes de Tráfico
              </h3>
              <div className="w-full h-64 flex justify-center">
                <Doughnut 
                  data={trafficSourceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} 
                />
              </div>
            </div>

            {/* D3.js Visualization */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Visualización D3.js - Últimos 6 Meses
              </h3>
              <div id="d3-chart" className="w-full flex justify-center"></div>
            </div>
          </div>

          {/* Documentation */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📚 Características del Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Chart.js Integration</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Gráficos de barras responsivos</li>
                  <li>• Gráficos de líneas con animaciones</li>
                  <li>• Gráficos de dona interactivos</li>
                  <li>• Tema oscuro compatible</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">D3.js Features</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Visualizaciones personalizadas</li>
                  <li>• Interacciones de mouse</li>
                  <li>• Escalas dinámicas</li>
                  <li>• Animaciones fluidas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
