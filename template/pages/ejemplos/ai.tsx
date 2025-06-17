import { AIPrompt } from '@/components/ai/openai-prompt';

export default function AIPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Integración con Modelos de IA</h1>
      
      <div className="mb-8">
        <AIPrompt />
      </div>

      <div className="mt-8 space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Modelos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-blue-600">GPT-4o (OpenAI)</h3>
              <p className="text-sm text-muted-foreground">Modelo más avanzado de OpenAI</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-green-600">Gemini Flash Pro (Google)</h3>
              <p className="text-sm text-muted-foreground">Modelo rápido y eficiente de Google</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-purple-600">Claude 3.5 (Anthropic)</h3>
              <p className="text-sm text-muted-foreground">Modelo avanzado con gran capacidad de razonamiento</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
              <h3 className="font-semibold text-orange-600">DeepSeek R1</h3>
              <p className="text-sm text-muted-foreground">En desarrollo - Próximamente disponible</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Configuración</h2>
          <p className="text-muted-foreground mb-2">
            Para utilizar estos modelos, configura las siguientes variables de entorno en tu archivo .env.local:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
            <div>OPENAI_API_KEY=tu_clave_openai</div>
            <div>GOOGLE_API_KEY=tu_clave_google</div>
            <div>ANTHROPIC_API_KEY=tu_clave_anthropic</div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Implementación</h2>
          <p className="text-muted-foreground">
            La integración multi-modelo se maneja a través de:
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