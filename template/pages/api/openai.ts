import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
// Necesitarás instalar DeepSeek SDK cuando esté disponible públicamente
// import { DeepSeekAI } from "deepseek-ai";

// Inicializar clientes de IA
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = process.env.GOOGLE_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// DeepSeek initialization would go here

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
    if (model.startsWith("gpt")) {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "API key de OpenAI no configurada" });
      }
      
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: model,
      });
      
      response = { 
        text: completion.choices[0].message.content,
        usage: completion.usage,
        provider: "openai" 
      };
    } 
    else if (model === "gemini-flash-pro") {
      if (!gemini) {
        return res.status(500).json({ error: "API key de Google no configurada" });
      }
      
      const genModel = gemini.getGenerativeModel({ model: "gemini-pro" });
      const result = await genModel.generateContent(prompt);
      const text = result.response.text();
      
      response = { text, provider: "gemini" };
    } 
    else if (model === "claude-3.5") {
      if (!anthropic) {
        return res.status(500).json({ error: "API key de Anthropic no configurada" });
      }
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      });
      
      response = { 
        text: message.content[0].text, 
        provider: "anthropic"
      };
    }
    else if (model === "deepseekr1") {
      // Implementación pendiente hasta tener acceso a la API oficial
      return res.status(501).json({ error: "Soporte para DeepSeek R1 en desarrollo" });
    }
    else {
      return res.status(400).json({ error: "Modelo no soportado" });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error en la API de IA:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
} 