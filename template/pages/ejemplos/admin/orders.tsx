import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, EyeIcon, TruckIcon, CheckCircleIcon, XCircleIcon, SearchIcon, FunnelIcon, CalendarIcon } from '@/components/ui/icons';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  currency: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  notes?: string;
  couponCode?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      name: string;
      images: Array<{ url: string; alt?: string }>;
    };
  }>;
  shippingAddress?: any;
  billingAddress?: any;
}

function OrderStatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          text: 'Pendiente'
        };
      case 'CONFIRMED':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          text: 'Confirmado'
        };
      case 'PROCESSING':
        return {
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
          text: 'Procesando'
        };
      case 'SHIPPED':
        return {
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
          text: 'Enviado'
        };
      case 'DELIVERED':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          text: 'Entregado'
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          text: 'Cancelado'
        };
      case 'REFUNDED':
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          text: 'Reembolsado'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.text}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          text: 'Pendiente'
        };
      case 'PAID':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          text: 'Pagado'
        };
      case 'FAILED':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          text: 'Fallido'
        };
      case 'REFUNDED':
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          text: 'Reembolsado'
        };
      case 'PARTIALLY_REFUNDED':
        return {
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
          text: 'Parcialmente Reembolsado'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.text}
    </span>
  );
}

function OrderCard({ order, onView, onUpdateStatus }: { 
  order: Order; 
  onView: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextActions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['PROCESSING', 'CANCELLED'];
      case 'PROCESSING':
        return ['SHIPPED', 'CANCELLED'];
      case 'SHIPPED':
        return ['DELIVERED'];
      default:
        return [];
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmar';
      case 'PROCESSING': return 'Procesar';
      case 'SHIPPED': return 'Enviar';
      case 'DELIVERED': return 'Marcar Entregado';
      case 'CANCELLED': return 'Cancelar';
      default: return status;
    }
  };

  const getActionColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-600 hover:bg-blue-700';
      case 'PROCESSING': return 'bg-purple-600 hover:bg-purple-700';
      case 'SHIPPED': return 'bg-indigo-600 hover:bg-indigo-700';
      case 'DELIVERED': return 'bg-green-600 hover:bg-green-700';
      case 'CANCELLED': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const nextActions = getNextActions(order.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
      {/* Order Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center space-x-3 mb-4">
        {order.user.image ? (
          <img 
            src={order.user.image} 
            alt={order.user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {order.user.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {order.user.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {order.user.email}
          </p>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {item.product.images?.[0] ? (
                <img 
                  src={item.product.images[0].url} 
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">📦</span>
                </div>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{order.items.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Total */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          ${order.total.toFixed(2)}
        </span>
      </div>

      {/* Tracking Info */}
      {order.trackingNumber && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <TruckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Tracking: {order.trackingNumber}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between space-x-2">
        <button
          onClick={() => onView(order.id)}
          className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <EyeIcon className="w-4 h-4" />
          <span>Ver Detalles</span>
        </button>

        {nextActions.length > 0 && (
          <div className="flex space-x-2">
            {nextActions.map((action) => (
              <button
                key={action}
                onClick={() => handleStatusUpdate(action)}
                disabled={isUpdating}
                className={`px-3 py-2 text-white text-sm rounded-lg transition-colors disabled:opacity-50 ${getActionColor(action)}`}
              >
                {isUpdating ? '...' : getActionText(action)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderDetailModal({ 
  isOpen, 
  onClose, 
  order,
  onUpdateStatus,
  onAddTracking
}: {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
  onUpdateStatus: (id: string, status: string) => void;
  onAddTracking: (id: string, trackingNumber: string) => void;
}) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order) {
      setTrackingNumber(order.trackingNumber || '');
      setNotes(order.notes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleAddTracking = () => {
    if (trackingNumber.trim()) {
      onAddTracking(order.id, trackingNumber.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles de Orden {order.orderNumber}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status & Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Estado de la Orden
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Pago:</span>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Creado:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {order.shippedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Enviado:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(order.shippedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {order.deliveredAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Entregado:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(order.deliveredAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Información del Cliente
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      {order.user.image ? (
                        <img 
                          src={order.user.image} 
                          alt={order.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {order.user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Resumen de la Orden
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">
                      ${order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Impuestos:</span>
                    <span className="text-gray-900 dark:text-white">
                      ${order.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Envío:</span>
                    <span className="text-gray-900 dark:text-white">
                      ${order.shipping.toFixed(2)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                      <span>Descuento:</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {order.couponCode && (
                    <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                      <span>Cupón:</span>
                      <span>{order.couponCode}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Productos ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                      {item.product.images?.[0] ? (
                        <img 
                          src={item.product.images[0].url} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Number */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Información de Envío
              </h3>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Número de tracking"
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleAddTracking}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </div>

            {/* Addresses */}
            {order.shippingAddress && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Dirección de Envío
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  {order.shippingAddress.company && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {order.shippingAddress.company}
                    </p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.address1}
                  </p>
                  {order.shippingAddress.address2 && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {order.shippingAddress.address2}
                    </p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.country}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Tel: {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Notas
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Auth check
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

  // Load data
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      loadOrders();
    }
  }, [session, page, statusFilter, paymentFilter, searchTerm]);

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(statusFilter && { status: statusFilter }),
        ...(paymentFilter && { paymentStatus: paymentFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/ecommerce/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        toast.error('Error cargando órdenes');
      }
    } catch (error) {
      toast.error('Error cargando órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/ecommerce/orders?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success('Estado actualizado exitosamente');
        loadOrders();
        
        // Update selected order if it's open
        if (selectedOrder?.id === id) {
          const updatedOrder = { ...selectedOrder, status };
          setSelectedOrder(updatedOrder);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error actualizando estado');
      }
    } catch (error) {
      toast.error('Error actualizando estado');
    }
  };

  const handleAddTracking = async (id: string, trackingNumber: string) => {
    try {
      const response = await fetch(`/api/ecommerce/orders?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber })
      });

      if (response.ok) {
        toast.success('Tracking actualizado exitosamente');
        loadOrders();
        
        // Update selected order if it's open
        if (selectedOrder?.id === id) {
          const updatedOrder = { ...selectedOrder, trackingNumber };
          setSelectedOrder(updatedOrder);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error actualizando tracking');
      }
    } catch (error) {
      toast.error('Error actualizando tracking');
    }
  };

  if (status === 'loading' || loading) {
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
        <title>Gestión de Órdenes - Admin</title>
        <meta name="description" content="Gestión de órdenes del e-commerce" />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/admin/dashboard" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📋 Gestión de Órdenes
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {orders.length} órdenes encontradas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar órdenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="CONFIRMED">Confirmados</option>
                <option value="PROCESSING">Procesando</option>
                <option value="SHIPPED">Enviados</option>
                <option value="DELIVERED">Entregados</option>
                <option value="CANCELLED">Cancelados</option>
                <option value="REFUNDED">Reembolsados</option>
              </select>

              {/* Payment Status Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Estado de pago</option>
                <option value="PENDING">Pendiente</option>
                <option value="PAID">Pagado</option>
                <option value="FAILED">Fallido</option>
                <option value="REFUNDED">Reembolsado</option>
                <option value="PARTIALLY_REFUNDED">Parcialmente Reembolsado</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPaymentFilter('');
                  setPage(1);
                }}
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Limpiar</span>
              </button>

              {/* Date Filter - TODO: Implement */}
              <button className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>Fecha</span>
              </button>
            </div>
          </div>

          {/* Orders Grid */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron órdenes
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter || paymentFilter
                  ? 'Prueba ajustando los filtros.'
                  : 'Las órdenes aparecerán aquí cuando los clientes hagan compras.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {orders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onView={handleViewOrder}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Página {page} de {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          onUpdateStatus={handleUpdateStatus}
          onAddTracking={handleAddTracking}
        />
      </div>
    </>
  );
}