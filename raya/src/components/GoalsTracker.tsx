import React, { useState } from "react";
import { BusinessGoal } from "../types";
import { Target, Plus, CheckCircle, Circle, Trash2, Award, ArrowUpRight, TrendingUp } from "lucide-react";

interface GoalsTrackerProps {
  goals: BusinessGoal[];
  onAddGoal: (goal: Omit<BusinessGoal, "id" | "progress">) => void;
  onUpdateGoalProgress: (id: string, progress: number) => void;
  onToggleKeyResult: (goalId: string, krId: string) => void;
  onDeleteGoal: (id: string) => void;
}

const CATEGORY_LABELS = {
  Revenue: "درآمد و مالی (Revenue)",
  Marketing: "بازاریابی و مشتریان (Marketing)",
  Product: "توسعه محصول/خدمات (Product)",
  "Self-Development": "توسعه فردی و مهارت (Self-Development)",
  Operations: "فرآیندها و سیستم‌سازی (Operations)",
};

export default function GoalsTracker({
  goals,
  onAddGoal,
  onUpdateGoalProgress,
  onToggleKeyResult,
  onDeleteGoal,
}: GoalsTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Revenue" | "Marketing" | "Product" | "Self-Development" | "Operations">("Revenue");
  const [deadline, setDeadline] = useState("2026-12-31");
  const [keyResultsText, setKeyResultsText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse key results from comma separated or newline separated
    const krArray = keyResultsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((text, idx) => ({
        id: `kr-${Date.now()}-${idx}`,
        text,
        isCompleted: false,
      }));

    onAddGoal({
      title,
      category,
      deadline,
      keyResults: krArray,
    });

    // Reset
    setTitle("");
    setKeyResultsText("");
    setIsAdding(false);
  };

  return (
    <div id="goals_component" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            اهداف استراتژیک و فصلی (OKRs)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">ترسیم اهداف کلان کسب‌وکار همراه با نتایج کلیدی سنجش‌پذیر</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs px-2.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-all cursor-pointer font-semibold"
        >
          {isAdding ? "بستن فرم" : "تعریف هدف تجاری جدید"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-5 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 animate-fadeIn">
          <h3 className="text-xs font-bold text-amber-400">افزودن هدف کسب‌وکار هدفمند</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">عنوان هدف کلان (Objective)</label>
            <input
              type="text"
              required
              placeholder="مثال: افزایش سهم بازار و رسیدن به درآمد ۱ میلیارد ریال ماهانه"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">دسته‌بندی استراتژیک</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-[11px] px-2 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-amber-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">موعد نهایی (Deadline)</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 font-display"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">نتایج کلیدی (Key Results) - هر کدام در یک سطر بنویسید</label>
            <textarea
              required
              placeholder="مثال:&#10;۱. جذب حداقل ۵۰ مشتری وفادار جدید&#10;۲. راه‌اندازی کمپین تبلیغاتی در اینستاگرام&#10;۳. بهینه‌سازی وب‌سایت برای افزایش سرعت"
              value={keyResultsText}
              onChange={(e) => setKeyResultsText(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 h-24 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg transition-all cursor-pointer"
            >
              ثبت هدف و OKR ها
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer"
            >
              لغو
            </button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-2">
          <Award className="w-8 h-8 text-slate-700 animate-pulse" />
          <p className="text-xs leading-relaxed max-w-sm">
            بزرگترین خطای مدیران، نداشتن هدف مکتوب است. اهداف مالی، فروش و توسعه‌ای کسب‌وکار خود را ترسیم کنید تا مغزتان روی هدف متمرکز شود.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const completedKRs = goal.keyResults.filter((kr) => kr.isCompleted).length;
            const totalKRs = goal.keyResults.length;
            const percentage = totalKRs > 0 ? Math.round((completedKRs / totalKRs) * 100) : 0;

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-slate-950/30 border border-slate-800/80 hover:border-slate-700/60 transition-all flex flex-col gap-4"
              >
                {/* Goal Top Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {CATEGORY_LABELS[goal.category]}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 pt-1 leading-snug">
                      {goal.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-slate-600 hover:text-red-400 p-1 rounded-lg hover:bg-slate-900/60 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                      پیشرفت کل کلیدواژه‌ها
                    </span>
                    <span className="text-amber-400 font-extrabold font-display">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800/60">
                    <div
                      className="bg-gradient-to-l from-amber-400 to-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Key results checklist */}
                {goal.keyResults.length > 0 && (
                  <div className="space-y-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-900">
                    <h4 className="text-[10px] font-bold text-slate-500">نتایج کلیدی فرعی (Key Results)</h4>
                    <div className="space-y-2">
                      {goal.keyResults.map((kr) => (
                        <button
                          key={kr.id}
                          onClick={() => onToggleKeyResult(goal.id, kr.id)}
                          className="w-full flex items-center gap-2.5 text-right p-1.5 rounded hover:bg-slate-900/40 transition-colors cursor-pointer group"
                        >
                          {kr.isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 group-hover:text-amber-500 shrink-0" />
                          )}
                          <span
                            className={`text-xs truncate ${
                              kr.isCompleted ? "line-through text-slate-500" : "text-slate-300"
                            }`}
                          >
                            {kr.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deadline metadata */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900/60 pt-2.5">
                  <span>موعد مقرر: <strong className="font-display text-slate-400">{goal.deadline}</strong></span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    انضباط ضامن رسیدن است
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
