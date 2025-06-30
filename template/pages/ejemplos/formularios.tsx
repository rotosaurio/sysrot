import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/components/providers/intl-provider';

// Schema de validación con Zod
const createFormSchema = (t: any) => z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  age: z.number().min(18, 'Debes ser mayor de 18 años').max(100, 'Edad máxima 100 años'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  terms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
  category: z.enum(['general', 'support', 'sales'], {
    errorMap: () => ({ message: 'Selecciona una categoría' })
  })
});

export default function FormulariosExample(): React.ReactElement {
  const { t } = useTranslation();
  const formSchema = createFormSchema(t);
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simular envío al servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Datos del formulario:', data);
      toast.success('¡Formulario enviado correctamente!');
      reset();
    } catch (error) {
      toast.error('Error al enviar el formulario');
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('pages.forms.title')}</h1>
        <p className="text-muted-foreground">
          {t('pages.forms.description')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t('pages.forms.fullName')} *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t('pages.forms.fullName')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('pages.forms.email')} *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-2">
              {t('pages.forms.age')} *
            </label>
            <input
              {...register('age', { valueAsNumber: true })}
              type="number"
              id="age"
              min="18"
              max="100"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="25"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              {t('pages.forms.category')} *
            </label>
            <select
              {...register('category')}
              id="category"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">{t('pages.forms.selectCategory')}</option>
              <option value="general">{t('pages.forms.general')}</option>
              <option value="support">{t('pages.forms.support')}</option>
              <option value="sales">{t('pages.forms.sales')}</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              {t('pages.forms.message')} *
            </label>
            <textarea
              {...register('message')}
              id="message"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t('pages.forms.writeMessage')}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Términos */}
          <div className="flex items-start">
            <input
              {...register('terms')}
              type="checkbox"
              id="terms"
              className="mt-1 mr-3"
            />
            <label htmlFor="terms" className="text-sm">
              {t('pages.forms.acceptTerms')} *
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('pages.forms.submitting')}
              </span>
            ) : (
              t('pages.forms.submit')
            )}
          </button>
        </form>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h3 className="font-semibold mb-2">{t('pages.forms.features')}</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✅ {t('pages.forms.realTimeValidation')}</li>
            <li>✅ {t('pages.forms.typeScript')}</li>
            <li>✅ {t('pages.forms.loadingStates')}</li>
            <li>✅ {t('pages.forms.visualFeedback')}</li>
            <li>✅ {t('pages.forms.autoReset')}</li>
            <li>✅ {t('pages.forms.accessibility')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 