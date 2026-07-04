import React, { useState } from "react";
import { Habit } from "../types";
import { Plus, Check, Trash2, Award, Zap, TrendingUp } from "lucide-react";

interface HabitsTrackerProps {
  habits: Habit[];
  onAddHabit: (name: string) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

export default function HabitsTracker({
  habits,
  onAddHabit,
  onToggleHabit,
  onDeleteHabit,
}: HabitsTrackerProps) {
  const [newHabitName, setNewHabitName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName);
    setNewHabitName("");
    setIsAdding(false);
  };

  return (
    <div id="habits_component" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            عادت‌های روزانه مدیران موفق
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">ثبت منظم روتین‌های روزانه برای ایجاد انضباط شخصی مستمر</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs px-2.5 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-all cursor-pointer font-semibold"
        >
          {isAdding ? "بستن فرم" : "افزودن عادت جدید"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex gap-2 animate-fadeIn">
          <input
            type="text"
            required
            placeholder="مثال: ۳۰ دقیقه مطالعه تخصصی کسب‌وکار یا ورزش صبحگاهی..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="flex-1 text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
          >
            تایید
          </button>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-2">
          <TrendingUp className="w-7 h-7 text-slate-700" />
          <p className="text-xs leading-relaxed">انضباط، تکرار کارهای کوچک روزانه است. روتین‌های رشد فردی خود را اضافه کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => {
            return (
              <div
                key={habit.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all
                  ${habit.isCompletedToday ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-950/30 border-slate-800/60"}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button
                    onClick={() => onToggleHabit(habit.id)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer
                      ${habit.isCompletedToday 
                        ? "bg-emerald-500 text-slate-950 border-emerald-400" 
                        : "bg-slate-900 border-slate-800 text-transparent hover:border-slate-700"}
                    `}
                  >
                    <Check className="w-4.5 h-4.5 stroke-[3px]" />
                  </button>

                  <div className="overflow-hidden">
                    <h4 className={`text-xs font-bold truncate ${habit.isCompletedToday ? "line-through text-slate-500" : "text-slate-200"}`}>
                      {habit.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-amber-400 font-display font-semibold flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        🔥 {habit.streak} روز پیوسته
                      </span>
                      <span className="text-[9px] text-slate-500 font-display">
                        کل ثبت‌ها: {habit.completedDates.length} بار
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="text-slate-600 hover:text-red-400 p-1 rounded-lg hover:bg-slate-900/60 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
