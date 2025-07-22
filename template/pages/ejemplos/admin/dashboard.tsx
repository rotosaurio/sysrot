import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, CogIcon, UsersIcon, ShoppingBagIcon, CurrencyDollarIcon, TrendingUpIcon, TrendingDownIcon, EyeIcon, PlusIcon } from '@/components/ui/icons';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data - in real app, this would come from APIs
const mockStats = {
  totalRevenue: 45231.89,
  revenueChange: 12.5,
  totalOrders: 1247,
  ordersChange: 8.2,
  totalCustomers: 892,
  customersChange: 15.3,
  averageOrderValue: 36.28,
  aovChange: -2.1
};

const mockRecentOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001234',
    customer: { name: 'Juan Pérez', email: 'juan@email.com' },
    total: 127.50,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-001235',
    customer: { name: 'María García', email: 'maria@email.com' },
    total: 89.99,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-001236',
    customer: { name: 'Carlos López', email: 'carlos@email.com' },
    total: 234.75,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    createdAt: '2024-01-15T08:45:00Z'
  }
];

const mockTopProducts = [
  { id: '1', name: 'iPhone 15 Pro', sales: 234, revenue: 233766 },
  { id: '2', name: 'MacBook Air M3', sales: 89, revenue: 115611 },
  { id: '3', name: 'AirPods Pro', sales: 567, revenue: 141183 },
  { id: '4', name: 'iPad Pro', sales: 123, revenue: 98277 },
  { id: '5', name: 'Apple Watch Series 9', sales: 345, revenue: 137655 }
];

const mockLowStockProducts = [
  { id: '1', name: 'iPhone 15 Pro', stock: 3, lowStockAlert: 5 },
  { id: '2', name: 'MacBook Air M3', stock: 1, lowStockAlert: 3 },
  { id: '3', name: 'Magic Keyboard', stock: 2, lowStockAlert: 5 }
];

// Chart data
const salesChartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Ventas 2024',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Ventas 2023',
      data: [8000, 12000, 11000, 18000, 16000, 22000, 20000, 25000, 23000, 28000, 26000, 32000],
      borderColor: 'rgb(156, 163, 175)',
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      fill: false,
      tension: 0.4
    }
  ]
};

const categoryChartData = {
  labels: ['Electronics', 'Audio', 'Wearables', 'Accessories', 'Otros'],
  datasets: [
    {
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }
  ]
};

const orderStatusChartData = {
  labels: ['Entregados', 'En Proceso', 'Enviados', 'Pendientes', 'Cancelados'],
  datasets: [
    {
      data: [65, 15, 12, 5, 3],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(156, 163, 175, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }
  ]
};

function StatCard({ title, value, change, icon: Icon, prefix = '', suffix = '' }: any) {
  const isPositive = change > 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {isPositive ? (
          <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs último mes</span>
      </div>
    </div>
  );
}

function RecentOrdersTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'Entregado';
      case 'SHIPPED': return 'Enviado';
      case 'PROCESSING': return 'Procesando';
      case 'PENDING': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Órdenes Recientes
          </h3>
          <Link href="/ejemplos/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Ver todas
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockRecentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {order.customer.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button className="text-blue-600 hover:text-blue-700">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopProductsCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Productos Más Vendidos
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockTopProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {product.sales} ventas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ${product.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LowStockAlert() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Stock Bajo
          </h3>
          <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2 py-1 rounded-full">
            {mockLowStockProducts.length} productos
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockLowStockProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Alerta en: {product.lowStockAlert} unidades
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {product.stock} restantes
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/ejemplos/admin/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Gestionar inventario →
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      name: 'Agregar Producto',
      description: 'Añadir nuevo producto al catálogo',
      icon: PlusIcon,
      href: '/ejemplos/admin/products/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Ver Órdenes',
      description: 'Gestionar órdenes pendientes',
      icon: ShoppingBagIcon,
      href: '/ejemplos/admin/orders',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: UsersIcon,
      href: '/ejemplos/admin/users',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Configuración',
      description: 'Configurar tienda y pagos',
      icon: CogIcon,
      href: '/ejemplos/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Acciones Rápidas
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.name} href={action.href} className="group">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {action.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user?.role !== 'admin') {
      router.push('/ejemplos');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Panel de Administración - E-commerce</title>
        <meta name="description" content="Dashboard administrativo para gestión de e-commerce" />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/ecommerce" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🛠️ Panel de Administración
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Gestiona tu tienda en línea
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrador
                  </p>
                </div>
                {session.user?.image && (
                  <img 
                    src={session.user.image} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Ingresos Totales"
              value={mockStats.totalRevenue}
              change={mockStats.revenueChange}
              icon={CurrencyDollarIcon}
              prefix="$"
            />
            <StatCard
              title="Órdenes Totales"
              value={mockStats.totalOrders}
              change={mockStats.ordersChange}
              icon={ShoppingBagIcon}
            />
            <StatCard
              title="Clientes Totales"
              value={mockStats.totalCustomers}
              change={mockStats.customersChange}
              icon={UsersIcon}
            />
            <StatCard
              title="Valor Promedio Orden"
              value={mockStats.averageOrderValue}
              change={mockStats.aovChange}
              icon={TrendingUpIcon}
              prefix="$"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ventas Mensuales
                </h3>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <Line
                    data={salesChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: false }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ventas por Categoría
                </h3>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <Doughnut
                    data={categoryChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Orders - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentOrdersTable />
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <TopProductsCard />
              <LowStockAlert />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Estados de Órdenes
                </h3>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <Doughnut
                    data={orderStatusChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </div>
    </>
  );
}