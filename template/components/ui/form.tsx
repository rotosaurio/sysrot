"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

// Esquema de validación del formulario
const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  email: z.string().email("Correo electrónico inválido"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(500),
});

// Tipo inferido del esquema
type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Aquí iría la lógica para enviar el formulario (fetch a una API, etc.)
      console.log("Datos del formulario:", data);
      
      // Simulamos un retardo para demostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      toast.success("Mensaje enviado correctamente");
      
      // Reiniciar el formulario
      reset();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Formulario de contacto">
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Nombre
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all duration-200 ${
            errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!errors.name}
          aria-describedby="name-error"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all duration-200 ${
            errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={5}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all duration-200 ${
            errors.message ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!errors.message}
          aria-describedby="message-error"
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
        aria-busy={isSubmitting}
      >
        {isSubmitting && <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>}
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
} 