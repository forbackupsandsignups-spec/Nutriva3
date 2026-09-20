/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_MODEL = "gemini-1.5-flash";

async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 503 || error.status === 429)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, userProfile } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const systemInstruction = `
        أنت "خبير نوتريفا الذكي" (Nutriva AI Expert). 
        أنت مساعد تغذية عربي محترف وودود جداً. 
        مهمتك هي الإجابة على أسئلة المستخدم حول التغذية، الصحة، الوصفات، والتمارين الرياضية بناءً على بياناته الشخصية.
        
        بيانات المستخدم الحالية:
        - الاسم: ${userProfile?.name || "مستخدم"}
        - الوزن: ${userProfile?.weight} كجم
        - الطول: ${userProfile?.height} سم
        - الجنس: ${userProfile?.gender === 'male' ? 'ذكر' : 'أنثى'}
        - العمر: ${userProfile?.age} سنة
        - مستوى النشاط: ${userProfile?.activityLevel}
        - الهدف: ${userProfile?.goal === 'lose' ? 'خسارة الوزن' : userProfile?.goal === 'gain' ? 'زيادة الوزن' : 'المحافظة على الوزن'}
        
        تعليمات هامة للرد:
        1. تحدث دائماً باللغة العربية بلهجة مهذبة ومحفزة.
        2. كن دقيقاً علمياً ولكن استخدم لغة بسيطة يفهمها الجميع.
        3. إذا طلب المستخدم وصفات، اقترح وصفات عربية صحية تناسب سعراته الحرارية.
        4. قدم نصائح عملية (مثلاً: اشرب كوب ماء قبل الأكل، استبدل الخبز الأبيض بالأسمر).
        5. لا تقدم أبداً نصائح طبية دوائية، واطلب من المستخدم استشارة طبيب لأي حالة مرضية.
        6. اجعل ردودك منظمة باستخدام النقاط أو الفقرات القصيرة.
      `;

      const response = await retry(() => ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [
          ...history.slice(1).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      }));
      
      res.json({ content: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء الاتصال بالخبير الذكي" });
    }
  });

  app.post("/api/analyze-meal", async (req, res) => {
    try {
      const { image } = req.body; // base64 image
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const response = await retry(() => ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image,
              },
            },
            {
              text: "Analyze this meal image. Identify the food components, estimate the portion size, and calculate total calories, protein, carbs, and fat. Provide the response in JSON format with the following fields: nameAr (Arabic name), nameEn (English name), calories (number), protein (number in grams), carbs (number in grams), fat (number in grams), analysis (detailed Arabic description of ingredients and health benefits).",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nameAr: { type: Type.STRING },
              nameEn: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              analysis: { type: Type.STRING },
            },
            required: ["nameAr", "nameEn", "calories", "protein", "carbs", "fat", "analysis"],
          },
        },
      }));

      const analysis = JSON.parse(response.text || "{}");
      res.json(analysis);
    } catch (error: any) {
      console.error("Gemini Vision Error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء تحليل الصورة" });
    }
  });

  app.post("/api/suggest-alternative", async (req, res) => {
    try {
      const { mealItem, userProfile } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const prompt = `
        As a nutrition expert, suggest a healthy alternative meal for the following:
        Meal Name: ${mealItem.name}
        Calories: ${mealItem.calories}
        Protein: ${mealItem.protein}g
        Carbs: ${mealItem.carbs}g
        Fat: ${mealItem.fat}g

        The user's preferences:
        Goal: ${userProfile.goal}
        Diet Type: ${userProfile.dietType}
        Allergies: ${userProfile.allergies?.join(', ') || 'None'}
        Budget: ${userProfile.budget}

        Suggest an alternative that is nutritionally equivalent (similar calories and macros) but different.
        The response must be in JSON format with the following fields:
        name: (Arabic name of the new meal)
        calories: (number)
        protein: (number)
        carbs: (number)
        fat: (number)
        reason: (Arabic explanation of why this is a good alternative)
      `;

      const response = await retry(() => ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              reason: { type: Type.STRING },
            },
            required: ["name", "calories", "protein", "carbs", "fat", "reason"],
          },
        },
      }));

      const suggestion = JSON.parse(response.text || "{}");
      res.json(suggestion);
    } catch (error: any) {
      console.error("Gemini Alternative Error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء اقتراح البديل" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
