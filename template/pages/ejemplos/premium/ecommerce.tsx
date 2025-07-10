import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon, ShoppingCartIcon, PlusIcon, MinusIcon, TrashIcon, HeartIcon, HeartSolidIcon } from '@/components/ui/icons';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Sample products data
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 999,
    image: '📱',
    description: 'El iPhone más avanzado con chip A17 Pro',
    category: 'Electronics',
    rating: 4.8,
    reviews: 1250,
    stock: 15
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    price: 1299,
    image: '💻',
    description: 'Laptop ultraligera con chip M3',
    category: 'Electronics',
    rating: 4.9,
    reviews: 850,
    stock: 8
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    image: '🎧',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    category: 'Audio',
    rating: 4.7,
    reviews: 2100,
    stock: 25
  },
  {
    id: 4,
    name: 'Apple Watch Series 9',
    price: 399,
    image: '⌚',
    description: 'Smartwatch avanzado con GPS',
    category: 'Wearables',
    rating: 4.6,
    reviews: 1800,
    stock: 12
  },
  {
    id: 5,
    name: 'iPad Pro',
    price: 799,
    image: '📱',
    description: 'Tablet profesional con chip M3',
    category: 'Electronics',
    rating: 4.8,
    reviews: 950,
    stock: 6
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    price: 299,
    image: '⌨️',
    description: 'Teclado inalámbrico premium',
    category: 'Accessories',
    rating: 4.5,
    reviews: 600,
    stock: 20
  }
];

// Zustand store for cart and wishlist
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface StoreState {
  cartItems: CartItem[];
  wishlist: number[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleWishlist: (id: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      wishlist: [],
      addToCart: (product) => {
        const items = get().cartItems;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            cartItems: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({
            cartItems: [...items, { ...product, quantity: 1 }]
          });
        }
      },
      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter(item => item.id !== id)
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        
        set({
          cartItems: get().cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },
      toggleWishlist: (id) => {
        const wishlist = get().wishlist;
        const isInWishlist = wishlist.includes(id);
        
        set({
          wishlist: isInWishlist
            ? wishlist.filter(itemId => itemId !== id)
            : [...wishlist, id]
        });
      },
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      getCartItemsCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'ecommerce-store'
    }
  )
);

