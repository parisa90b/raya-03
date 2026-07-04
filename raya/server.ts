import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined. AI features will fail gracefully.");
}

// AI Success Coach & Strategic Planner API
app.post("/api/gemini/coach", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "سرویس هوش مصنوعی موقتاً در دسترس نیست. لطفا کلید API خود را در بخش Secrets تنظیم کنید.",
    });
  }

  const { prompt, chatHistory, systemInstruction } = req.body;

  try {
    // Format contents with history if available
    let contents = prompt;
    
    // Default instruction as a world-class Persian business mentor and success coach
    const defaultInstruction = `شما یک مربی موفقیت، مشاور مدیریت زمان و مشاور کسب‌وکار فوق‌العاده حرفه‌ای هستید.
نام شما "مربی موفقیت کاری" است. شما به زبان فارسی روان، شیوا، پرانرژی و متقاعدکننده صحبت می‌کنید.
وظیفه شما کمک به کاربر برای برنامه‌ریزی اهداف، اولویت‌بندی تسک‌ها (با استفاده از ماتریس آیزنهاور)، مدیریت زمان، غلبه بر تنبلی، افزایش بهره‌وری و موفقیت در کسب‌وکار است.
همیشه پاسخ‌های خود را به صورت ساختاریافته (همراه با بالت پوینت، بخش‌بندی‌های تمیز، و فونت منسجم) ارائه دهید تا کاربر بتواند کارهای عملیاتی استخراج کند.
اگر کاربر از شما خواست هدفی را به تسک‌های قابل اجرا بشکند، آن‌ها را به صورت یک لیست مشخص ارائه دهید تا کاربر بتواند در تقویم یا لیست کارهای خود (Todo List) کپی کند.`;

    const coachInstruction = systemInstruction || defaultInstruction;

    // We can use chat format if chatHistory is provided
    let responseText = "";

    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      // Structure chat messages
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: coachInstruction,
          temperature: 0.7,
        }
      });

      // Send the actual message
      const response = await chat.sendMessage({ message: prompt });
      responseText = response.text || "خطا در دریافت پاسخ از هوش مصنوعی";
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: coachInstruction,
          temperature: 0.7,
        },
      });
      responseText = response.text || "خطا در دریافت پاسخ از هوش مصنوعی";
    }

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini Coach API error:", error);
    res.status(500).json({
      error: "در ارتباط با هوش مصنوعی مشکلی پیش آمد.",
      details: error.message,
    });
  }
});

// Configure Vite middleware / Static Serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with Static Assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to boot server:", err);
});
