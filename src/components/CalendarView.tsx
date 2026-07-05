import React, { useState, useEffect } from "react";
import { Task, TaskCategory, EisenhowerQuadrant } from "../types";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft,
  CalendarDays,
  Sparkles,
  Bookmark
} from "lucide-react";
import { 
  gregorianToJalali, 
  jalaliToGregorian, 
  getDaysInJalaliMonth, 
  getJalaliDayOfWeek, 
  formatJalaliString, 
  parseJalaliString,
  SHAMSI_MONTHS,
  PERSIAN_HOLIDAYS_AND_EVENTS
} from "../utils/jalali";

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: string; // YYYY/MM/DD (Shamsi)
  setSelectedDate: (date: string) => void;
  onAddTask: (task: Omit<Task, "id" | "isCompleted">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Work: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Meeting: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Financial: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Routine: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Goal: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  Personal: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  Work: "کاری / پروژه",
  Meeting: "جلسه / مذاکره",
  Financial: "مالی / درآمد",
  Routine: "عادت موفقیت",
  Goal: "هدف اصلی",
  Personal: "شخصی",
};

const QUADRANT_LABELS: Record<EisenhowerQuadrant, string> = {
  urgent_important: "مهم و فوری (بحرانی)",
  important_not_urgent: "مهم و غیرفوری (رشد)",
  urgent_not_important: "غیرمهم و فوری (تفویض)",
  not_urgent_not_important: "غیرمهم و غیرفوری (حذف)",
};

const DAYS_OF_WEEK = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