function ProductCard({ product }: { product: any }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isInWishlist = wishlist.includes(product.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-6xl">
          {product.image}
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          {isInWishlist ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-blue-600 font-medium">{product.category}</span>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="ml-auto w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Carrito de Compras
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-400 hover:text-red-600 ml-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${getCartTotal().toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Proceder al Pago
              </button>
              <button
                onClick={clearCart}
                className="w-full border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stripe Configuration Component  
interface StripeConfigType {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  currency: string;
}

function StripeConfig({ onSave }: { onSave: (config: StripeConfigType) => void }) {
  const [config, setConfig] = useState({
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    currency: 'usd'
  });
  const [showKeys, setShowKeys] = useState(false);

  const handleSave = () => {
    onSave(config);
    alert('Configuración de Stripe guardada! (En producción se almacenaría de forma segura)');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💳</span>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Configuración de Stripe
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Publishable Key
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={config.publishableKey}
            onChange={(e) => setConfig({...config, publishableKey: e.target.value})}
            placeholder="pk_test_..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secret Key
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={config.secretKey}
            onChange={(e) => setConfig({...config, secretKey: e.target.value})}
            placeholder="sk_test_..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Webhook Secret
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={config.webhookSecret}
            onChange={(e) => setConfig({...config, webhookSecret: e.target.value})}
            placeholder="whsec_..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Moneda
          </label>
          <select
            value={config.currency}
            onChange={(e) => setConfig({...config, currency: e.target.value})}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="usd">USD - Dólar Estadounidense</option>
            <option value="eur">EUR - Euro</option>
            <option value="gbp">GBP - Libra Esterlina</option>
            <option value="mxn">MXN - Peso Mexicano</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            {showKeys ? 'Ocultar keys' : 'Mostrar keys'}
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}

// Database Configuration Component
interface DatabaseConfigType {
  type: string;
  connectionString: string;
  database: string;
  username: string;
  password: string;
}

function DatabaseConfig({ onSave }: { onSave: (config: DatabaseConfigType) => void }) {
  const [config, setConfig] = useState({
    type: 'mongodb',
    connectionString: '',
    database: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    onSave(config);
    alert('Configuración de base de datos guardada! (En producción se almacenaría de forma segura)');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🗄️</span>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Configuración de Base de Datos
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Base de Datos
          </label>
          <select
            value={config.type}
            onChange={(e) => setConfig({...config, type: e.target.value})}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="mongodb">MongoDB</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URI de Conexión
          </label>
          <input
            type="text"
            value={config.connectionString}
            onChange={(e) => setConfig({...config, connectionString: e.target.value})}
            placeholder="mongodb://localhost:27017 o postgresql://localhost:5432"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => setConfig({...config, username: e.target.value})}
              placeholder="usuario"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={config.password}
                onChange={(e) => setConfig({...config, password: e.target.value})}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EcommerceDemo() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('products');
  const [stripeConfig, setStripeConfig] = useState<StripeConfigType | null>(null);
  const [databaseConfig, setDatabaseConfig] = useState<DatabaseConfigType | null>(null);
  const { getCartItemsCount } = useStore();
  
  const categories = ['All', 'Electronics', 'Audio', 'Wearables', 'Accessories'];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <Head>
        <title>E-commerce Demo - Full Integration Examples</title>
        <meta name="description" content="Tienda en línea básica con carrito de compras funcional" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/premium" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🛍️ E-commerce Avanzado
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tienda completa con Stripe y base de datos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {stripeConfig && (
                  <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Stripe configurado</span>
                  </div>
                )}
                {databaseConfig && (
                  <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">DB configurada</span>
                  </div>
                )}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'products', name: '🛒 Productos', icon: '🛒' },
                { id: 'stripe', name: '💳 Stripe', icon: '💳' },
                { id: 'database', name: '🗄️ Base de Datos', icon: '🗄️' },
                { id: 'integration', name: '⚙️ Integración', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              {/* Category Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filtrar por Categoría
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay productos disponibles en esta categoría.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stripe Configuration Tab */}
          {activeTab === 'stripe' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Configuración de Stripe
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Configura tus claves de Stripe para habilitar los pagos en tu tienda.
                  Una vez configurado, podrás procesar pagos de forma segura.
                </p>
              </div>
              
              <StripeConfig onSave={setStripeConfig} />
              
              {stripeConfig && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                        Stripe configurado correctamente
                      </h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>Tu tienda está lista para procesar pagos con {stripeConfig.currency.toUpperCase()}.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Database Configuration Tab */}
          {activeTab === 'database' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Configuración de Base de Datos
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Conecta tu base de datos para almacenar productos, pedidos y usuarios.
                  Soportamos MongoDB, PostgreSQL, MySQL y SQLite.
                </p>
              </div>
              
              <DatabaseConfig onSave={setDatabaseConfig} />
              
              {databaseConfig && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Base de datos configurada
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>Conexión establecida con {databaseConfig.type}.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Integration Guide Tab */}
          {activeTab === 'integration' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Guía de Integración
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Sigue estos pasos para integrar completamente Stripe y tu base de datos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stripe Integration */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>💳</span>
                    Integración de Stripe
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-green-400 text-sm mb-2">// Instalación</div>
                      <pre className="text-gray-300 text-sm"><code>{`npm install stripe @stripe/stripe-js`}</code></pre>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-green-400 text-sm mb-2">// Cliente Stripe</div>
                      <pre className="text-gray-300 text-sm"><code>{`import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default stripePromise;`}</code></pre>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-green-400 text-sm mb-2">// API Route para pagos</div>
                      <pre className="text-gray-300 text-sm"><code>{`// pages/api/create-payment-intent.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // centavos
    currency: 'usd',
  });
  
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}`}</code></pre>
                    </div>
                  </div>
                </div>

                {/* Database Integration */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>🗄️</span>
                    Integración de Base de Datos
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-green-400 text-sm mb-2">// MongoDB con Mongoose</div>
                      <pre className="text-gray-300 text-sm"><code>{`npm install mongoose`}</code></pre>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-green-400 text-sm mb-2">// Modelo de Producto</div>
                      <pre className="text-gray-300 text-sm"><code>{`const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  stock: Number,
  stripeProductId: String
});

export default mongoose.model('Product', productSchema);`}</code></pre>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-green-400 text-sm mb-2">// Conexión a DB</div>
                      <pre className="text-gray-300 text-sm"><code>{`import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error:', error);
  }
};

export default connectDB;`}</code></pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  🚀 ¡Ya tienes todo listo!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Variables de Entorno</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-gray-300 text-sm"><code>{`# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
MONGODB_URI=mongodb://localhost:27017/ecommerce`}</code></pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Próximos pasos</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>✅ Configurar webhooks de Stripe</li>
                      <li>✅ Implementar autenticación de usuarios</li>
                      <li>✅ Agregar gestión de inventario</li>
                      <li>✅ Configurar envío de emails</li>
                      <li>✅ Implementar sistema de reseñas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Documentation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📚 Características del E-commerce
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Estado Global con Zustand
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Carrito persistente en localStorage</li>
                  <li>• Estado compartido entre componentes</li>
                  <li>• Manejo de wishlist</li>
                  <li>• Cálculos automáticos de totales</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Funcionalidades
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Agregar/quitar productos</li>
                  <li>• Actualizar cantidades</li>
                  <li>• Filtros por categoría</li>
                  <li>• Sistema de favoritos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  UI/UX Features
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Sidebar deslizante del carrito</li>
                  <li>• Notificaciones de estado</li>
                  <li>• Responsive design</li>
                  <li>• Animaciones suaves</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}