import { useState } from 'react';
import { ImageUpload } from '@/components/upload/image-upload';
import { toast } from 'react-hot-toast';

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSuccess = (url: string) => {
    setImageUrl(url);
    toast.success('Imagen cargada con éxito');
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Carga de Imágenes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Subir Nueva Imagen</h2>
          <ImageUpload 
            onSuccess={handleSuccess}
            maxSizeMB={5}
            acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
          />
        </div>
        
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>
          {imageUrl ? (
            <div className="aspect-video rounded-md overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Imagen cargada" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">
                Sube una imagen para ver la vista previa
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Cómo funciona</h2>
        <p className="text-muted-foreground">
          Este componente utiliza Cloudinary para almacenar imágenes. La carga se maneja a través de 
          <code>components/upload/image-upload.tsx</code> y el endpoint de API en 
          <code>pages/api/upload.ts</code>. Asegúrate de configurar tus credenciales de Cloudinary
          en el archivo .env.local.
        </p>
      </div>
    </div>
  );
} 