import React, { useState, useEffect } from "react";
import { Task, Habit, BusinessGoal, DailyFocus, TaskCategory, EisenhowerQuadrant } from "./types";
import CalendarView from "./components/CalendarView";
import EisenhowerMatrix from "./components/EisenhowerMatrix";
import HabitsTracker from "./components/HabitsTracker";
import GoalsTracker from "./components/GoalsTracker";
import AICoach from "./components/AICoach";
import { gregorianToJalali, formatJalaliString, parseJalaliString } from "./utils/jalali";
import { getDailyQuotesForDay } from "./utils/quotes";
import { 
  Briefcase, 
  Award, 
  Calendar, 
  CheckSquare, 
  Zap, 
  Target, 
  BrainCircuit, 
  Clock, 
  Flame, 
  Sparkles,
  BarChart2,
  PenTool,
  Lock,
  Unlock,
  Quote,
  Sun,
  Moon
} from "lucide-react";

export default function App() {
  // Theme State
  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    return localStorage.getItem("app_theme") === "light";
  });

  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
    localStorage.setItem("app_theme", isLightTheme ? "light" : "dark");
  }, [isLightTheme]);

  // Date State (Persian Format YYYY/MM/DD)
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Tabs - Now defaults to "calendar"
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "matrix" | "goals" | "habits" | "coach">("calendar");

  // Interactive Motivation Quotes Unlock State
  const [unlockedQuotes, setUnlockedQuotes] = useState<number>(1); // Defaults to 1 quote unlocked

  // Core Data States with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<BusinessGoal[]>([]);
  
  // Daily Focus State
  const [dailyFocus, setDailyFocus] = useState<DailyFocus>({
    date: "",
    focusText: "",
    energyLevel: 4,
    focusHours: 4,
  });

  // Load Initial Data
  useEffect(() => {
    // Determine today's Shamsi date
    const todayObj = new Date();
    const jalaliToday = gregorianToJalali(todayObj.getFullYear(), todayObj.getMonth() + 1, todayObj.getDate());
    const todayStr = formatJalaliString(jalaliToday.jy, jalaliToday.jm, jalaliToday.jd);
    
    setSelectedDate(todayStr);

    const storedTasks = localStorage.getItem("success_planner_tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Seed starter business tasks mapped to today's Shamsi date
      const seedTasks: Task[] = [
        {
          id: "seed-1",
          title: "بازبینی و نهایی‌سازی استراتژی فروش فصل جدید",
          description: "تمرکز روی کانال‌های بازاریابی دیجیتال پربازده و محصولات سودآور",
          isCompleted: false,
          date: todayStr,
          category: "Work",
          quadrant: "important_not_urgent",
          isTimeSpecific: true,
          startTime: "10:00",
        },
        {
          id: "seed-2",
          title: "جلسه طوفان فکری طراحی لندینگ پیج جدید کمپین",
          description: "همراه با مربی بازاریابی و تیم فنی",
          isCompleted: true,
          date: todayStr,
          category: "Meeting",
          quadrant: "urgent_important",
          isTimeSpecific: true,
          startTime: "14:00",
        },
        {
          id: "seed-3",
          title: "بررسی فاکتورها و تسویه‌حساب‌های مالی جاری",
          isCompleted: false,
          date: todayStr,
          category: "Financial",
          quadrant: "urgent_not_important",
          isTimeSpecific: false,
        }
      ];
      setTasks(seedTasks);
      localStorage.setItem("success_planner_tasks", JSON.stringify(seedTasks));
    }

    const storedHabits = localStorage.getItem("success_planner_habits");
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    } else {
      // Seed high achiever business habits
      const seedHabits: Habit[] = [
        { id: "h-1", name: "۳۰ دقیقه مطالعه عمیق کتاب‌های مدیریت و فروش", isCompletedToday: false, completedDates: [], streak: 3 },
        { id: "h-2", name: "ورزش صبحگاهی و تمرین تنفس عمیق شکمی", isCompletedToday: true, completedDates: [todayStr], streak: 5 },
        { id: "h-3", name: "نوشتن ۳ اولویت اصلی کاری روز پیش از شروع به کار", isCompletedToday: false, completedDates: [], streak: 2 },
      ];
      setHabits(seedHabits);
      localStorage.setItem("success_planner_habits", JSON.stringify(seedHabits));
    }

    const storedGoals = localStorage.getItem("success_planner_goals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      // Seed starter OKRs
      const seedGoals: BusinessGoal[] = [
        {
          id: "g-1",
          title: "ارتقای درآمد خدمات تخصصی کسب‌وکار تا ۴۰٪",
          category: "Revenue",
          deadline: "1405/06/31",
          progress: 33,
          keyResults: [
            { id: "kr-1-1", text: "ثبت قرارداد با حداقل ۱۰ مشتری بزرگ جدید", isCompleted: true },
            { id: "kr-1-2", text: "راه‌اندازی سیستم مشاوره تلفنی رایگان برای جذب سرنخ", isCompleted: false },
            { id: "kr-1-3", text: "ارتقای فرآیند پیگیری مشتریان از دست‌رفته", isCompleted: false },
          ]
        },
        {
          id: "g-2",
          title: "سیستم‌سازی و تفویض فرآیند پشتیبانی مشتریان",
          category: "Operations",
          deadline: "1405/05/30",
          progress: 0,
          keyResults: [
            { id: "kr-2-1", text: "تهیه مستند صوتی و نوشتاری روال‌های پاسخ‌دهی استاندارد", isCompleted: false },
            { id: "kr-2-2", text: "استخدام و آموزش نیروی پشتیبان نیمه‌وقت کاربلد", isCompleted: false },
          ]
        }
      ];
      setGoals(seedGoals);
      localStorage.setItem("success_planner_goals", JSON.stringify(seedGoals));
    }

    const storedFocus = localStorage.getItem(`success_focus_${todayStr}`);
    if (storedFocus) {
      setDailyFocus(JSON.parse(storedFocus));
    } else {
      const defaultFocus = {
        date: todayStr,
        focusText: "تمرکز روی پیگیری‌های مالی سودآور و جذب مشتری وفادار",
        energyLevel: 5,
        focusHours: 5,
      };
      setDailyFocus(defaultFocus);
      localStorage.setItem(`success_focus_${todayStr}`, JSON.stringify(defaultFocus));
    }
  }, []);

  // Load Daily Focus and unlocked quotes when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const storedFocus = localStorage.getItem(`success_focus_${selectedDate}`);
    if (storedFocus) {
      setDailyFocus(JSON.parse(storedFocus));
    } else {
      const defaultFocus = {
        date: selectedDate,
        focusText: "تمرکز روی پیگیری‌های مالی سودآور و جذب مشتری وفادار",
        energyLevel: 5,
        focusHours: 5,
      };
      setDailyFocus(defaultFocus);
      localStorage.setItem(`success_focus_${selectedDate}`, JSON.stringify(defaultFocus));
    }
    
    const storedUnlocked = localStorage.getItem(`success_unlocked_quotes_${selectedDate}`);
    if (storedUnlocked) {
      setUnlockedQuotes(parseInt(storedUnlocked, 10));
    } else {
      setUnlockedQuotes(1);
    }
  }, [selectedDate]);

  // Sync to localStorage helpers
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("success_planner_tasks", JSON.stringify(newTasks));
  };

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem("success_planner_habits", JSON.stringify(newHabits));
  };

  const saveGoals = (newGoals: BusinessGoal[]) => {
    setGoals(newGoals);
    localStorage.setItem("success_planner_goals", JSON.stringify(newGoals));
  };

  // Task Handlers
  const handleAddTask = (taskData: Omit<Task, "id" | "isCompleted">) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      isCompleted: false,
    };
    saveTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  // Habit Handlers
  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      isCompletedToday: false,
      completedDates: [],
      streak: 0,
    };
    saveHabits([...habits, newHabit]);
  };

  const handleToggleHabit = (id: string) => {
    const todayStr = selectedDate || "1405/04/12";
    const updated = habits.map((habit) => {
      if (habit.id === id) {
        const isCurrentlyCompleted = habit.completedDates.includes(todayStr);
        let newCompletedDates = [...habit.completedDates];
        let newStreak = habit.streak;

        if (isCurrentlyCompleted) {
          newCompletedDates = newCompletedDates.filter((d) => d !== todayStr);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          newCompletedDates.push(todayStr);
          newStreak += 1;
        }

        return {
          ...habit,
          isCompletedToday: !isCurrentlyCompleted,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      }
      return habit;
    });
    saveHabits(updated);
  };

  const handleDeleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
  };

  // Goal OKR Handlers
  const handleAddGoal = (goalData: Omit<BusinessGoal, "id" | "progress">) => {
    const newGoal: BusinessGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      progress: 0,
    };
    saveGoals([...goals, newGoal]);
  };

  const handleToggleKeyResult = (goalId: string, krId: string) => {
    const updated = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedKRs = goal.keyResults.map((kr) =>
          kr.id === krId ? { ...kr, isCompleted: !kr.isCompleted } : kr
        );
        const completedCount = updatedKRs.filter((k) => k.isCompleted).length;
        const total = updatedKRs.length;
        const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        return {
          ...goal,
          keyResults: updatedKRs,
          progress,
        };
      }
      return goal;
    });
    saveGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    saveGoals(updated);
  };

  // Update Daily Focus State
  const handleUpdateFocusText = (text: string) => {
    const todayStr = selectedDate;
    const updated = { ...dailyFocus, focusText: text };
    setDailyFocus(updated);
    localStorage.setItem(`success_focus_${todayStr}`, JSON.stringify(updated));
  };

  const handleUpdateEnergy = (energy: number) => {
    const todayStr = selectedDate;
    const updated = { ...dailyFocus, energyLevel: energy };
    setDailyFocus(updated);
    localStorage.setItem(`success_focus_${todayStr}`, JSON.stringify(updated));
  };

  const handleUpdateHours = (hours: number) => {
    const todayStr = selectedDate;
    const updated = { ...dailyFocus, focusHours: hours };
    setDailyFocus(updated);
    localStorage.setItem(`success_focus_${todayStr}`, JSON.stringify(updated));
  };

  // Stats for Overview
  const completedTasks = tasks.filter(t => t.date === selectedDate && t.isCompleted).length;
  const totalTasks = tasks.filter(t => t.date === selectedDate).length;

  // Dynamically select 3 quotes based on day of the year to keep them rotating
  const getDailyQuotes = () => {
    const parsed = parseJalaliString(selectedDate || "1405/04/12");
    return getDailyQuotesForDay(parsed.jy, parsed.jm, parsed.jd);
  };

  const dailyQuotes = getDailyQuotes();

  const handleUnlockQuote = (num: number) => {
    if (unlockedQuotes === num - 1) {
      setUnlockedQuotes(num);
      localStorage.setItem(`success_unlocked_quotes_${selectedDate}`, String(num));
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden" dir="rtl">
      
      {/* Background Neon Glow Effects for Vibrant Tone */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[20%] left-10 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141c33_1px,transparent_1px),linear-gradient(to_bottom,#141c33_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none opacity-40"></div>

      {/* Header (Removed "ارزش ریالی" metric) */}
      <header className="border-b border-slate-900 bg-slate-950/75 backdrop-blur-xl relative z-20 sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-xl text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center">
                <Briefcase className="w-5.5 h-5.5 stroke-[2.2px]" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#070b16]"></span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-100 font-display">تقویم کسب و کار رایا</h1>
                <span className="text-[9px] px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-full font-bold border border-amber-500/20">برنامه‌ریزی حرفه‌ای</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">برنامه‌ریزی هوشمند، انضباط کاری، موفقیت مستمر</p>
            </div>
          </div>

          {/* Quick Stats & Theme Toggle Container */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto py-1">
            {/* Theme Toggle Button */}
            <button
              id="theme_toggle_btn"
              onClick={() => setIsLightTheme(!isLightTheme)}
              className={`p-2 sm:p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer border
                ${isLightTheme 
                  ? "bg-orange-50 hover:bg-orange-100/70 border-orange-200 text-[#c85a32]" 
                  : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 text-amber-400"
                }
              `}
              title={isLightTheme ? "تغییر به پوسته تاریک" : "تغییر به پوسته روشن آجری"}
            >
              {isLightTheme ? (
                <Moon className="w-4 h-4 text-[#c85a32]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Quick Stats Summary */}
            <div className="flex items-center gap-4 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto justify-between md:justify-start shadow-md shrink-0">
              <div className="px-3.5 py-1.5 text-right shrink-0">
                <span className="text-[9px] text-slate-500 block">انجام کارهای روز</span>
                <span className="text-xs font-extrabold text-amber-400 font-display">
                  {completedTasks} از {totalTasks}
                </span>
              </div>
              <div className="w-px h-6 bg-slate-800 shrink-0"></div>
              <div className="px-3.5 py-1.5 text-right shrink-0">
                <span className="text-[9px] text-slate-500 block">شاخص روتین</span>
                <span className="text-xs font-extrabold text-emerald-400 font-display flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  {habits.filter(h => h.isCompletedToday).length} عادت کامل
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <nav id="sidebar_navigation" className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1.5 bg-slate-900/30 lg:bg-transparent p-2 lg:p-0 rounded-2xl overflow-x-auto sticky lg:top-24 h-auto lg:h-[calc(100vh-140px)] border lg:border-transparent border-slate-800/60">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 cursor-pointer
              ${activeTab === "calendar" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]" : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent"}
            `}
          >
            <Calendar className="w-4.5 h-4.5" />
            <span>تقویم و برنامه‌ریزی زمانی</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 cursor-pointer
              ${activeTab === "dashboard" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]" : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent"}
            `}
          >
            <BarChart2 className="w-4.5 h-4.5" />
            <span>میز کار کلان موفقیت</span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 cursor-pointer
              ${activeTab === "matrix" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent"}
            `}
          >
            <CheckSquare className="w-4.5 h-4.5" />
            <span>ماتریس آیزنهاور (اولویت‌ها)</span>
          </button>

          <button
            onClick={() => setActiveTab("goals")}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 cursor-pointer
              ${activeTab === "goals" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent"}
            `}
          >
            <Target className="w-4.5 h-4.5" />
            <span>اهداف کلان تجاری و OKRs</span>
          </button>

          <button
            onClick={() => setActiveTab("habits")}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 cursor-pointer
              ${activeTab === "habits" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent"}
            `}
          >
            <Zap className="w-4.5 h-4.5" />
            <span>انضباط فردی و عادت‌ها</span>
          </button>

          <div className="hidden lg:block my-4 border-t border-slate-900"></div>

          <button
            onClick={() => setActiveTab("coach")}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 cursor-pointer lg:mt-auto bg-gradient-to-tr from-amber-500/10 to-amber-500/20 border border-amber-500/30 text-amber-400 hover:from-amber-500/15 hover:to-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.1)]
              ${activeTab === "coach" ? "ring-2 ring-amber-500/50" : ""}
            `}
          >
            <BrainCircuit className="w-4.5 h-4.5 animate-pulse text-amber-300" />
            <span>مشاور ارشد هوش مصنوعی</span>
          </button>
        </nav>

        {/* Dynamic Content Panel */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Calendar View Tab */}
          {activeTab === "calendar" && (
            <CalendarView
              tasks={tasks}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {/* Dashboard Tab Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Interactive Gamified Motivational Quotes Banner ("صندوقچه حکمت کاری روز") */}
              <div className="bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-slate-950 border border-amber-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                {/* Background shimmer */}
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(245,158,11,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_6s_infinite] pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/60 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg text-slate-950">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                        صندوقچه طلایی حکمت روزانه
                      </h3>
                      <p className="text-[11px] text-slate-400">۳ اندیشه الهام‌بخش بزرگان را یکی‌یکی با تفکر و تعهد نمایان کنید</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500">پیشرفت امروز:</span>
                    <span className="text-xs font-black text-amber-400 font-display">{unlockedQuotes} از ۳ گام</span>
                  </div>
                </div>

                {/* Quote Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  {dailyQuotes.map((q, idx) => {
                    const quoteNumber = idx + 1;
                    const isUnlocked = unlockedQuotes >= quoteNumber;
                    const canUnlockNow = unlockedQuotes === quoteNumber - 1;

                    if (isUnlocked) {
                      return (
                        <div 
                          key={idx} 
                          className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20 flex flex-col justify-between min-h-[140px] shadow-lg relative group transition-all hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-amber-500/5 duration-300 animate-fadeIn"
                        >
                          <div className="absolute top-2 right-2 opacity-10">
                            <Quote className="w-10 h-10 text-amber-400 rotate-180" />
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed italic pr-2 font-medium">«{q.text}»</p>
                          
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-900">
                            <div className="text-right">
                              <span className="text-xs font-black text-amber-400 block">{q.author}</span>
                              <span className="text-[9px] text-slate-500 block">{q.role}</span>
                            </div>
                            <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded font-bold">اندیشه {quoteNumber}</span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <button
                          key={idx}
                          disabled={!canUnlockNow}
                          onClick={() => handleUnlockQuote(quoteNumber)}
                          className={`p-4 rounded-xl flex flex-col items-center justify-center min-h-[140px] text-center transition-all duration-300 border relative group overflow-hidden
                            ${canUnlockNow 
                              ? "bg-gradient-to-b from-amber-500/5 to-amber-500/10 border-amber-500/35 hover:border-amber-500/70 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer animate-pulse" 
                              : "bg-slate-950/30 border-slate-900 text-slate-600 cursor-not-allowed"
                            }
                          `}
                        >
                          <div className="p-2.5 bg-slate-950 rounded-full border border-slate-800 mb-2 group-hover:scale-110 transition-transform">
                            {canUnlockNow ? (
                              <Unlock className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-700" />
                            )}
                          </div>
                          <span className="text-xs font-bold block mb-1">
                            {canUnlockNow ? `گام تفکر ${quoteNumber} را بردارید` : `قفل گام ${quoteNumber}`}
                          </span>
                          <p className="text-[9px] text-slate-500 leading-normal max-w-[160px]">
                            {canUnlockNow 
                              ? "کلیک کنید تا متعهد به تلاش هدفمند شده و این پند را باز کنید!" 
                              : "برای باز کردن، ابتدا گام قبلی را مطالعه و کلیک کنید"
                            }
                          </p>
                        </button>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Daily Focus Panel & Energy Tracker */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-amber-950/15 border border-slate-850 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5" />
                      کانون تمرکز طلایی امروز
                    </h3>
                    <span className="text-[10px] text-slate-500 font-display font-bold">{selectedDate}</span>
                  </div>
                  
                  <textarea
                    value={dailyFocus.focusText}
                    onChange={(e) => handleUpdateFocusText(e.target.value)}
                    placeholder="امروز باید دقیقاً چه فعالیت سودآوری را به سرانجام برسانم؟ (بنویسید تا ملکه ذهن شما شود)"
                    className="w-full text-xs font-semibold px-4 py-3 bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 focus:border-amber-500/60 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-0 h-20 resize-none transition-all leading-relaxed"
                  />
                </div>

                <div className="md:col-span-4 bg-slate-900/50 border border-slate-850 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between gap-4 shadow-xl">
                  <div>
                    <h4 className="text-xs font-black text-slate-300">سطح شارژ انرژی ذهنی</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">آمادگی بیولوژیکی برای کار عمیق</p>
                  </div>
                  
                  <div className="flex gap-1.5 justify-end">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleUpdateEnergy(level)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold font-display transition-all cursor-pointer
                          ${dailyFocus.energyLevel >= level 
                            ? "bg-amber-500 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.25)]" 
                            : "bg-slate-950/40 text-slate-600 hover:text-slate-400 border border-slate-800/60"}
                        `}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-900 pt-2 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">تعهد ساعت کار عمیق:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={dailyFocus.focusHours}
                        onChange={(e) => handleUpdateHours(Number(e.target.value))}
                        className="w-10 text-center text-xs font-black font-display bg-slate-950 border border-slate-800 rounded px-1 text-amber-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 font-bold">ساعت</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Dashboard Statistics & Dynamic Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Urgent Matters Check */}
                <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        بخش فوریت‌ها و جلسات مهم روز
                      </h3>
                      <button onClick={() => setActiveTab("calendar")} className="text-[10px] text-amber-500 hover:underline font-bold">مشاهده تقویم &larr;</button>
                    </div>

                    <div className="space-y-2.5">
                      {tasks.filter(t => t.date === selectedDate && (t.quadrant === "urgent_important" || t.isTimeSpecific)).length === 0 ? (
                        <p className="text-xs text-slate-600 italic py-6 text-center">جلسه یا تسک بسیار فوری برای امروز ثبت نشده است.</p>
                      ) : (
                        tasks
                          .filter(t => t.date === selectedDate && (t.quadrant === "urgent_important" || t.isTimeSpecific))
                          .slice(0, 4)
                          .map(t => (
                            <div key={t.id} className="p-2.5 bg-slate-950/50 border border-slate-850 rounded-xl flex items-center justify-between gap-3">
                              <span className="text-xs text-slate-300 truncate font-semibold">{t.title}</span>
                              <div className="flex items-center gap-2">
                                {t.startTime && (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-amber-400 font-display font-bold shrink-0">
                                    {t.startTime}
                                  </span>
                                )}
                                <span className={`w-2 h-2 rounded-full shrink-0 ${t.isCompleted ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`}></span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-900/80 flex justify-between items-center text-[10px] text-slate-500">
                    <span>مدیریت صحیح بحران‌ها یعنی آرامش ذهنی</span>
                    <span>تسک‌های اضطراری روز</span>
                  </div>
                </div>

                {/* Focus Habits Progress */}
                <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                        چک‌لیست عادت‌های برتر امروز
                      </h3>
                      <button onClick={() => setActiveTab("habits")} className="text-[10px] text-amber-500 hover:underline font-bold">ویرایش عادت‌ها &larr;</button>
                    </div>

                    <div className="space-y-2.5">
                      {habits.slice(0, 4).map(habit => (
                        <button
                          key={habit.id}
                          onClick={() => handleToggleHabit(habit.id)}
                          className="w-full p-2.5 bg-slate-950/50 hover:bg-slate-950/70 border border-slate-850 rounded-xl flex items-center justify-between text-right cursor-pointer"
                        >
                          <span className={`text-xs ${habit.isCompletedToday ? "line-through text-slate-500" : "text-slate-300 font-semibold"}`}>{habit.name}</span>
                          <span className="text-[9px] font-display font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            🔥 {habit.streak} روز
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-900/80 flex justify-between items-center text-[10px] text-slate-500">
                    <span>عادت‌های تکرارشونده تضمین موفقیت هستند</span>
                    <span>انضباط فردی</span>
                  </div>
                </div>

              </div>

              {/* Strategic Insights Panel from AI Coach */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/25 border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="space-y-2 text-right relative z-10 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <h3 className="text-sm font-black text-slate-100">تحلیل هوش مصنوعی برای امروز شما آماده است</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-medium">
                    هوش مصنوعی با دسترسی به اهداف کلان و تسک‌های کاری امروز شما، سناریویی بهینه برای حداکثرسازی سودآوری و بهره‌وری تهیه کرده است. کلیک کنید تا وارد اتاق مشاوره با دستیار ارشد موفقیت خود شوید.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("coach")}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0 flex items-center gap-1.5 cursor-pointer relative z-10 hover:scale-105"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>شروع رایزنی و مشاوره هوشمند</span>
                </button>
              </div>

            </div>
          )}

          {/* Eisenhower Matrix Tab */}
          {activeTab === "matrix" && (
            <EisenhowerMatrix
              tasks={tasks}
              selectedDate={selectedDate}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {/* Business Goals OKRs Tab */}
          {activeTab === "goals" && (
            <GoalsTracker
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoalProgress={() => {}}
              onToggleKeyResult={handleToggleKeyResult}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {/* Habits Tab */}
          {activeTab === "habits" && (
            <HabitsTracker
              habits={habits}
              onAddHabit={handleAddHabit}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {/* AI Coach Tab */}
          {activeTab === "coach" && (
            <AICoach
              tasks={tasks}
              goals={goals}
              onAddTaskBatch={() => {}}
            />
          )}

        </div>
      </main>

      {/* Humble Footer */}
      <footer className="border-t border-slate-900/60 py-4 text-center text-[10px] text-slate-500 bg-slate-950/40 relative z-20">
        <p>برنامه‌ریزی، تعهد، و انضباط روزانه راهی بی‌بدیل به سوی موفقیت پایدار کاری است</p>
      </footer>
    </div>
  );
}
