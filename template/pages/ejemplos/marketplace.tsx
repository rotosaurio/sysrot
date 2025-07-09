import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  condition: 'new' | 'used' | 'refurbished';
  tags: string[];
}

interface Review {
  id: number;
  productId: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 2023",
    description: "Latest MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect condition, barely used.",
    price: 1899.99,
    image: "💻",
    category: "Electronics",
    rating: 4.8,
    reviews: 12,
    seller: "TechGuru",
    location: "San Francisco, CA",
    condition: "used",
    tags: ["laptop", "apple", "macbook", "m2"]
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "Brand new iPhone 15 Pro, 256GB, Titanium. Unlocked, comes with original box and accessories.",
    price: 999.99,
    image: "📱",
    category: "Electronics",
    rating: 4.9,
    reviews: 8,
    seller: "MobileExpert",
    location: "New York, NY",
    condition: "new",
    tags: ["phone", "apple", "iphone", "5g"]
  },
  {
    id: 3,
    name: "Nike Air Jordan 1",
    description: "Classic Air Jordan 1 Retro High OG, Chicago colorway. Size 10, excellent condition.",
    price: 299.99,
    image: "👟",
    category: "Fashion",
    rating: 4.6,
    reviews: 15,
    seller: "SneakerHead",
    location: "Los Angeles, CA",
    condition: "used",
    tags: ["shoes", "nike", "jordan", "retro"]
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    description: "Premium noise-canceling headphones. Like new, includes carrying case and all accessories.",
    price: 349.99,
    image: "🎧",
    category: "Electronics",
    rating: 4.7,
    reviews: 6,
    seller: "AudioPro",
    location: "Seattle, WA",
    condition: "refurbished",
    tags: ["headphones", "sony", "wireless", "noise-canceling"]
  },
  {
    id: 5,
    name: "Leica M10-R",
    description: "Professional rangefinder camera. Excellent condition, includes 35mm f/2 lens.",
    price: 5999.99,
    image: "📷",
    category: "Electronics",
    rating: 4.9,
    reviews: 3,
    seller: "PhotoMaster",
    location: "Chicago, IL",
    condition: "used",
    tags: ["camera", "leica", "rangefinder", "professional"]
  },
  {
    id: 6,
    name: "Rolex Submariner",
    description: "Classic Rolex Submariner Date, 40mm. Authentic, includes box and papers.",
    price: 8999.99,
    image: "⌚",
    category: "Luxury",
    rating: 4.8,
    reviews: 2,
    seller: "LuxuryTime",
    location: "Miami, FL",
    condition: "used",
    tags: ["watch", "rolex", "luxury", "submariner"]
  }
];

const sampleReviews: Review[] = [
  { id: 1, productId: 1, user: "John D.", rating: 5, comment: "Excellent condition, fast shipping!", date: "2024-01-15" },
  { id: 2, productId: 1, user: "Sarah M.", rating: 4, comment: "Great laptop, works perfectly.", date: "2024-01-10" },
  { id: 3, productId: 2, user: "Mike R.", rating: 5, comment: "Brand new as described!", date: "2024-01-12" },
  { id: 4, productId: 3, user: "Alex K.", rating: 4, comment: "Authentic Jordans, very happy!", date: "2024-01-08" },
];

export default function MarketplaceExample() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'reviews' | 'date'>('date');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'date':
        return b.id - a.id; // Simulate date sorting
      default:
        return 0;
    }
  });

  const getProductReviews = (productId: number) => {
    return reviews.filter(review => review.productId === productId);
  };

  const addReview = (productId: number, rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now(),
      productId,
      user: 'You',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
    toast.success('Review added successfully!');
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
      onClick={() => setSelectedProduct(product)}
    >
      <div className="p-6">
        <div className="text-4xl mb-4 text-center">{product.image}</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.rating) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.condition === 'new' ? 'bg-green-100 text-green-800' :
            product.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {product.condition}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>by {product.seller}</span>
          <span>{product.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {product.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const ReviewModal = ({ product }: { product: Product }) => {
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const productReviews = getProductReviews(product.id);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {product.name} - Reviews
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Product Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-3xl">{product.image}</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</p>
              </div>
            </div>

            {/* Add Review */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Add Your Review</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`text-2xl ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  onClick={() => {
                    if (newComment.trim()) {
                      addReview(product.id, newRating, newComment);
                      setNewComment('');
                      setNewRating(5);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                All Reviews ({productReviews.length})
              </h3>
              <div className="space-y-4">
                {productReviews.map(review => (
                  <div key={review.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{review.user}</span>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🛒 Marketplace
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {products.length} items available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
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
          
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found.</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ReviewModal product={selectedProduct} />
        )}
      </AnimatePresence>
    </div>
  );
}