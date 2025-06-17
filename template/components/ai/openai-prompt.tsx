import { useState } from "react";
import { toast } from "react-hot-toast";

export function AIPrompt() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const models = [
    { id: "gpt-4o", name: "GPT-4o (OpenAI)", provider: "OpenAI" },
    { id: "gemini-flash-pro", name: "Gemini Flash Pro", provider: "Google" },
    { id: "claude-3.5", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
    { id: "deepseek-chat", name: "DeepSeek V3 Chat", provider: "DeepSeek" },
    { id: "deepseek-reasoner", name: "DeepSeek R1 Reasoner", provider: "DeepSeek" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Por favor, ingresa un prompt");
      return;
    }
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          model: selectedModel 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la solicitud");
      }
      
      setResponse(data.text || "");
      toast.success(`Respuesta generada con éxito usando ${getModelName(selectedModel)}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const getModelName = (modelId: string): string => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Consulta a modelos de IA
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="model" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Modelo
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isLoading}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label 
            htmlFor="prompt" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu pregunta o instrucción para la IA..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Procesando..." : "Enviar"}
        </button>
      </form>
      
      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Respuesta de {getModelName(selectedModel)}
          </h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {response}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 