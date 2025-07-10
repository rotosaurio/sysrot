import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/components/providers/intl-provider';
import { useState } from 'react';

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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simular envío al servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Datos del formulario:', data);
      toast.success('¡Formulario enviado correctamente!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
      reset();
      setCurrentStep(1);
    } catch (error) {
      toast.error('Error al enviar el formulario');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const watchedValues = watch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 to-indigo-600/10 py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent)]"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>📝</span>
              Formularios Modernos
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {t('pages.forms.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('pages.forms.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Formulario Multi-Paso
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Paso {currentStep} de {totalSteps}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <React.Fragment key={index}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                    index + 1 <= currentStep 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {index + 1 <= currentStep ? (
                      index + 1 === currentStep ? (
                        index + 1
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Información Personal
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Compártenos tus datos básicos
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Nombre */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('pages.forms.fullName')} *
                      </label>
                      <div className="relative">
                        <input
                          {...register('name')}
                          type="text"
                          id="name"
                          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:outline-none transition-all duration-300 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="Tu nombre completo"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      {errors.name && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          {errors.name.message}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('pages.forms.email')} *
                      </label>
                      <div className="relative">
                        <input
                          {...register('email')}
                          type="email"
                          id="email"
                          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:outline-none transition-all duration-300 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="tu@email.com"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                      </div>
                      {errors.email && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          {errors.email.message}
                        </div>
                      )}
                    </div>

                    {/* Edad */}
                    <div className="space-y-2">
                      <label htmlFor="age" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('pages.forms.age')} *
                      </label>
                      <div className="relative">
                        <input
                          {...register('age', { valueAsNumber: true })}
                          type="number"
                          id="age"
                          min="18"
                          max="100"
                          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:outline-none transition-all duration-300 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="25"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-7m0 0l-3 3m3-3l3 3" />
                          </svg>
                        </div>
                      </div>
                      {errors.age && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          {errors.age.message}
                        </div>
                      )}
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('pages.forms.category')} *
                      </label>
                      <div className="relative">
                        <select
                          {...register('category')}
                          id="category"
                          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:outline-none transition-all duration-300 dark:text-white appearance-none cursor-pointer"
                        >
                          <option value="">{t('pages.forms.selectCategory')}</option>
                          <option value="general">📋 {t('pages.forms.general')}</option>
                          <option value="support">🛠️ {t('pages.forms.support')}</option>
                          <option value="sales">💰 {t('pages.forms.sales')}</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.category && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          {errors.category.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Message */}
              {currentStep === 2 && (
                <div className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Tu Mensaje
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cuéntanos en qué podemos ayudarte
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('pages.forms.message')} *
                      </label>
                      <div className="relative">
                        <textarea
                          {...register('message')}
                          id="message"
                          rows={6}
                          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:outline-none transition-all duration-300 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                          placeholder={t('pages.forms.writeMessage')}
                        />
                        <div className="absolute top-4 right-4">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      {errors.message && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          {errors.message.message}
                        </div>
                      )}
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        {watchedValues.message ? watchedValues.message.length : 0} caracteres
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Confirmar y Enviar
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Revisa tu información antes de enviar
                    </p>
                  </div>

                  {/* Review */}
                  <div className="max-w-2xl mx-auto space-y-6 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Resumen de tu información:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                          <div className="font-medium">{watchedValues.name || 'No especificado'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <div className="font-medium">{watchedValues.email || 'No especificado'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Edad:</span>
                          <div className="font-medium">{watchedValues.age || 'No especificado'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Categoría:</span>
                          <div className="font-medium">{watchedValues.category || 'No especificado'}</div>
                        </div>
                      </div>
                      {watchedValues.message && (
                        <div className="mt-4">
                          <span className="text-gray-600 dark:text-gray-400">Mensaje:</span>
                          <div className="font-medium mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            {watchedValues.message}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Términos */}
                    <div className="flex items-start space-x-3">
                      <input
                        {...register('terms')}
                        type="checkbox"
                        id="terms"
                        className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {t('pages.forms.acceptTerms')} *
                        <a href="#" className="text-blue-600 hover:text-blue-700 ml-1 underline">
                          términos y condiciones
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {errors.terms.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="bg-gray-50 dark:bg-gray-700 px-8 md:px-12 py-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    Siguiente
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('pages.forms.submitting')}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {t('pages.forms.submit')}
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: t('pages.forms.realTimeValidation'),
                description: 'Validación inmediata mientras escribes'
              },
              {
                icon: '🛡️',
                title: t('pages.forms.typeScript'),
                description: 'Tipado fuerte para mayor seguridad'
              },
              {
                icon: '🎨',
                title: 'Diseño Moderno',
                description: 'Interfaz atractiva y responsive'
              },
              {
                icon: '🔄',
                title: t('pages.forms.loadingStates'),
                description: 'Estados de carga interactivos'
              },
              {
                icon: '✅',
                title: t('pages.forms.visualFeedback'),
                description: 'Retroalimentación visual clara'
              },
              {
                icon: '♿',
                title: t('pages.forms.accessibility'),
                description: 'Accesible para todos los usuarios'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 