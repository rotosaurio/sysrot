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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-6xl">
          {product.image}
        </div>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
        
        {/* Tags */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {product.tags.map((tag, index) => (
            <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          {isInWishlist ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="p-6">
        {/* Vendor Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-blue-600 font-medium">{product.vendor}</span>
            {vendors.find(v => v.id === product.vendorId)?.verified && (
              <span className="text-green-500 text-xs">✓</span>
            )}
          </div>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
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
          <div className={`px-2 py-1 rounded-full text-sm ${
            product.inStock 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {product.inStock ? 'En Stock' : 'Agotado'}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2 mb-4">
          <button
            disabled={!product.inStock}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              product.inStock
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span>Agregar al Carrito</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
                  <div key={review.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {vendor.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {vendor.name}
              </h3>
              {vendor.verified && (
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs">
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
      
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
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
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <>
      <Head>
        <title>Marketplace - Full Integration Examples</title>
        <meta name="description" content="Marketplace con sistema de reseñas y vendedores" />
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
                    🏪 Marketplace
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Plataforma de marketplace con reseñas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <HeartIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <ChevronRightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos, vendedores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Productos ({filteredProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'vendors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Vendedores ({vendors.length})
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📚 Características del Marketplace
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Sistema de Reseñas
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Ratings con estrellas</li>
                  <li>• Comentarios de usuarios</li>
                  <li>• Sistema de utilidad</li>
                  <li>• Historial de reseñas</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Gestión de Vendedores
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Perfiles de vendedores</li>
                  <li>• Verificación de vendedores</li>
                  <li>• Métricas de rendimiento</li>
                  <li>• Ubicación geográfica</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Funcionalidades Avanzadas
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Búsqueda y filtros</li>
                  <li>• Lista de deseos</li>
                  <li>• Sistema de descuentos</li>
                  <li>• Gestión de inventario</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}