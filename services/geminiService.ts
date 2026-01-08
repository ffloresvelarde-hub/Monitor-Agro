import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisReport, Sentiment, Category, ImpactLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    marketStatusSummary: {
      type: Type.STRING,
      description: "Resumen ejecutivo del estado del mercado (ej: 'Tendencia mayormente positiva...').",
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.STRING,
            enum: ["🟢", "🟡", "🔴"],
            description: "🟢 Oportunidad, 🔴 Riesgo, 🟡 Alerta/Neutral.",
          },
          category: {
            type: Type.STRING,
            enum: ["Logística", "Mercado", "Cultivo"],
            description: "Categoría del evento.",
          },
          title: {
            type: Type.STRING,
            description: "Titular periodístico breve.",
          },
          url: {
            type: Type.STRING,
            description: "URL directa de la fuente encontrada en Google Search.",
          },
          summary: {
            type: Type.STRING,
            description: "Análisis de impacto (máx 2 líneas).",
          },
          impactLevel: {
            type: Type.STRING,
            enum: ["Alta", "Media", "Baja"],
            description: "Nivel de urgencia/impacto.",
          },
        },
        required: ["sentiment", "category", "title", "url", "summary", "impactLevel"],
      },
    },
    topInsight: {
      type: Type.STRING,
      description: "El hallazgo más crítico del día.",
    },
    suggestedAction: {
      type: Type.STRING,
      description: "Recomendación estratégica para el productor.",
    },
  },
  required: ["marketStatusSummary", "items", "topInsight", "suggestedAction"],
};

export const fetchAgroReport = async (): Promise<AnalysisReport> => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const prompt = `
    Eres un Analista Senior de Inteligencia de Mercado Agroexportador.
    Fecha: ${currentDate}.

    TAREA:
    Genera un monitor de inteligencia comercial para directores del sector público y privado.
    Usa Google Search para encontrar noticias DE LAS ÚLTIMAS 24-48 HORAS.

    FUENTES PRIORITARIAS:
    FreshPlaza, Infobae Perú, Agraria.pe, Freshfruit.pe, Portal Frutícola.

    CRITERIOS DE SELECCIÓN (Estrictos):
    1. Relevancia Directa: Afecta a Arándanos, Uvas, Paltas, Mangos, Café o Cacao peruanos.
    2. Enfoque: 
       - 🟢 Oportunidades (Nuevos mercados, alza de precios).
       - 🔴 Riesgos (Clima, Plagas, Huelgas, Regulaciones).
    
    REGLA DE ORO PARA URLs:
    Debes incluir la URL REAL de cada noticia que encuentres en la herramienta de búsqueda. No inventes enlaces.

    Salida: JSON estrictamente estructurado según el esquema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("El modelo no generó contenido.");
    }

    const data = JSON.parse(text);
    
    return {
      ...data,
      date: currentDate
    };

  } catch (error) {
    console.error("Error fetching report:", error);
    throw new Error("No se pudo actualizar el monitor. Verifique su conexión o intente nuevamente.");
  }
};