import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  PlusIcon,
  UserIcon,
  ChevronRightIcon,
  TagIcon
} from '@/components/ui/icons';
import { StarSolidIcon, HeartSolidIcon } from '@/components/ui/icons';

// Mock marketplace data
const vendors = [
  {
    id: 1,
    name: 'TechStore Solutions',
    rating: 4.8,
    reviewCount: 256,
    location: 'Madrid, España',
    verified: true,
    products: 45
  },
  {
    id: 2,
    name: 'Digital Marketplace',
    rating: 4.6,
    reviewCount: 189,
    location: 'Barcelona, España',
    verified: true,
    products: 32
  },
  {
    id: 3,
    name: 'Innovation Hub',
    rating: 4.9,
    reviewCount: 412,
    location: 'Valencia, España',
    verified: false,
    products: 67
  }
];

const products = [
  {
    id: 1,
    name: 'Smartphone Pro Max',
    vendor: 'TechStore Solutions',
    vendorId: 1,
    price: 899,
    originalPrice: 999,
    rating: 4.7,
    reviews: 89,
    image: '📱',
    category: 'Electronics',
    tags: ['Premium', 'Latest'],
    description: 'El smartphone más avanzado con cámara profesional',
    inStock: true,
    discount: 10
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    vendor: 'Digital Marketplace',
    vendorId: 2,
    price: 199,
    originalPrice: 249,
    rating: 4.5,
    reviews: 156,
    image: '🎧',
    category: 'Audio',
    tags: ['Bestseller'],
    description: 'Auriculares inalámbricos con cancelación de ruido',
    inStock: true,
    discount: 20
  },
  {
    id: 3,
    name: 'Gaming Laptop',
    vendor: 'Innovation Hub',
    vendorId: 3,
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 234,
    image: '💻',
    category: 'Computers',
    tags: ['Gaming', 'High Performance'],
    description: 'Laptop gaming con GPU dedicada y pantalla 144Hz',
    inStock: false,
    discount: 13
  },
  {
    id: 4,
    name: 'Smart Watch',
    vendor: 'TechStore Solutions',
    vendorId: 1,
    price: 299,
    originalPrice: 349,
    rating: 4.4,
    reviews: 167,
    image: '⌚',
    category: 'Wearables',
    tags: ['Health', 'Fitness'],
    description: 'Reloj inteligente con monitoreo de salud',
    inStock: true,
    discount: 14
  },
  {
    id: 5,
    name: 'Tablet Pro',
    vendor: 'Digital Marketplace',
    vendorId: 2,
    price: 599,
    originalPrice: 699,
    rating: 4.6,
    reviews: 98,
    image: '📱',
    category: 'Electronics',
    tags: ['Creative', 'Professional'],
    description: 'Tablet profesional para diseño y productividad',
    inStock: true,
    discount: 14
  },
  {
    id: 6,
    name: 'Wireless Speaker',
    vendor: 'Innovation Hub',
    vendorId: 3,
    price: 149,
    originalPrice: 179,
    rating: 4.3,
    reviews: 134,
    image: '🔊',
    category: 'Audio',
    tags: ['Portable'],
    description: 'Altavoz Bluetooth resistente al agua',
    inStock: true,
    discount: 17
  }
];

const reviews = [
  {
    id: 1,
    productId: 1,
    user: 'Carlos M.',
    rating: 5,
    comment: 'Excelente producto, superó mis expectativas. La calidad es increíble.',
    date: '2024-01-15',
    helpful: 12
  },
  {
    id: 2,
    productId: 1,
    user: 'Ana L.',
    rating: 4,
    comment: 'Muy bueno, aunque el precio es un poco alto. La cámara es fantástica.',
    date: '2024-01-10',
    helpful: 8
  },
  {
    id: 3,
    productId: 2,
    user: 'Miguel R.',
    rating: 5,
    comment: 'La cancelación de ruido es perfecta. Ideal para trabajar desde casa.',
    date: '2024-01-12',
    helpful: 15
  }
];

