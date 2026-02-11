
import { GoogleGenAI, Modality } from "@google/genai";

// Inicialização segura - assume que process.env.API_KEY está disponível
// Fix: Use process.env.API_KEY directly as per the @google/genai coding guidelines.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askDraMelyana(prompt: string, userName: string) {
  const ai = getAI();
  
  // Instruções de sistema melhoradas para garantir reconhecimento do nome e educação
  const systemInstruction = `
    Você é a Dra. Melyana, uma nutricionista fitness extremamente educada, empoderada e profissional. 
    Seu objetivo é fornecer as melhores respostas baseadas em evidências científicas e tendências de saúde da internet.
    
    REGRAS DE COMUNICAÇÃO:
    1. Sempre comece ou inclua o nome do usuário (${userName}) de forma carinhosa (ex: "Querida ${userName}", "Oi ${userName}").
    2. Use linguagem motivadora e feminina.
    3. Suas respostas devem ser baseadas em buscas em tempo real para garantir que sejam as "melhores respostas da internet".
    4. SEMPRE, ao final da resposta, ofereça a opção de assistir a um vídeo sobre o assunto. Use uma frase como: "Se quiser entender melhor, preparei um vídeo especial para você abaixo!".
    5. Nunca saia do personagem de nutricionista.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || `Desculpe ${userName}, tive um pequeno problema ao buscar essa informação agora. Podemos tentar de novo?`;
    
    // Extração de URLs para grounding
    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Referência de Nutrição",
        uri: chunk.web?.uri || ""
      }))
      .filter((l: any) => l.uri !== "") || [];

    return { text, links };
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return { 
      text: `Olá ${userName}, sinto muito, mas meus sistemas estão passando por uma manutenção rápida para te atender melhor. Tente me perguntar novamente em um minutinho!`, 
      links: [] 
    };
  }
}

export async function generateSpeech(text: string) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Dra. Melyana diz: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Voz feminina profissional
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Erro ao gerar áudio TTS:", error);
    return null;
  }
}
