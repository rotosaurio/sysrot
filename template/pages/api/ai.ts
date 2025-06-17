import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// Inicializar clientes de IA
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const gemini = process.env.GOOGLE_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt, model = "gpt-4o" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Se requiere un prompt" });
    }

    let response = null;

    // Seleccionar el modelo apropiado
    if (model.startsWith("gpt") || model === "gpt-4o") {
      if (!openai) {
        return res.status(500).json({ error: "API key de OpenAI no configurada" });
      }
      
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o",
        max_tokens: 1500,
        temperature: 0.7,
      });
      
      response = { 
        text: completion.choices[0].message.content,
        usage: completion.usage,
        provider: "OpenAI" 
      };
    } 
    else if (model === "gemini-flash-pro") {
      if (!gemini) {
        return res.status(500).json({ error: "API key de Google no configurada" });
      }
      
      const genModel = gemini.getGenerativeModel({ model: "gemini-pro" });
      const result = await genModel.generateContent(prompt);
      const text = result.response.text();
      
      response = { text, provider: "Google" };
    } 
    else if (model === "claude-3.5") {
      if (!anthropic) {
        return res.status(500).json({ error: "API key de Anthropic no configurada" });
      }
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });
      
      // Verificar que el contenido sea texto
      const content = message.content[0];
      if (content.type === 'text') {
        response = { 
          text: content.text, 
          provider: "Anthropic"
        };
      } else {
        throw new Error("Respuesta de Claude no es de tipo texto");
      }
    }
    else if (model === "deepseek-chat" || model === "deepseek-reasoner") {
      if (!process.env.DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: "API key de DeepSeek no configurada" });
      }
      
      // DeepSeek usa el SDK de OpenAI con base_url personalizada
      const deepseekClient = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY
      });
      
      const completion = await deepseekClient.chat.completions.create({
        model: model, // 'deepseek-chat' o 'deepseek-reasoner'
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      });
      
      response = { 
        text: completion.choices[0].message.content,
        usage: completion.usage,
        provider: "DeepSeek" 
      };
    }
    else {
      return res.status(400).json({ error: "Modelo no soportado" });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error en la API de IA:", error);
    return res.status(500).json({ 
      error: "Error al procesar la solicitud", 
      details: error instanceof Error ? error.message : "Error desconocido"
    });
  }
} 