function ProductCard({ product, onToggleWishlist, isInWishlist }: any) {
  const [showReviews, setShowReviews] = useState(false);
  const productReviews = reviews.filter(review => review.productId === product.id);
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 rounded-2xl shadow-lg border border-blue-200/60 dark:border-blue-800/60 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-slate-100 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/30 flex items-center justify-center text-6xl">
          {product.image}
        </div>
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md border border-red-200 dark:border-red-800">
            -{product.discount}%
          </div>
        )}
        {/* Tags */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {product.tags.map((tag, index) => (
            <span key={index} className="bg-gradient-to-r from-blue-100/60 to-purple-100/60 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800 shadow-sm">
              {tag}
            </span>
          ))}
        </div>
        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-gray-900/80 rounded-full shadow-md hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 dark:hover:from-pink-900/30 dark:hover:to-red-900/30 transition-colors border border-gray-200 dark:border-gray-700"
          aria-label={isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isInWishlist ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
      <div className="p-6">
        {/* Vendor Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r from-blue-100/60 to-purple-100/60 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800 shadow-sm">
              {product.vendor}
            </span>
            {vendors.find(v => v.id === product.vendorId)?.verified && (
              <span className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 shadow-sm ml-1">
                ✓
              </span>
            )}
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-blue-100/60 to-purple-100/60 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800 shadow-sm">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {product.description}
        </p>
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarSolidIcon
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              €{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                €{product.originalPrice}
              </span>
            )}
          </div>
          <div className={`px-2 py-1 rounded-full text-sm font-bold shadow-sm ${
            product.inStock 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {product.inStock ? 'En Stock' : 'Agotado'}
          </div>
        </div>
        {/* Actions */}
        <div className="flex space-x-2 mb-4">
          <button
            disabled={!product.inStock}
            className={`flex-1 py-2 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2 font-semibold ${
              product.inStock
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Agregar al carrito"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span>Agregar al Carrito</span>
          </button>
          <button className="px-4 py-2 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-semibold">
            Ver Detalles
          </button>
        </div>
        {/* Reviews Toggle */}
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showReviews ? 'Ocultar' : 'Ver'} Reseñas ({productReviews.length})
        </button>
        {/* Reviews Section */}
        {showReviews && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {productReviews.length > 0 ? (
              <div className="space-y-3">
                {productReviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="bg-gradient-to-r from-slate-100 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/30 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                    <div className="text-xs text-gray-500">
                      👍 {review.helpful} personas encontraron esto útil
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay reseñas aún. ¡Sé el primero en dejar una!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VendorCard({ vendor }: any) {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 rounded-2xl shadow-lg border border-blue-200/60 dark:border-blue-800/60 p-6 hover:shadow-2xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {vendor.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {vendor.name}
              </h3>
              {vendor.verified && (
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 shadow-sm">
                  Verificado ✓
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              <ChevronRightIcon className="w-4 h-4" />
              <span>{vendor.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <div className="text-2xl font-bold text-blue-600">{vendor.rating}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Rating</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{vendor.reviewCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Reseñas</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{vendor.products}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Productos</div>
        </div>
      </div>
      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold">
        Ver Tienda
      </button>
    </div>
  );
}

export default function MarketplaceDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('products');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showCode, setShowCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev: string[]) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev: string[]) => prev.slice(1));
    }, 3000);
  };

  const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-green-400 font-mono text-sm">{title}</h4>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            addNotification('Código copiado al portapapeles! 🛒');
          }}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          Copiar
        </button>
      </div>
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
  
  const categories = ['All', 'Electronics', 'Audio', 'Computers', 'Wearables'];
  const sortOptions = [
    { value: 'featured', label: 'Destacados' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Valorados' },
    { value: 'reviews', label: 'Más Reseñas' }
  ];
  
  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (searchTerm === '' || 
       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
  
  const toggleWishlist = (productId: number) => {
    const product = products.find(p => p.id === productId);
    setWishlist(prev => {
      const isAdding = !prev.includes(productId);
      if (isAdding) {
        addNotification(`❤️ "${product?.name}" agregado a favoritos`);
        return [...prev, productId];
      } else {
        addNotification(`💔 "${product?.name}" removido de favoritos`);
        return prev.filter(id => id !== productId);
      }
    });
  };

  return (
    <>
      <Head>
        <title>Marketplace Pro - Full Integration Examples</title>
        <meta name="description" content="Marketplace profesional con sistema de reseñas, vendedores y carrito de compras" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30">
        {/* Notificaciones */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 animate-in slide-in-from-right duration-300"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                {notification}
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <span>🏪</span>
                    Marketplace Pro
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Digital Marketplace
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {products.length} productos disponibles
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      {vendors.length} vendedores verificados
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCode(showCode === 'marketplace' ? null : 'marketplace')}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-sm font-medium"
                >
                  <span>📝</span>
                  <span>{showCode === 'marketplace' ? 'Ocultar' : 'Ver'} Código</span>
                </button>

                <div className="relative">
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                    <HeartIcon className="w-6 h-6" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                </div>
                
                <button 
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                  onClick={() => addNotification('Carrito de compras próximamente! 🛒')}
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                </button>
                
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {showCode === 'marketplace' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CodeBlock
              title="Marketplace con Sistema de Reseñas y Vendedores"
              code={`// Marketplace Implementation
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  vendor: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  inStock: boolean;
  discount: number;
}

interface Vendor {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  products: number;
}

function MarketplaceComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (searchTerm === '' || 
       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="marketplace-container">
      {/* Search & Filters */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleWishlist={toggleWishlist}
            isInWishlist={wishlist.includes(product.id)}
          />
        ))}
      </div>

      {/* Vendors Section */}
      <div className="vendors-section">
        {vendors.map(vendor => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}

// ProductCard with Reviews
function ProductCard({ product, onToggleWishlist, isInWishlist }) {
  const [showReviews, setShowReviews] = useState(false);

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image}
        {product.discount > 0 && (
          <div className="discount-badge">-{product.discount}%</div>
        )}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="wishlist-btn"
        >
          {isInWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="vendor">By {product.vendor}</div>
        <div className="rating">
          {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
        </div>
        <div className="price">
          €{product.price}
          {product.originalPrice > product.price && (
            <span className="original-price">€{product.originalPrice}</span>
          )}
        </div>
        
        <button className="add-to-cart">
          Agregar al Carrito
        </button>
        
        <button onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? 'Ocultar' : 'Ver'} Reseñas
        </button>
        
        {showReviews && (
          <div className="reviews-section">
            {/* Reviews implementation */}
          </div>
        )}
      </div>
    </div>
  );
}`}
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar productos, vendedores... 🛍️"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? '📦 Todas las categorías' : `📱 ${category}`}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 border-b-2 transition-all duration-300 font-medium ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20 rounded-t-lg px-4 -mb-px'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-lg px-4'
                }`}
              >
                🛍️ Productos ({filteredProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-4 border-b-2 transition-all duration-300 font-medium ${
                  activeTab === 'vendors'
                    ? 'border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-900/20 rounded-t-lg px-4 -mb-px'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-lg px-4'
                }`}
              >
                🏪 Vendedores ({vendors.length})
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onToggleWishlist={toggleWishlist}
                      isInWishlist={wishlist.includes(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChevronRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No se encontraron productos que coincidan con tu búsqueda.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vendors Tab */}
          {activeTab === 'vendors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🚀 Marketplace Pro - Funcionalidades
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Plataforma completa de comercio electrónico con sistema de reseñas, vendedores verificados y experiencia optimizada
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl">
                    ⭐
                  </div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 ml-3">
                    Sistema de Reseñas
                  </h3>
                </div>
                <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Ratings con estrellas</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Comentarios detallados</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Sistema de utilidad de reseñas</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Historial y moderación</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Verificación de compras</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🏪
                  </div>
                  <h3 className="font-bold text-purple-900 dark:text-purple-100 ml-3">
                    Gestión de Vendedores
                  </h3>
                </div>
                <ul className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Perfiles completos de vendedores</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Verificación y certificación</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Métricas de rendimiento</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Ubicación geográfica</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Estadísticas de ventas</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🛒
                  </div>
                  <h3 className="font-bold text-green-900 dark:text-green-100 ml-3">
                    Experiencia de Compra
                  </h3>
                </div>
                <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Búsqueda avanzada y filtros</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Lista de deseos personalizada</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Sistema de descuentos</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Carrito de compras inteligente</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Recomendaciones personalizadas</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200/50 dark:border-orange-800/50">
                <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                                     Análisis e Inteligencia de Negocio
                </h3>
                <ul className="text-orange-800 dark:text-orange-200 space-y-2 text-sm">
                  <li>• Dashboard de métricas en tiempo real</li>
                  <li>• Análisis de comportamiento de usuarios</li>
                  <li>• Reportes de ventas y conversión</li>
                  <li>• Seguimiento de inventario automático</li>
                  <li>• Predicciones de demanda con IA</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-800/50">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
                  <span className="text-2xl mr-3">💎</span>
                  Funcionalidades Avanzadas
                </h3>
                <ul className="text-indigo-800 dark:text-indigo-200 space-y-2 text-sm">
                  <li>• Sistema de categorías dinámico</li>
                  <li>• Comparador de productos</li>
                  <li>• Chat en vivo con vendedores</li>
                  <li>• Programa de afiliados integrado</li>
                  <li>• API RESTful para integraciones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
