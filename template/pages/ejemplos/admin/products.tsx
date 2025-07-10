import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhotoIcon, SearchIcon, FunnelIcon } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  slug: z.string().min(1, 'Slug es requerido'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive('Precio debe ser positivo'),
  comparePrice: z.number().positive().optional().or(z.literal('')),
  sku: z.string().optional(),
  categoryId: z.string().min(1, 'Categoría es requerida'),
  stock: z.number().int().min(0, 'Stock debe ser positivo').default(0),
  lowStockAlert: z.number().int().min(0).default(5),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.string().optional(), // Comma separated
  weight: z.number().positive().optional().or(z.literal('')),
  dimensions: z.string().optional()
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: string;
  featured: boolean;
  category: { name: string };
  images: Array<{ url: string; alt?: string }>;
  createdAt: string;
  _count: { orderItems: number; reviews: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function ProductCard({ product, onEdit, onDelete, onView }: { 
  product: Product; 
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'DRAFT': return 'Borrador';
      case 'ARCHIVED': return 'Archivado';
      default: return status;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
        {product.images?.[0] ? (
          <img 
            src={product.images[0].url} 
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Destacado
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
            {getStatusText(product.status)}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <button
            onClick={() => onView(product.id)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Ver producto"
          >
            <EyeIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onEdit(product.id)}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            title="Editar producto"
          >
            <PencilIcon className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            title="Eliminar producto"
          >
            <TrashIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {product.category.name}
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>Stock: {product.stock}</span>
          <span>{product._count.orderItems} ventas</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          <span>{product._count.reviews} reseñas</span>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ 
  isOpen, 
  onClose, 
  product, 
  categories,
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  categories: Category[];
  onSave: (data: ProductFormData) => void;
}) {
  const isEdit = !!product;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'ACTIVE',
      featured: false,
      stock: 0,
      lowStockAlert: 5
    }
  });

  // Auto-generate slug from name
  const watchName = watch('name');
  useEffect(() => {
    if (watchName && !isEdit) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchName, setValue, isEdit]);

  // Reset form when product changes
  useEffect(() => {
    if (product && isOpen) {
      reset({
        ...product,
        comparePrice: product.comparePrice || '',
        weight: product.weight || '',
        tags: product.tags?.join(', ') || ''
      });
    } else if (!product && isOpen) {
      reset({
        status: 'ACTIVE',
        featured: false,
        stock: 0,
        lowStockAlert: 5
      });
    }
  }, [product, isOpen, reset]);

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre *
                </label>
                <input
                  {...register('name')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del producto"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug *
                </label>
                <input
                  {...register('slug')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="slug-del-producto"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="99.99"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* Compare Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio Comparación
                </label>
                <input
                  {...register('comparePrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="129.99"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría *
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SKU
                </label>
                <input
                  {...register('sku')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="PROD-001"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock
                </label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="100"
                />
              </div>

              {/* Low Stock Alert */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alerta Stock Bajo
                </label>
                <input
                  {...register('lowStockAlert', { valueAsNumber: true })}
                  type="number"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="5"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  {...register('status')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="DRAFT">Borrador</option>
                  <option value="ARCHIVED">Archivado</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  {...register('featured')}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Producto Destacado
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción Corta
              </label>
              <textarea
                {...register('shortDescription')}
                rows={2}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Descripción breve para listados..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peso (kg)
                </label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0.5"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dimensiones
                </label>
                <input
                  {...register('dimensions')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="10x5x2 cm"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Etiquetas
              </label>
              <input
                {...register('tags')}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="tecnología, apple, smartphone (separadas por comas)"
              />
            </div>

            {/* SEO Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título SEO
                  </label>
                  <input
                    {...register('seoTitle')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Título para motores de búsqueda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción SEO
                  </label>
                  <textarea
                    {...register('seoDescription')}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Descripción para motores de búsqueda (160 caracteres max)"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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
      loadProducts();
      loadCategories();
    }
  }, [session]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/ecommerce/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        toast.error('Error cargando productos');
      }
    } catch (error) {
      toast.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/ecommerce/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ecommerce/products?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Producto eliminado exitosamente');
        loadProducts();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error eliminando producto');
      }
    } catch (error) {
      toast.error('Error eliminando producto');
    }
  };

  const handleViewProduct = (id: string) => {
    // TODO: Implement product detail view
    toast.info('Vista de producto próximamente');
  };

  const handleSaveProduct = async (data: ProductFormData) => {
    try {
      const url = selectedProduct 
        ? `/api/ecommerce/products?id=${selectedProduct.id}`
        : '/api/ecommerce/products';
      
      const method = selectedProduct ? 'PUT' : 'POST';

      // Process tags
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData)
      });

      if (response.ok) {
        toast.success(selectedProduct ? 'Producto actualizado' : 'Producto creado');
        setIsModalOpen(false);
        loadProducts();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error guardando producto');
      }
    } catch (error) {
      toast.error('Error guardando producto');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || product.status === statusFilter;
    const matchesCategory = !categoryFilter || product.category.slug === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
        <title>Gestión de Productos - Admin</title>
        <meta name="description" content="Gestión de productos del e-commerce" />
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
                    📦 Gestión de Productos
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {filteredProducts.length} productos encontrados
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCreateProduct}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
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
                <option value="ACTIVE">Activos</option>
                <option value="DRAFT">Borradores</option>
                <option value="ARCHIVED">Archivados</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setCategoryFilter('');
                }}
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter || categoryFilter
                  ? 'Prueba ajustando los filtros o busca otro término.'
                  : 'Comienza creando tu primer producto.'}
              </p>
              {!searchTerm && !statusFilter && !categoryFilter && (
                <button
                  onClick={handleCreateProduct}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Primer Producto
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onView={handleViewProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          categories={categories}
          onSave={handleSaveProduct}
        />
      </div>
    </>
  );
}