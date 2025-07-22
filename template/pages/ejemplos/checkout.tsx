import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon, ClockIcon } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Validation schemas
const addressSchema = z.object({
  firstName: z.string().min(1, 'Nombre es requerido'),
  lastName: z.string().min(1, 'Apellido es requerido'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Dirección es requerida'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Ciudad es requerida'),
  state: z.string().min(1, 'Estado/Provincia es requerido'),
  postalCode: z.string().min(1, 'Código postal es requerido'),
  country: z.string().min(1, 'País es requerido'),
  phone: z.string().optional()
});

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameBillingAddress: z.boolean().default(true),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  saveInfo: z.boolean().default(false)
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
}

// Mock cart data - in real app would come from Zustand store
const mockCartItems: CartItem[] = [
  { id: '1', name: 'iPhone 15 Pro', price: 999, quantity: 1, image: '📱' },
  { id: '2', name: 'AirPods Pro', price: 249, quantity: 2, image: '🎧' }
];

function AddressForm({ 
  title, 
  register, 
  errors, 
  prefix 
}: { 
  title: string;
  register: any;
  errors: any;
  prefix: string;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre *
          </label>
          <input
            {...register(`${prefix}.firstName`)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Juan"
          />
          {errors[prefix]?.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors[prefix].firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Apellido *
          </label>
          <input
            {...register(`${prefix}.lastName`)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Pérez"
          />
          {errors[prefix]?.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors[prefix].lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Empresa (opcional)
        </label>
        <input
          {...register(`${prefix}.company`)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Mi Empresa S.A."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección *
        </label>
        <input
          {...register(`${prefix}.address1`)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Calle Principal 123"
        />
        {errors[prefix]?.address1 && (
          <p className="text-red-500 text-sm mt-1">{errors[prefix].address1.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección 2 (opcional)
        </label>
        <input
          {...register(`${prefix}.address2`)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Apartamento, suite, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ciudad *
          </label>
          <input
            {...register(`${prefix}.city`)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Ciudad"
          />
          {errors[prefix]?.city && (
            <p className="text-red-500 text-sm mt-1">{errors[prefix].city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado/Provincia *
          </label>
          <input
            {...register(`${prefix}.state`)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Estado"
          />
          {errors[prefix]?.state && (
            <p className="text-red-500 text-sm mt-1">{errors[prefix].state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Código Postal *
          </label>
          <input
            {...register(`${prefix}.postalCode`)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="12345"
          />
          {errors[prefix]?.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors[prefix].postalCode.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            País *
          </label>
          <select
            {...register(`${prefix}.country`)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccionar país</option>
            <option value="MX">México</option>
            <option value="US">Estados Unidos</option>
            <option value="CA">Canadá</option>
            <option value="ES">España</option>
            <option value="AR">Argentina</option>
            <option value="CO">Colombia</option>
            <option value="CL">Chile</option>
            <option value="PE">Perú</option>
          </select>
          {errors[prefix]?.country && (
            <p className="text-red-500 text-sm mt-1">{errors[prefix].country.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Teléfono (opcional)
          </label>
          <input
            {...register(`${prefix}.phone`)}
            type="tel"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="+52 555 123 4567"
          />
        </div>
      </div>
    </div>
  );
}

function OrderSummaryCard({ 
  orderSummary, 
  onApplyCoupon,
  couponCode,
  setCouponCode,
  isApplyingCoupon
}: {
  orderSummary: OrderSummary;
  onApplyCoupon: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  isApplyingCoupon: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Resumen del Pedido
      </h3>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {orderSummary.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-lg">{item.image || '📦'}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                {item.name}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Cantidad: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Código de descuento
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Ingresa tu código"
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={onApplyCoupon}
            disabled={isApplyingCoupon || !couponCode.trim()}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isApplyingCoupon ? '...' : 'Aplicar'}
          </button>
        </div>
        {orderSummary.couponCode && (
          <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
            <span className="text-sm">✓ Código aplicado: {orderSummary.couponCode}</span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>${orderSummary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Envío</span>
          <span>{orderSummary.shipping === 0 ? 'Gratis' : `$${orderSummary.shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Impuestos</span>
          <span>${orderSummary.tax.toFixed(2)}</span>
        </div>
        {orderSummary.discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Descuento</span>
            <span>-${orderSummary.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Security badges */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Seguro</span>
          </div>
          <div className="flex items-center space-x-1">
            <CreditCardIcon className="w-4 h-4" />
            <span>Stripe</span>
          </div>
          <div className="flex items-center space-x-1">
            <TruckIcon className="w-4 h-4" />
            <span>Envío rápido</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentForm({ 
  onSubmit, 
  isProcessing,
  formData 
}: { 
  onSubmit: (paymentMethodId: string) => Promise<void>;
  isProcessing: boolean;
  formData: CheckoutFormData;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        name: `${formData.shippingAddress.firstName} ${formData.shippingAddress.lastName}`,
        email: formData.email,
        phone: formData.shippingAddress.phone,
        address: {
          line1: formData.shippingAddress.address1,
          line2: formData.shippingAddress.address2,
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          postal_code: formData.shippingAddress.postalCode,
          country: formData.shippingAddress.country,
        },
      },
    });

    if (error) {
      setCardError(error.message || 'Error creating payment method');
      return;
    }

    setCardError(null);
    await onSubmit(paymentMethod.id);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Información de Pago
        </h3>
        
        <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <CardElement 
            options={cardElementOptions}
            onChange={(event) => {
              if (event.error) {
                setCardError(event.error.message);
              } else {
                setCardError(null);
              }
            }}
          />
        </div>
        
        {cardError && (
          <p className="text-red-500 text-sm mt-2">{cardError}</p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">
              Pago seguro
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Tu información de pago está protegida con encriptación SSL de 256 bits.
              No almacenamos tu información de tarjeta de crédito.
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <CreditCardIcon className="w-5 h-5" />
            <span>Completar Pedido</span>
          </>
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Al hacer clic en "Completar Pedido", aceptas nuestros{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-700">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </form>
  );
}

function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    items: mockCartItems,
    subtotal: 1497, // 999 + 249*2
    tax: 149.7, // 10%
    shipping: 0, // Free shipping over $100
    discount: 0,
    total: 1646.7,
    couponCode: undefined
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameBillingAddress: true,
      saveInfo: false,
      email: session?.user?.email || ''
    }
  });

  const watchSameBillingAddress = watch('sameBillingAddress');

  // Auto-fill user info if logged in
  useEffect(() => {
    if (session?.user) {
      setValue('email', session.user.email || '');
    }
  }, [session, setValue]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      // Simulate API call to validate coupon
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupon logic
      if (couponCode.toLowerCase() === 'save10') {
        const discount = orderSummary.subtotal * 0.1;
        setOrderSummary(prev => ({
          ...prev,
          discount,
          total: prev.subtotal + prev.tax + prev.shipping - discount,
          couponCode: couponCode
        }));
        toast.success('¡Cupón aplicado! 10% de descuento');
      } else {
        toast.error('Código de cupón inválido');
      }
    } catch (error) {
      toast.error('Error aplicando cupón');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const processPayment = async (paymentMethodId: string) => {
    setIsProcessing(true);
    
    try {
      const formData = getValues();
      
      // Create order
      const orderData = {
        items: orderSummary.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameBillingAddress ? formData.shippingAddress : formData.billingAddress,
        couponCode: orderSummary.couponCode,
        notes: formData.notes
      };

      const orderResponse = await fetch('/api/ecommerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        throw new Error('Error creating order');
      }

      const { order, paymentIntent } = await orderResponse.json();

      // Confirm payment with Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: paymentMethodId
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      // Payment successful
      toast.success('¡Pedido completado exitosamente!');
      router.push(`/ejemplos/order-confirmation?orderId=${order.id}`);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Error procesando el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = (data: CheckoutFormData) => {
    // Validate that all required steps are completed
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
  };

  const steps = [
    { id: 1, name: 'Información', icon: '📋' },
    { id: 2, name: 'Dirección', icon: '📍' },
    { id: 3, name: 'Pago', icon: '💳' }
  ];

  return (
    <>
      <Head>
        <title>Checkout - Tu Tienda</title>
        <meta name="description" content="Completar tu compra de forma segura" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/ecommerce" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Checkout
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sesión segura
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-300'
                  }`}>
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`ml-8 w-16 h-0.5 ${
                      currentStep > step.id
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Step 1: Contact Information */}
                {currentStep >= 1 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      1. Información de Contacto
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="tu@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="flex items-center">
                        <input
                          {...register('saveInfo')}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Guardar esta información para futuras compras
                        </label>
                      </div>
                    </div>

                    {currentStep === 1 && (
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Continuar a Dirección
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep >= 2 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      2. Dirección de Envío
                    </h2>
                    
                    <AddressForm
                      title="Dirección de Envío"
                      register={register}
                      errors={errors}
                      prefix="shippingAddress"
                    />

                    {/* Billing Address Checkbox */}
                    <div className="mt-6">
                      <div className="flex items-center">
                        <input
                          {...register('sameBillingAddress')}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          La dirección de facturación es la misma que la de envío
                        </label>
                      </div>
                    </div>

                    {/* Billing Address Form */}
                    {!watchSameBillingAddress && (
                      <div className="mt-6">
                        <AddressForm
                          title="Dirección de Facturación"
                          register={register}
                          errors={errors}
                          prefix="billingAddress"
                        />
                      </div>
                    )}

                    {/* Notes */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notas del pedido (opcional)
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Instrucciones especiales para la entrega..."
                      />
                    </div>

                    {currentStep === 2 && (
                      <div className="mt-6 flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Volver
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Continuar a Pago
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep >= 3 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      3. Información de Pago
                    </h2>
                    
                    <PaymentForm
                      onSubmit={processPayment}
                      isProcessing={isProcessing}
                      formData={getValues()}
                    />

                    <div className="mt-6 flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <OrderSummaryCard
                orderSummary={orderSummary}
                onApplyCoupon={handleApplyCoupon}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                isApplyingCoupon={isApplyingCoupon}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}