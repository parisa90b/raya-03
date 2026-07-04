import React, { useState } from "react";
import { Task, EisenhowerQuadrant, TaskCategory } from "../types";
import { AlertCircle, Calendar, Plus, CheckCircle, Circle, Trash2, Shield, EyeOff, Zap, HelpCircle } from "lucide-react";

interface EisenhowerMatrixProps {
  tasks: Task[];
  selectedDate: string;
  onAddTask: (task: Omit<Task, "id" | "isCompleted">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function EisenhowerMatrix({
  tasks,
  selectedDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: EisenhowerMatrixProps) {
  const [activeFormQuadrant, setActiveFormQuadrant] = useState<EisenhowerQuadrant | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>("Work");

  const handleSubmit = (e: React.FormEvent, quadrant: EisenhowerQuadrant) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      date: selectedDate,
      category: newCategory,
      quadrant: quadrant,
      isTimeSpecific: false,
    });

    setNewTitle("");
    setActiveFormQuadrant(null);
  };

  const getQuadrantTasks = (quadrant: EisenhowerQuadrant) => {
    return tasks.filter(t => t.quadrant === quadrant);
  };

  const quadrantsConfig: Record<
    EisenhowerQuadrant,
    {
      title: string;
      subtitle: string;
      color: string;
      bg: string;
      border: string;
      icon: React.ReactNode;
      strategy: string;
    }
  > = {
    urgent_important: {
      title: "مهم و فوری (بحرانی)",
      subtitle: "کارهای اضطراری، بحران‌ها و موعد‌های حیاتی",
      color: "text-red-400",
      bg: "bg-red-500/5",
      border: "border-red-500/20",
      icon: <AlertCircle className="w-4 h-4 text-red-400" />,
      strategy: "کارهای سودآور و ضرب‌الاجل‌ها - فوراً انجام دهید",
    },
    important_not_urgent: {
      title: "مهم و غیرفوری (رشد استراتژیک)",
      subtitle: "برنامه‌ریزی، خلاقیت، یادگیری و بهبود روابط کاری",
      color: "text-amber-400",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      strategy: "راز موفقیت و پیشرفت واقعی - زمان‌بندی کنید",
    },
    urgent_not_important: {
      title: "غیرمهم و فوری (تفویض کار)",
      subtitle: "تماس‌ها، ایمیل‌های فرعی و جلسات کم‌اهمیت دیگران",
      color: "text-blue-400",
      bg: "bg-blue-500/5",
      border: "border-blue-500/20",
      icon: <Shield className="w-4 h-4 text-blue-400" />,
      strategy: "کارهای روزمره دیگران - واگذار کنید یا سریع انجام دهید",
    },
    not_urgent_not_important: {
      title: "غیرمهم و غیرفوری (اتلاف وقت)",
      subtitle: "شبکه‌های اجتماعی، کارهای متفرقه و گشت‌وگذارهای غیرمفید",
      color: "text-slate-400",
      bg: "bg-slate-500/5",
      border: "border-slate-800",
      icon: <EyeOff className="w-4 h-4 text-slate-400" />,
      strategy: "عوامل حواس‌پرتی - کاهش دهید یا حذف کنید",
    },
  };

  // Calculate percentage of tasks in Q2 (the Gold Standard of productivity)
  const totalTasksCount = tasks.length;
  const q2Count = getQuadrantTasks("important_not_urgent").length;
  const q2Percent = totalTasksCount > 0 ? Math.round((q2Count / totalTasksCount) * 100) : 0;

  return (
    <div id="eisenhower_component" className="space-y-6">
      {/* Header and Q2 Productivity Score */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            ماتریس مدیریت زمان آیزنهاور (Eisenhower Matrix)
          </h2>
          <p className="text-xs text-slate-400 mt-1">اولویت‌بندی حرفه‌ای فعالیت‌ها بر اساس فوریت و اهمیت استراتژیک</p>
        </div>

        {/* Q2 Growth Score */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center gap-4 w-full md:w-auto">
          <div className="text-right">
            <h4 className="text-xs font-bold text-amber-400">شاخص تمرکز بر رشد</h4>
            <p className="text-[10px] text-slate-500">سهم تسک‌های استراتژیک (خانه طلایی)</p>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="text-lg font-extrabold font-display text-amber-400">{q2Percent}%</div>
          </div>
        </div>
      </div>

      {/* Info message */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex gap-3 items-start">
        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>رهبران موفق</strong> بیش از ۶۰ درصد از وقت خود را روی تسک‌های خانه دوم یعنی <strong>«مهم اما غیرفوری»</strong> می‌گذارند. 
          این بخش جلوی بحرانی شدن امور در آینده را می‌گیرد.
        </p>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(Object.keys(quadrantsConfig) as EisenhowerQuadrant[]).map((quadKey) => {
          const config = quadrantsConfig[quadKey];
          const qTasks = getQuadrantTasks(quadKey);
          const isFormOpen = activeFormQuadrant === quadKey;

          return (
            <div
              key={quadKey}
              className={`rounded-2xl border ${config.bg} ${config.border} p-5 flex flex-col min-h-[300px] transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.01)]`}
            >
              {/* Quadrant Header */}
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    {config.icon}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${config.color}`}>{config.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{config.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveFormQuadrant(isFormOpen ? null : quadKey)}
                  className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Strategy Banner */}
              <div className="text-[9px] px-2.5 py-1 bg-slate-950/40 rounded border border-slate-900 text-slate-400 mb-4 inline-block self-start font-medium">
                استراتژی موفقیت: {config.strategy}
              </div>

              {/* Inline Quick Add Form */}
              {isFormOpen && (
                <form
                  onSubmit={(e) => handleSubmit(e, quadKey)}
                  className="mb-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2.5 animate-fadeIn"
                >
                  <input
                    type="text"
                    required
                    placeholder="موضوع فعالیت کاری جدید..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex justify-between items-center gap-2">
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                      className="text-[10px] bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-300"
                    >
                      <option value="Work">کاری / پروژه</option>
                      <option value="Meeting">جلسه / مذاکره</option>
                      <option value="Financial">مالی / درآمد</option>
                      <option value="Routine">عادت موفقیت</option>
                      <option value="Goal">هدف اصلی</option>
                    </select>
                    <div className="flex gap-1.5">
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded text-[10px] font-bold cursor-pointer"
                      >
                        ذخیره
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveFormQuadrant(null)}
                        className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] cursor-pointer"
                      >
                        لغو
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tasks List */}
              <div className="flex-1 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {qTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-8 text-center text-slate-600">
                    <p className="text-[10px] italic">فعالیتی در این بخش نیست</p>
                  </div>
                ) : (
                  qTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 bg-slate-950/30 border border-slate-800/40 rounded-xl flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <button
                          onClick={() => onToggleTask(t.id)}
                          className={`shrink-0 transition-colors ${t.isCompleted ? "text-emerald-400" : "text-slate-600 hover:text-emerald-400"}`}
                        >
                          {t.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <span
                          className={`text-xs truncate ${t.isCompleted ? "line-through text-slate-500" : "text-slate-200"}`}
                        >
                          {t.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-500 font-display shrink-0">{t.date}</span>
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-0.5 rounded transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