export default function CalendarView({
  tasks,
  selectedDate,
  setSelectedDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: CalendarViewProps) {
  // Parse starting year and month from the Shamsi selectedDate string
  const initialDate = parseJalaliString(selectedDate);
  const [currentYear, setCurrentYear] = useState(initialDate.jy);
  const [currentMonth, setCurrentMonth] = useState(initialDate.jm); // 1 to 12
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Task form state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>("Work");
  const [newQuadrant, setNewQuadrant] = useState<EisenhowerQuadrant>("important_not_urgent");
  const [isTimeSpecific, setIsTimeSpecific] = useState(false);
  const [newTime, setNewTime] = useState("09:00");
  const [newDesc, setNewDesc] = useState("");
  const [newRevenue, setNewRevenue] = useState("");

  // Keep state updated if selectedDate changes from outside (like today button)
  useEffect(() => {
    if (selectedDate) {
      const parsed = parseJalaliString(selectedDate);
      setCurrentYear(parsed.jy);
      setCurrentMonth(parsed.jm);
    }
  }, [selectedDate]);

  const daysInMonth = getDaysInJalaliMonth(currentYear, currentMonth);
  const firstDayIndex = getJalaliDayOfWeek(currentYear, currentMonth, 1); // 0 = Saturday, ..., 6 = Friday

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const formatDateString = (day: number) => {
    return formatJalaliString(currentYear, currentMonth, day);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      description: newDesc,
      date: selectedDate,
      category: newCategory,
      quadrant: newQuadrant,
      isTimeSpecific,
      startTime: isTimeSpecific ? newTime : undefined,
      revenuePotential: newRevenue ? Number(newRevenue) : undefined,
    });

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewRevenue("");
    setIsAdding(false);
  };

  // Filter tasks for selected date
  const selectedDateTasks = tasks.filter(t => t.date === selectedDate);
  
  // Sort tasks: first by time, then completed status
  const sortedTasks = [...selectedDateTasks].sort((a, b) => {
    if (a.isTimeSpecific && b.isTimeSpecific) {
      return (a.startTime || "").localeCompare(b.startTime || "");
    }
    if (a.isTimeSpecific) return -1;
    if (b.isTimeSpecific) return 1;
    return 0;
  });

  // Calculate stats for active month
  const activeMonthTasks = tasks.filter(t => {
    const p = parseJalaliString(t.date);
    return p.jy === currentYear && p.jm === currentMonth;
  });
  const activeMonthCompleted = activeMonthTasks.filter(t => t.isCompleted).length;

  return (
    <div id="calendar_component" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
      
      {/* Calendar Area */}
      <div className="lg:col-span-8 bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Colorful Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <CalendarIcon className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                تقویم شمسی کارآفرینان جوان
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-sans">Jalali</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">طراحی و سازمان‌دهی دقیق اهداف هفتگی و قرار ملاقات‌ها</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-bold transition-all ${viewMode === "month" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              نمای ماهانه
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-bold transition-all ${viewMode === "week" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              نمای هفتگی
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-bold transition-all ${viewMode === "day" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              برنامه روزانه
            </button>
          </div>
        </div>

        {viewMode === "month" && (
          <div className="relative z-10 space-y-4">
            {/* Month selector */}
            <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 shadow-inner">
              <button 
                onClick={handlePrevMonth} 
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-all flex items-center justify-center border border-slate-800/60 hover:border-amber-500/30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-amber-400 tracking-wide font-display">
                  {SHAMSI_MONTHS[currentMonth - 1]} {currentYear}
                </span>
                {activeMonthTasks.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-display">
                    {activeMonthCompleted}/{activeMonthTasks.length} انجام شده
                  </span>
                )}
              </div>

              <button 
                onClick={handleNextMonth} 
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-all flex items-center justify-center border border-slate-800/60 hover:border-amber-500/30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs font-bold py-2 ${idx === 6 ? "text-rose-400" : "text-slate-400"}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty spaces before first day */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square bg-slate-950/10 rounded-xl border border-slate-900/10 opacity-30"></div>
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = formatDateString(dayNum);
                const isSelected = selectedDate === dateStr;
                const dayTasks = tasks.filter(t => t.date === dateStr);
                const hasTasks = dayTasks.length > 0;
                const completedCount = dayTasks.filter(t => t.isCompleted).length;
                const isFullyCompleted = hasTasks && completedCount === dayTasks.length;
                
                // Get today check in Shamsi
                const todayObj = new Date();
                const todayJalali = gregorianToJalali(todayObj.getFullYear(), todayObj.getMonth() + 1, todayObj.getDate());
                const todayStr = formatJalaliString(todayJalali.jy, todayJalali.jm, todayJalali.jd);
                const isToday = todayStr === dateStr;

                // Day of the week index (0=Saturday, 6=Friday)
                const dayOfWeekIdx = (firstDayIndex + idx) % 7;
                const isFriday = dayOfWeekIdx === 6;

                // Check for Holiday
                const holiday = PERSIAN_HOLIDAYS_AND_EVENTS.find(h => h.month === currentMonth && h.day === dayNum);

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`min-h-[72px] sm:min-h-[95px] p-1.5 sm:p-2 flex flex-col justify-between rounded-xl border text-right transition-all group relative cursor-pointer
                      ${isSelected 
                        ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40" 
                        : "bg-slate-950/40 border-slate-800/40 hover:border-slate-700/80 hover:bg-slate-900/40 text-slate-300"
                      }
                      ${isToday ? "ring-2 ring-amber-400/80 ring-offset-2 ring-offset-slate-950" : ""}
                    `}
                    title={holiday ? holiday.title : undefined}
                  >
                    <div className="flex flex-col items-end w-full gap-0.5">
                      <div className="flex justify-between items-center w-full">
                        {hasTasks ? (
                          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isFullyCompleted ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]"}`}></span>
                        ) : (
                          <span className="w-1.5 h-1.5"></span>
                        )}
                        
                        <span className={`text-xs sm:text-sm font-black font-display 
                          ${isSelected ? "text-amber-400" : isToday ? "text-amber-300" : holiday?.isHoliday || isFriday ? "text-rose-400" : "text-slate-300"}
                        `}>
                          {dayNum}
                        </span>
                      </div>

                      {holiday && (
                        <div className="mt-0.5 w-full text-right">
                          <span className={`text-[8px] sm:text-[9px] block truncate leading-tight font-bold max-w-full
                            ${holiday.isHoliday 
                              ? "text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/20" 
                              : "text-[#c85a32] dark:text-amber-400 bg-amber-500/5 px-1 py-0.5 rounded border border-amber-500/10"
                            }
                          `} title={holiday.title}>
                            {holiday.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Small task preview for desktop */}
                    <div className="hidden sm:block mt-1 overflow-hidden w-full text-left">
                      {dayTasks.slice(0, 1).map(t => (
                        <div key={t.id} className="text-[9px] truncate max-w-full text-right py-0.5 text-slate-400 leading-none flex items-center gap-1 justify-end">
                          <span className="truncate">{t.title}</span>
                          <span className={`w-1 h-1 rounded-full shrink-0 ${t.isCompleted ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                        </div>
                      ))}
                      {dayTasks.length > 1 && (
                        <div className="text-[8px] text-amber-500 text-right font-display leading-none mt-0.5 font-bold">
                          +{dayTasks.length - 1} مورد
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 border-t border-slate-800/40 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>دارای فعالیت تجاری</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>تکمیل کارهای روز</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>تعطیلات رسمی ایران</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/10 border border-amber-500/40"></span>
                <span>روز برگزیده</span>
              </div>
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="relative z-10 space-y-3">
            <p className="text-xs text-slate-400 mb-2">توسعه گام‌به‌گام و منظم در روزهای هفته جاری:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {Array.from({ length: 7 }).map((_, offset) => {
                // Parse current selected Shamsi date
                const { jy, jm, jd } = parseJalaliString(selectedDate);
                // Convert to Gregorian base to allow day additions
                const { gy, gm, gd } = jalaliToGregorian(jy, jm, jd);
                const baseDate = new Date(gy, gm - 1, gd);
                const currentDayOfWeek = baseDate.getDay(); // 0 is Sunday, ..., 6 is Saturday
                
                // Align with Saturday as the first day of the week (index 0)
                const dayOffsetInPersianWeek = (currentDayOfWeek + 1) % 7; 
                const diff = offset - dayOffsetInPersianWeek;
                
                const targetDate = new Date(baseDate);
                targetDate.setDate(baseDate.getDate() + diff);
                
                // Convert back to Shamsi
                const targetJalali = gregorianToJalali(targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate());
                const targetDateStr = formatJalaliString(targetJalali.jy, targetJalali.jm, targetJalali.jd);
                const dayNum = targetJalali.jd;
                const isSelected = selectedDate === targetDateStr;
                const dayTasks = tasks.filter(t => t.date === targetDateStr);
                const dayOfWeekLabel = DAYS_OF_WEEK[offset];

                // Check holiday
                const holiday = PERSIAN_HOLIDAYS_AND_EVENTS.find(h => h.month === targetJalali.jm && h.day === dayNum);

                return (
                  <button
                    key={offset}
                    onClick={() => setSelectedDate(targetDateStr)}
                    className={`p-3 rounded-xl border text-right flex flex-col gap-2.5 min-h-[150px] transition-all cursor-pointer relative group
                      ${isSelected 
                        ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-md" 
                        : "bg-slate-950/40 border-slate-850 hover:border-slate-700 hover:bg-slate-900/30"
                      }
                    `}
                  >
                    <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5 w-full">
                      <span className={`text-xs font-bold ${offset === 6 ? "text-rose-400" : "text-slate-400"}`}>{dayOfWeekLabel}</span>
                      <span className="text-xs font-extrabold font-display">{dayNum}</span>
                    </div>

                    <div className="flex-1 space-y-1.5 overflow-y-auto w-full">
                      {dayTasks.length === 0 ? (
                        <div className="text-center pt-5 flex flex-col items-center justify-center gap-1">
                          <Bookmark className="w-3.5 h-3.5 text-slate-800" />
                          <span className="text-[9px] text-slate-600 block">برنامه‌ای نیست</span>
                        </div>
                      ) : (
                        dayTasks.slice(0, 3).map(t => (
                          <div key={t.id} className="text-[10px] p-1 bg-slate-900/80 border border-slate-800/40 rounded truncate text-right flex items-center justify-between gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.isCompleted ? "bg-emerald-400" : "bg-amber-500"}`}></span>
                            <span className={`truncate flex-1 ${t.isCompleted ? "line-through text-slate-500" : "text-slate-300 font-medium"}`}>{t.title}</span>
                          </div>
                        ))
                      )}
                      {dayTasks.length > 3 && (
                        <div className="text-[9px] text-amber-400 text-center font-display font-semibold">+{dayTasks.length - 3} مورد دیگر</div>
                      )}
                    </div>
                    
                    {holiday && (
                      <span className="text-[8px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded px-1 text-center truncate block w-full leading-tight">
                        {holiday.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="relative z-10 space-y-4">
            <div className="bg-slate-950/80 p-4 border border-slate-800/80 rounded-xl shadow-inner">
              <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                برنامه ساعت به ساعت امروز
              </h3>
              <p className="text-xs text-slate-500">مبتنی بر راندمان زمانی دقیق و کار عمیق برای تاریخ <span className="text-amber-500 font-display font-bold">{selectedDate}</span></p>
            </div>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((hour, idx) => {
                const hourTasks = sortedTasks.filter(t => t.isTimeSpecific && t.startTime && t.startTime >= hour && (idx === 6 || t.startTime < ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"][idx+1]));
                return (
                  <div key={hour} className="flex gap-4 items-start border-b border-slate-800/30 pb-3">
                    <div className="text-xs font-bold text-slate-500 pt-1 w-12 font-display">{hour}</div>
                    <div className="flex-1 space-y-2">
                      {hourTasks.length === 0 ? (
                        <div className="text-xs text-slate-600 italic py-1.5">شیار زمانی آزاد - زمان طلایی برای تفکر استراتژیک یا استراحت ذهنی</div>
                      ) : (
                        hourTasks.map(t => (
                          <div key={t.id} className="p-3 bg-slate-950/40 hover:bg-slate-950/60 border border-slate-800/60 rounded-xl flex justify-between items-center transition-all">
                            <div className="flex items-center gap-2.5">
                              <button onClick={() => onToggleTask(t.id)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                                {t.isCompleted ? <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.2)]" /> : <Circle className="w-4.5 h-4.5" />}
                              </button>
                              <div>
                                <h4 className={`text-xs font-bold ${t.isCompleted ? "line-through text-slate-500" : "text-slate-200"}`}>{t.title}</h4>
                                {t.startTime && <span className="text-[10px] text-amber-500 font-display flex items-center gap-1 mt-1 font-bold"><Clock className="w-3.5 h-3.5" /> {t.startTime}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] px-2 py-0.5 bg-slate-900 rounded border border-slate-850 text-slate-400 font-medium">{CATEGORY_LABELS[t.category]}</span>
                              <button onClick={() => onDeleteTask(t.id)} className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors">
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
        )}
      </div>

      {/* Daily Agenda & Task Management Area */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Selected Day Header & Fast Add */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl relative">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xs font-bold text-slate-400">فعالیت‌های روز برگزیده</h3>
              <h2 className="text-base font-black text-amber-400 font-display flex items-center gap-2 mt-0.5">
                <CalendarDays className="w-4.5 h-4.5 text-amber-400" />
                {selectedDate}
              </h2>
            </div>
            
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4.5 h-4.5 stroke-[2.5px]" />
            </button>
          </div>

          {/* Selected Date Event/Holiday display */}
          {(() => {
            const parsed = parseJalaliString(selectedDate);
            const ev = PERSIAN_HOLIDAYS_AND_EVENTS.find(h => h.month === parsed.jm && h.day === parsed.jd);
            if (!ev) return null;
            return (
              <div className={`p-3 rounded-xl border mb-4 text-right leading-relaxed flex items-start gap-2 animate-fadeIn
                ${ev.isHoliday 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                  : "bg-amber-500/5 border-amber-500/15 text-[#c85a32] dark:text-amber-400"
                }
              `}>
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] block opacity-80 font-bold">مناسبت این روز:</span>
                  <span className="text-xs font-black">{ev.title}</span>
                  {ev.isHoliday && <span className="text-[9px] px-1.5 py-0.5 bg-rose-500/20 rounded border border-rose-500/30 mr-2 font-black">تعطیل رسمی</span>}
                </div>
              </div>
            );
          })()}

          {isAdding && (
            <form onSubmit={handleSubmitTask} className="space-y-4 mb-5 p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 animate-slideDown shadow-inner">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                افزودن فعالیت جدید کاری
              </h4>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">عنوان تسک کاری / جلسه</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: نهایی‌سازی قرارداد کاری"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">دسته‌بندی</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full text-[11px] px-2 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-amber-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">ماتریس اولویت</label>
                  <select
                    value={newQuadrant}
                    onChange={(e) => setNewQuadrant(e.target.value as EisenhowerQuadrant)}
                    className="w-full text-[11px] px-2 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-amber-500"
                  >
                    {Object.entries(QUADRANT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isTime"
                  checked={isTimeSpecific}
                  onChange={(e) => setIsTimeSpecific(e.target.checked)}
                  className="rounded border-slate-800 text-amber-500 focus:ring-amber-500 bg-slate-900"
                />
                <label htmlFor="isTime" className="text-[11px] font-bold text-slate-400 cursor-pointer">ساعت اختصاصی دارد؟</label>
              </div>

              {isTimeSpecific && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[10px] font-bold text-slate-400">زمان شروع</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 font-display"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">توضیحات</label>
                <textarea
                  placeholder="نکات کلیدی این فعالیت..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 h-16 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md"
                >
                  ثبت فعالیت
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {/* List of Tasks for Selected Date */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-950/60 rounded-full flex items-center justify-center border border-slate-850">
                  <Award className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">هیچ برنامه‌ای ثبت نشده است</p>
                  <p className="text-[10px] text-slate-600 mt-1">امروز را با چند برنامه هدفمند شروع کنید</p>
                </div>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors mt-2 underline cursor-pointer"
                >
                  افزودن اولین برنامه امروز
                </button>
              </div>
            ) : (
              sortedTasks.map(t => (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2.5 hover:scale-[1.01] duration-200
                    ${t.isCompleted 
                      ? "bg-slate-950/20 border-slate-900/60 opacity-60" 
                      : "bg-slate-950/50 border-slate-850 hover:border-slate-700"
                    }
                  `}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => onToggleTask(t.id)}
                        className={`mt-0.5 shrink-0 transition-colors hover:text-emerald-400 ${t.isCompleted ? "text-emerald-400" : "text-slate-500"}`}
                      >
                        {t.isCompleted ? <CheckCircle className="w-4.5 h-4.5" /> : <Circle className="w-4.5 h-4.5" />}
                      </button>
                      <div>
                        <h4 className={`text-xs font-bold leading-snug ${t.isCompleted ? "line-through text-slate-500" : "text-slate-100"}`}>
                          {t.title}
                        </h4>
                        {t.description && (
                          <p className={`text-[10px] mt-1 leading-relaxed ${t.isCompleted ? "text-slate-600" : "text-slate-400"}`}>
                            {t.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900/60 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900/50">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-medium ${CATEGORY_COLORS[t.category]}`}>
                        {CATEGORY_LABELS[t.category]}
                      </span>
                      {t.startTime && (
                        <span className="text-[9px] px-2 py-0.5 bg-slate-900/80 border border-slate-800 rounded text-amber-500 font-display flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3" /> {t.startTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Success Insight panel */}
        <div className="bg-gradient-to-br from-slate-900/60 to-amber-950/15 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl relative shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <h3 className="text-xs font-bold text-amber-400 tracking-wider flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            تحلیل تقویم استراتژیک
          </h3>
          {sortedTasks.length === 0 ? (
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تنظیم فعالیت‌های امروز به شما در بالا بردن بازدهی کارآفرینی و پرهیز از اتلاف وقت کمک زیادی می‌کند. همین حالا اولین فعالیت را اضافه کنید!
            </p>
          ) : sortedTasks.some(t => t.quadrant === "urgent_important" && !t.isCompleted) ? (
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              شما کارهای <strong>فوری و بسیار مهم</strong> در برنامه دارید. عاقلانه‌ترین انتخاب، متمرکز کردن انرژی بر اتمام این کارهای بحرانی تا قبل از ظهر است.
            </p>
          ) : (
            <p className="text-[11px] text-emerald-300/95 leading-relaxed">
              بسیار عالی! امروز تسک‌های فوریِ حل‌نشده ندارید. این بهترین فرصت برای تمرکز روی <strong>توسعه بلندمدت سیستم کاری</strong> و بهبود محصولات است.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
