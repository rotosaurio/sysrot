import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon, ShoppingCartIcon, HeartIcon, StarIcon, HeartSolidIcon } from '@/components/ui/icons';

// Mock products data
const products = [
  {
    id: 1,
    name: 'Laptop Pro 16"',
    price: 2499.99,
    originalPrice: 2799.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 324,
    category: 'Electronics',
    inStock: true,
    description: 'Laptop profesional de alto rendimiento con pantalla de 16 pulgadas'
  },
  {
    id: 2,
    name: 'Auriculares Bluetooth',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 189,
    category: 'Audio',
    inStock: true,
    description: 'Auriculares inalámbricos con cancelación de ruido'
  },
  {
    id: 3,
    name: 'Smartphone Ultra',
    price: 899.99,
    originalPrice: 999.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 567,
    category: 'Electronics',
    inStock: false,
    description: 'Smartphone de última generación con múltiples cámaras'
  },
  {
    id: 4,
    name: 'Smartwatch Sport',
    price: 399.99,
    originalPrice: 449.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 145,
    category: 'Wearables',
    inStock: true,
    description: 'Reloj inteligente para deportistas y fitness'
  },
  {
    id: 5,
    name: 'Tablet Pro 12"',
    price: 1299.99,
    originalPrice: 1499.99,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 234,
    category: 'Electronics',
    inStock: true,
    description: 'Tablet profesional con stylus incluido'
  },
  {
    id: 6,
    name: 'Cámara Mirrorless',
    price: 1799.99,
    originalPrice: 1999.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 89,
    category: 'Photography',
    inStock: true,
    description: 'Cámara sin espejo de alta calidad para profesionales'
  }
];

export default function EcommercePage() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Audio', 'Wearables', 'Photography'];

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites(currentFavorites =>
      currentFavorites.includes(productId)
        ? currentFavorites.filter(id => id !== productId)
        : [...currentFavorites, productId]
    );
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Head>
        <title>E-commerce Demo - Integración Completa</title>
        <meta name="description" content="Demo de tienda en línea con carrito de compras y gestión de estado" />
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
                    🛍️ E-commerce Demo
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tienda en línea con carrito de compras y gestión de estado
                  </p>
                </div>
              </div>
              
              {/* Cart Summary */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <ShoppingCartIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow"
                      >
                        {favorites.includes(product.id) ? (
                          <HeartSolid className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                          <span className="text-white font-semibold">Agotado</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {renderStars(product.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {product.rating} ({product.reviews} reseñas)
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ${product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'Agregar al Carrito' : 'No Disponible'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart Sidebar */}
            <div className="w-full lg:w-80">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Carrito de Compras
                </h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div>
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${item.price} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded text-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded text-sm"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 text-sm ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Cart Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Proceder al Pago
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              🛍️ Características del E-commerce
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Gestión de Estado</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Carrito de compras persistente</li>
                  <li>• Lista de favoritos</li>
                  <li>• Filtros por categoría</li>
                  <li>• Gestión de stock</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Funcionalidades</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Agregar/quitar productos</li>
                  <li>• Modificar cantidades</li>
                  <li>• Sistema de rating</li>
                  <li>• Precios con descuentos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">UI/UX</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Diseño responsive</li>
                  <li>• Tema oscuro compatible</li>
                  <li>• Animaciones suaves</li>
                  <li>• Componentes reutilizables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 