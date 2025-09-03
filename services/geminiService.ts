
import { GoogleGenAI, Type } from "@google/genai";
import type { Drug, Language, Region } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const drugSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique ID for the drug entry." },
    region: { type: Type.ARRAY, items: { type: Type.STRING } },
    identifiers: {
      type: Type.OBJECT,
      properties: {
        rxCui: { type: Type.STRING, description: "RxNorm Concept Unique Identifier." },
        atc: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Anatomical Therapeutic Chemical codes." },
        cas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "CAS Registry Numbers." },
        emaId: { type: Type.STRING, description: "European Medicines Agency identifier." },
        sfdaRegNo: { type: Type.STRING, description: "Saudi Food and Drug Authority registration number." },
      },
    },
    generic_name: { type: Type.STRING, description: "The official generic name of the drug." },
    brand_names: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Common brand names." },
    class: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pharmacological class or ATC class." },
    mechanism_of_action: { type: Type.STRING, description: "A simplified 2-4 line explanation." },
    indications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Approved medical uses." },
    dosing_adult: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Brief, standard adult dosing points." },
    dosing_pediatric: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Brief, standard pediatric dosing points." },
    contraindications: { type: Type.ARRAY, items: { type: Type.STRING } },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
    adverse_effects: {
      type: Type.OBJECT,
      properties: {
        common: { type: Type.ARRAY, items: { type: Type.STRING } },
        serious: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Prefix with '⚠️ ' emoji." },
      },
    },
    interactions: {
      type: Type.OBJECT,
      properties: {
        severe: { type: Type.ARRAY, items: { type: Type.STRING } },
        moderate: { type: Type.ARRAY, items: { type: Type.STRING } },
        minor: { type: Type.ARRAY, items: { type: Type.STRING } },
        food: { type: Type.ARRAY, items: { type: Type.STRING } },
        alcohol: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    pregnancy_lactation: { type: Type.STRING, description: "Brief text with a clear warning tone." },
    renal_hepatic_adjustment: { type: Type.STRING },
    alternatives: {
      type: Type.OBJECT,
      properties: {
        generic_equivalents: { type: Type.ARRAY, items: { type: Type.STRING } },
        therapeutic_alternatives: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              difference: { type: Type.STRING, description: "Key difference from the searched drug." }
            }
          }
        },
      },
    },
    references: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING },
          url: { type: Type.STRING },
          date_accessed: { type: Type.STRING },
        },
      },
    },
    quick_warnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 most critical risks." },
    boxed_warning: { type: Type.STRING, description: "The 'Black Box Warning' text, if it exists." },
    availability: { type: Type.STRING, description: "Either 'Rx' for prescription or 'OTC' for over-the-counter." },
  },
  required: [
    "id", "generic_name", "brand_names", "class", "mechanism_of_action", "indications",
    "dosing_adult", "contraindications", "warnings", "adverse_effects", "interactions",
    "pregnancy_lactation", "alternatives", "references", "quick_warnings", "availability"
  ]
};


export const fetchDrugInformation = async (
  drugName: string,
  language: Language,
  region: Region
): Promise<Drug> => {
  const langName = language === 'ar' ? 'Arabic' : 'English';
  
  const prompt = `
    You are a trusted medical information API. Your task is to generate a JSON object for a given drug, conforming to the provided schema.
    
    **Request:**
    Drug Name: "${drugName}"
    Region for data prioritization: ${region} (e.g., US -> FDA, SA -> SFDA, UK -> NHS, EU -> EMA, global -> WHO/MedlinePlus)
    Language for content: ${langName}

    **Instructions:**
    1.  Populate all fields of the JSON schema with accurate, concise, and up-to-date information.
    2.  Prioritize information from the official regulatory body of the specified region. If unavailable, use global sources.
    3.  For \`mechanism_of_action\`, provide a simplified 2-4 line explanation suitable for a patient, but medically accurate.
    4.  For \`adverse_effects.serious\`, prefix each item with a '⚠️ ' emoji.
    5.  For \`alternatives.therapeutic_alternatives\`, list drugs from the same ATC class and briefly state their key difference.
    6.  For \`references\`, list the primary sources used (e.g., "FDA Drug Label (2023)", "NHS UK (2024)").
    7.  Generate plausible but illustrative identifiers for \`rxCui\`, \`atc\`, etc.
    8.  If the drug has a 'Black Box Warning' in the specified region, populate the \`boxed_warning\` field.
    9.  The entire output MUST be a single, valid JSON object that strictly follows the schema. Do not include any explanatory text, markdown, or code block syntax outside the JSON.
    10. Ensure all textual content is in ${langName}.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: drugSchema,
        },
    });

    const jsonText = response.text.trim();
    const drugData = JSON.parse(jsonText);
    return drugData as Drug;
  } catch (error) {
    console.error("Error fetching drug information from Gemini API:", error);
    throw new Error("Failed to fetch or parse drug information.");
  }
};
