import { useState } from 'react';
import { ImageUpload } from '@/components/upload/image-upload';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/components/providers/intl-provider';

export default function UploadPage() {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSuccess = (url: string) => {
    setImageUrl(url);
    toast.success(t('common.success'));
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{t('pages.upload.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('pages.upload.uploadNew')}</h2>
          <ImageUpload 
            onSuccess={handleSuccess}
            maxSizeMB={5}
            acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
          />
        </div>
        
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('pages.upload.previewTitle')}</h2>
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
                {t('pages.upload.previewPlaceholder')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">{t('pages.upload.howItWorks')}</h2>
        <p className="text-muted-foreground">
          {t('pages.upload.howItWorksDescription')} 
          <code>components/upload/image-upload.tsx</code> {t('pages.upload.and')} 
          <code>pages/api/upload.ts</code>. {t('pages.upload.configNote')}
        </p>
      </div>
    </div>
  );
} 
