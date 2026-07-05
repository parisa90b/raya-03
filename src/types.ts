export type TaskCategory = "Work" | "Meeting" | "Financial" | "Routine" | "Goal" | "Personal";

export type EisenhowerQuadrant = 
  | "urgent_important" 
  | "important_not_urgent" 
  | "urgent_not_important" 
  | "not_urgent_not_important";

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  date: string; // YYYY-MM-DD
  category: TaskCategory;
  quadrant: EisenhowerQuadrant;
  isTimeSpecific: boolean;
  startTime?: string; // HH:MM
  durationMinutes?: number;
  revenuePotential?: number; // Visual business value estimation (Toman / USD / etc)
}

export interface Habit {
  id: string;
  name: string;
  isCompletedToday: boolean;
  completedDates: string[]; // List of YYYY-MM-DD
  streak: number;
}

export interface BusinessGoal {
  id: string;
  title: string;
  category: "Revenue" | "Marketing" | "Product" | "Self-Development" | "Operations";
  deadline: string; // YYYY-MM-DD
  progress: number; // 0 to 100
  keyResults: {
    id: string;
    text: string;
    isCompleted: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface DailyFocus {
  date: string; // YYYY-MM-DD
  focusText: string;
  energyLevel: number; // 1-5
  focusHours: number; // hours of deep work
}
