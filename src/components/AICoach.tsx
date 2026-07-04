import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Task, BusinessGoal } from "../types";
import { Send, Bot, User, BrainCircuit, Sparkles, Loader2, ArrowLeft, RefreshCw } from "lucide-react";

interface AICoachProps {
  tasks: Task[];
  goals: BusinessGoal[];
  onAddTaskBatch: (tasks: Omit<Task, "id" | "isCompleted">[]) => void;
}

const PRESET_PROMPTS = [
  {
    label: "برنامه‌ریزی هوشمند روزانه",
    prompt: "بر اساس این اطلاعات، یک سناریوی روزانه بسیار فشرده و با پتانسیل درآمدزایی حداکثری برای من بنویس تا بیشترین بازدهی کاری را داشته باشم.",
  },
  {
    label: "شکستن هدف به برنامه اجرایی",
    prompt: "یکی از اهداف کلان من افزایش فروش یا مهارت‌سازی است. چطور این هدف را به کارهای روزانه ساده در ماتریس آیزنهاور بشکنم؟ لطفا چند نمونه تسک عملیاتی بنویس.",
  },
  {
    label: "رفع اهمال‌کاری و افزایش تمرکز",
    prompt: "به عنوان یک مربی موفقیت برتر، راهکار طلایی و سریع برای شروع عمیق کارها و غلبه بر خستگی ذهنی صبحگاهی به من بده.",
  },
  {
    label: "تحلیل بهره‌وری و کارهای پربازده",
    prompt: "لیست کارهای روز من را چطور تحلیل می‌کنی؟ کدام کارها بیشترین اثر اهرمی روی موفقیت مالی و شغلی من دارند؟",
  }
];

export default function AICoach({ tasks, goals, onAddTaskBatch }: AICoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "سلام همکار گرامی! من مربی موفقیت و مشاور کسب‌وکار اختصاصی شما هستم. اهداف کلان و تسک‌های امروز خود را ثبت کنید تا با هم استراتژی روزانه بی‌نظیری برای ارتقای راندمان کاری، درآمدزایی و انضباط فردی تدوین کنیم. مایلید روی کدام بخش تمرکز کنیم؟",
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Build smart context about the user's current tasks and goals
    const tasksContext = tasks.map(t => `- [${t.category}] ${t.title} (${t.isCompleted ? "انجام شده" : "مانده"}) [اولویت: ${t.quadrant}]`).join("\n");
    const goalsContext = goals.map(g => `- ${g.title} (${g.category}) [پیشرفت: ${g.progress}%]`).join("\n");

    const fullPrompt = `کاربر پیام زیر را ارسال کرده است:
"${textToSend}"

اطلاعات فعلی کاربر برای درک بهتر شما:
لیست وظایف امروز:
${tasksContext || "هنوز وظیفه‌ای ثبت نشده است"}

اهداف استراتژیک بلندمدت:
${goalsContext || "هنوز هدفی ثبت نشده است"}

لطفا متناسب با اهداف و وظایف او، به عنوان یک مربی موفقیت برتر پاسخ دهید. پاسخ شما باید بسیار الهام‌بخش، مقتدر، عملیاتی و کاملاً فارسی باشد.`;

    try {
      const response = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          chatHistory: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: "model",
        text: data.text || "من پاسخ مناسبی پیدا نکردم. لطفا مجدد سوال بفرمایید.",
        timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: "model",
        text: "متاسفانه مشکلی در ارتباط با هوش مصنوعی پیش آمد. لطفاً از اتصال اینترنت یا فعال بودن کلید API مطمئن شوید.",
        timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: "پیام‌ها بازنشانی شد. چطور می‌توانم در تنظیم استراتژی‌های جدید موفقیت کاری به شما کمک کنم؟",
        timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div id="ai_coach_component" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              مربی موفقیت کاری و استراتژی هوش مصنوعی
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">کاهش استرس، ارتقای تمرکز عمیق و کارهای هدفمند</p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          title="پاک کردن گفتگو"
          className="p-1.5 bg-slate-950/40 border border-slate-800/80 hover:text-red-400 rounded-lg transition-colors cursor-pointer text-slate-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Reassurance Info Card explaining AI and Storage */}
      <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
        <div className="p-1.5 bg-amber-500/25 text-amber-300 rounded-lg shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <div className="text-right">
          <h4 className="text-xs font-black text-amber-400">سپر حریم خصوصی و راهنمای سیستم هوشمند رایا</h4>
          <p className="text-[10px] text-slate-300 leading-relaxed mt-1 font-medium">
            <strong>اتصال هوش مصنوعی:</strong> بخش مشاور هوشمند به صورت همیشگی و پایدار به موتور قدرتمند <strong>Google Gemini API</strong> در سرور متصل است تا در هر ساعت از شبانه‌روز تحلیل استراتژیک و برنامه‌ریزی اهداف ارائه دهد.
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed mt-1 font-medium">
            <strong>ذخیره‌سازی اطلاعات:</strong> تمام داده‌ها، وظایف، روتین‌ها و اهداف شما منحصراً در <strong>حافظه محلی مرورگرتان (LocalStorage)</strong> ذخیره می‌شود. هیچ دیتایی به دیتابیس خارجی فرستاده نمی‌شود، کاملاً امن و محرمانه است و با پاک نشدن کش مرورگر به‌طور دائمی باقی خواهد ماند.
          </p>
        </div>
      </div>

      {/* Preset helpers */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {PRESET_PROMPTS.map((preset, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(preset.prompt)}
            className="p-2 bg-slate-950/50 border border-slate-800/60 hover:border-amber-500/40 rounded-xl text-right text-[10px] text-slate-300 hover:text-amber-400 transition-all font-medium leading-relaxed cursor-pointer"
          >
            {preset.label} &larr;
          </button>
        ))}
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3.5 pr-1 text-right">
        {messages.map((m) => {
          const isAI = m.role === "model";
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${isAI ? "self-start ml-auto" : "mr-auto flex-row-reverse"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border
                  ${isAI ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-300"}
                `}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line
                  ${isAI ? "bg-slate-950/60 border border-slate-800/80 text-slate-200 rounded-tr-none" : "bg-amber-500 text-slate-950 font-semibold rounded-tl-none"}
                `}
              >
                {m.text}
                <div className={`text-[8px] mt-2 font-display ${isAI ? "text-slate-500 text-left" : "text-amber-950 text-right"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 max-w-[85%] self-start ml-auto">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border bg-amber-500/10 border-amber-500/30 text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tr-none text-xs leading-relaxed bg-slate-950/60 border border-slate-800/80 text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>درحال تحلیل ساختاری زمان‌بندی و اهداف شما...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="هر سوالی دارید بپرسید؛ مثلا: چطور فروش آنلاینم را دو برابر کنم؟"
          className="flex-1 text-xs bg-transparent border-none text-slate-100 placeholder:text-slate-600 focus:ring-0 focus:outline-none px-2 py-1.5"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-lg transition-all flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
