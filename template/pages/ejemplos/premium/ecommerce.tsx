import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon, ShoppingCartIcon, PlusIcon, MinusIcon, TrashIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
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
    reviews: 1250
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    price: 1299,
    image: '💻',
    description: 'Laptop ultraligera con chip M3',
    category: 'Electronics',
    rating: 4.9,
    reviews: 850
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    image: '🎧',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    category: 'Audio',
    rating: 4.7,
    reviews: 2100
  },
  {
    id: 4,
    name: 'Apple Watch Series 9',
    price: 399,
    image: '⌚',
    description: 'Smartwatch avanzado con GPS',
    category: 'Wearables',
    rating: 4.6,
    reviews: 1800
  },
  {
    id: 5,
    name: 'iPad Pro',
    price: 799,
    image: '📱',
    description: 'Tablet profesional con chip M3',
    category: 'Electronics',
    rating: 4.8,
    reviews: 950
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    price: 299,
    image: '⌨️',
    description: 'Teclado inalámbrico premium',
    category: 'Accessories',
    rating: 4.5,
    reviews: 600
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

export default function EcommerceDemo() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { getCartItemsCount } = useStore();
  
  const categories = ['All', 'Electronics', 'Audio', 'Wearables', 'Accessories'];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <Head>
        <title>E-commerce Demo - Premium Examples</title>
        <meta name="description" content="Tienda en línea básica con carrito de compras funcional" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/premium" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🛍️ E-commerce Demo
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tienda en línea con carrito funcional
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron productos en esta categoría.
              </p>
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