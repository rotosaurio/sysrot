import { AIPrompt } from '@/components/ai/openai-prompt';
import { useTranslation } from '@/components/providers/intl-provider';

export default function AIPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{t('pages.ai.title')}</h1>
      
      <div className="mb-8">
        <AIPrompt />
      </div>

      <div className="mt-8 space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{t('pages.ai.availableModels')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-blue-600">GPT-4o (OpenAI)</h3>
              <p className="text-sm text-muted-foreground">{t('pages.ai.gpt4o')}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-green-600">Gemini Flash Pro (Google)</h3>
              <p className="text-sm text-muted-foreground">{t('pages.ai.gemini')}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-purple-600">Claude 3.5 (Anthropic)</h3>
              <p className="text-sm text-muted-foreground">{t('pages.ai.claude')}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-orange-600">DeepSeek R1</h3>
              <p className="text-sm text-muted-foreground">{t('pages.ai.deepseek')}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{t('pages.ai.configuration')}</h2>
          <p className="text-muted-foreground mb-2">
            {t('pages.ai.configDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
            <div>OPENAI_API_KEY=tu_clave_openai</div>
            <div>GOOGLE_API_KEY=tu_clave_google</div>
            <div>ANTHROPIC_API_KEY=tu_clave_anthropic</div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{t('pages.ai.implementation')}</h2>
          <p className="text-muted-foreground">
            {t('pages.ai.implementationDescription')}
          </p>
          <ul className="list-disc list-inside mt-2 text-muted-foreground">
            <li><code>components/ai/openai-prompt.tsx</code> - Componente de interfaz</li>
            <li><code>pages/api/ai.ts</code> - Endpoint que maneja múltiples proveedores</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 