import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, 
  Eye, MousePointer, Smartphone, Monitor, Globe, Activity,
  BarChart3, PieChart as PieChartIcon, Target, Zap
} from 'lucide-react';

// Sample data for charts
const salesData = [
  { name: 'Ene', ventas: 4000, visitas: 2400, conversiones: 2400 },
  { name: 'Feb', ventas: 3000, visitas: 1398, conversiones: 2210 },
  { name: 'Mar', ventas: 2000, visitas: 9800, conversiones: 2290 },
  { name: 'Abr', ventas: 2780, visitas: 3908, conversiones: 2000 },
  { name: 'May', ventas: 1890, visitas: 4800, conversions: 2181 },
  { name: 'Jun', ventas: 2390, visitas: 3800, conversions: 2500 },
  { name: 'Jul', ventas: 3490, visitas: 4300, conversions: 2100 },
];

const pieData = [
  { name: 'Móvil', value: 400, color: '#8884d8' },
  { name: 'Desktop', value: 300, color: '#82ca9d' },
  { name: 'Tablet', value: 200, color: '#ffc658' },
  { name: 'Otros', value: 100, color: '#ff7300' },
];

const radarData = [
  { subject: 'Velocidad', A: 120, B: 110, fullMark: 150 },
  { subject: 'Usabilidad', A: 98, B: 130, fullMark: 150 },
  { subject: 'Diseño', A: 86, B: 130, fullMark: 150 },
  { subject: 'Funcionalidad', A: 99, B: 100, fullMark: 150 },
  { subject: 'Rendimiento', A: 85, B: 90, fullMark: 150 },
  { subject: 'Accesibilidad', A: 65, B: 85, fullMark: 150 },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <div className="flex items-center mt-2">
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
        </div>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Update some metrics randomly
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: Activity },
    { id: 'traffic', label: 'Tráfico', icon: Globe },
    { id: 'conversions', label: 'Conversiones', icon: Target },
    { id: 'performance', label: 'Rendimiento', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard de Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitorea el rendimiento de tu aplicación en tiempo real
          </p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Ventas Totales"
            value="$24,500"
            change={12.5}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="bg-green-500"
          />
          <MetricCard
            title="Visitas"
            value="45,230"
            change={-2.3}
            icon={<Eye className="w-6 h-6 text-white" />}
            color="bg-blue-500"
          />
          <MetricCard
            title="Conversiones"
            value="1,234"
            change={8.1}
            icon={<Target className="w-6 h-6 text-white" />}
            color="bg-purple-500"
          />
          <MetricCard
            title="Usuarios Activos"
            value="892"
            change={15.7}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-orange-500"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Sales Trend Chart */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tendencia de Ventas
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="ventas" 
                        stackId="1" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="visitas" 
                        stackId="1" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Sources */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Fuentes de Tráfico
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Métricas de Rendimiento
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                        <Radar
                          name="Actual"
                          dataKey="A"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Objetivo"
                          dataKey="B"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'traffic' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Análisis de Tráfico
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="visitas" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="conversiones" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'conversions' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Análisis de Conversiones
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="conversiones" fill="#8884d8" />
                      <Bar dataKey="ventas" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Móvil
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          2.3s
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Desktop
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          1.8s
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
                    <div className="flex items-center">
                      <MousePointer className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          Tablet
                        </p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          2.1s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Métricas de Rendimiento Web
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ventas" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actividad en Tiempo Real
          </h3>
          <div className="space-y-3">
            {[
              { user: 'María García', action: 'completó una compra', time: 'hace 2 min', amount: '$150' },
              { user: 'Carlos López', action: 'se registró', time: 'hace 5 min', amount: null },
              { user: 'Ana Martínez', action: 'agregó al carrito', time: 'hace 8 min', amount: '$75' },
              { user: 'Luis Rodríguez', action: 'abandonó el carrito', time: 'hace 12 min', amount: '$200' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {activity.user.split(' ')[0][0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.action}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  {activity.amount && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {activity.amount}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;