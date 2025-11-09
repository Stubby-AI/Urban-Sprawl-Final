import { GoogleGenAI, Type, Content } from "@google/genai";
import type { GtaPopulationData } from "../types";

// ✅ Load API key correctly for Vite projects
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Safety check for missing key
if (!apiKey) {
  console.error("❌ Google API key is missing. Please check your .env file.");
  throw new Error("Google API key missing. Add VITE_GOOGLE_API_KEY in your .env file.");
}

// ===========================
// Fetch GTA Population Info
// ===========================
export async function fetchGtaPopulationInfo(location: string): Promise<GtaPopulationData> {
  const prompt = `
    Act as an expert urban planning analyst for the Greater Toronto Area.
    Based on the provided context about predicting urban sprawl, generate a detailed analysis for ${location}.
    If the location is 'Greater Toronto Area', provide data for the entire region.
    
    Context on Urban Sprawl Prediction:
    "Predicting urban sprawl is a complex task that involves analyzing various factors and trends related to urban development. It is essential to consider a wide range of indicators and factors that can influence the extent and patterns of urban expansion. These indicators are typically derived from various data sources, including demographic, economic, environmental, and spatial data. Key indicators include population growth, economic indicators (job growth, income levels), Land Use and Land Cover (LULC), transportation infrastructure, zoning regulations, local politics, and proximity to services and natural features."

    Your analysis must include:
    1. A main title for the page, specific to ${location}.
    2. Historical population data for the last 5 years and projected data for the next 5 years for a chart.
    3. A concise, natural-language summary (30-40 words) of the population trend data.
    4. Exactly 3 predictions about the future of urban sprawl in ${location}, with short titles and detailed descriptions.
    5. Exactly 3 predicted growth hotspots (strictly within ${location}), each with:
        - 'name': A human-readable name for the area.
        - 'locationQuery': A Google Maps-searchable string for accuracy.
        - 'reason': A detailed explanation based on zoning, transit projects, housing, or redevelopment potential.

    Return the entire response as a single JSON object.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            populationTrend: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.INTEGER },
                  population: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                },
                required: ["year", "population", "type"],
              },
            },
            populationTrendSummary: { type: Type.STRING },
            urbanSprawlPredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["title", "description"],
              },
            },
            predictedHotspots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  locationQuery: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["name", "locationQuery", "reason"],
              },
            },
          },
          required: [
            "title",
            "populationTrend",
            "populationTrendSummary",
            "urbanSprawlPredictions",
            "predictedHotspots",
          ],
        },
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new Error("API returned an empty response.");
    }

    const parsedData: GtaPopulationData = JSON.parse(jsonText);
    parsedData.populationTrend.sort((a, b) => a.year - b.year);

    return parsedData;
  } catch (error) {
    console.error("❌ Error in Gemini API service:", error);
    if (error instanceof Error) {
      if (
        error.message.includes("API key not valid") ||
        error.message.includes("API Key must be set") ||
        error.message.includes("Requested entity was not found")
      ) {
        throw new Error(
          "The API key is invalid or missing. Please ensure it is configured correctly in your environment."
        );
      }
    }
    throw new Error(
      "Failed to retrieve population data due to a network or API error. Please try again."
    );
  }
}

// ===========================
// Chatbot Interaction
// ===========================
export async function askChatbot(
  question: string,
  history: Content[]
): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents: Content[] = [
      ...history,
      { role: "user", parts: [{ text: question }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
      config: {
        systemInstruction:
          "You are Urbo, a helpful AI assistant powered by Google Gemini. You specialize in the Greater Toronto Area's population growth, infrastructure, and urban planning. Your responses must be short, point-form, and factual. Stay on topic. If a question is unrelated, politely decline.",
      },
    });

    return response.text ?? "No response generated from Gemini API.";
  } catch (error) {
    console.error("❌ Error in chatbot service:", error);
    throw new Error(
      "Sorry, I couldn't get a response from the AI. Please try again."
    );
  }
}
