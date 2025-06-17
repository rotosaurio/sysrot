"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface ImageUploadProps {
  onUploadComplete?: (imageUrl: string) => void;
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen");
      return;
    }

    // Crear URL para previsualización
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Por favor selecciona una imagen");
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }
      
      const data = await response.json();
      
      toast.success("Imagen subida correctamente");
      
      // Notificar que la subida se completó
      if (onUploadComplete && data.secure_url) {
        onUploadComplete(data.secure_url);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Subir Imagen
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="image" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Selecciona una imagen
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      dark:text-gray-400
                      dark:file:bg-gray-700 dark:file:text-gray-300"
            disabled={uploading}
          />
        </div>
        
        {preview && (
          <div className="mt-4 relative w-full h-64">
            <Image
              src={preview}
              alt="Vista previa"
              fill
              className="object-contain rounded-md"
            />
            <button
              type="button"
              onClick={handleReset}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              aria-label="Eliminar imagen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={uploading || !preview}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Subiendo..." : "Subir Imagen"}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={uploading || !preview}
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
} 