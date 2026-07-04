// src/utils/jalali.ts

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export interface GregorianDate {
  gy: number;
  gm: number;
  gd: number;
}

const SHAMSI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند"
];

// Major Jalali Holidays and Important Days (Solar Hijri System)
export interface PersianHoliday {
  month: number;
  day: number;
  title: string;
  isHoliday: boolean;
}

export const PERSIAN_HOLIDAYS_AND_EVENTS: PersianHoliday[] = [
  // --- Farvardin (Month 1) ---
  { month: 1, day: 1, title: "نوروز - آغاز سال نو", isHoliday: true },
  { month: 1, day: 2, title: "عید نوروز", isHoliday: true },
  { month: 1, day: 3, title: "عید نوروز", isHoliday: true },
  { month: 1, day: 4, title: "عید نوروز", isHoliday: true },
  { month: 1, day: 12, title: "روز جمهوری اسلامی", isHoliday: true },
  { month: 1, day: 13, title: "روز طبیعت (سیزده‌بدر)", isHoliday: true },
  { month: 1, day: 30, title: "عید سعید فطر [۱۴۰۵]", isHoliday: true },
  { month: 1, day: 31, title: "تعطیل عید سعید فطر [۱۴۰۵]", isHoliday: true },

  // --- Ordibehesht (Month 2) ---
  { month: 2, day: 1, title: "بزرگداشت سعدی (مدیریت کلام و تجارت)", isHoliday: false },
  { month: 2, day: 3, title: "روز معمار / توسعه صنایع خلاق", isHoliday: false },
  { month: 2, day: 15, title: "روز شیراز و پاسداشت آیین‌های کهن", isHoliday: false },
  { month: 2, day: 25, title: "شهادت حضرت امام جعفر صادق (ع) [۱۴۰۵]", isHoliday: true },
  { month: 2, day: 28, title: "روز بزرگداشت حکیم عمر خیام", isHoliday: false },

  // --- Khordad (Month 3) ---
  { month: 3, day: 1, title: "روز بهره‌وری و بهینه‌سازی کسب‌وکار", isHoliday: false },
  { month: 3, day: 6, title: "عید سعید قربان [۱۴۰۵]", isHoliday: true },
  { month: 3, day: 14, title: "عید سعید غدیر خم / رحلت حضرت امام خمینی [۱۴۰۵]", isHoliday: true },
  { month: 3, day: 15, title: "قیام خونین ۱۵ خرداد", isHoliday: true },

  // --- Tir (Month 4) ---
  { month: 4, day: 3, title: "تاسوعای حسینی [۱۴۰۵]", isHoliday: true },
  { month: 4, day: 4, title: "عاشورای حسینی [۱۴۰۵]", isHoliday: true },
  { month: 4, day: 10, title: "روز صنعت و معدن (پیشرفت کسب‌وکار)", isHoliday: false },
  { month: 4, day: 25, title: "روز بهزیستی و تامین اجتماعی", isHoliday: false },

  // --- Mordad (Month 5) ---
  { month: 5, day: 12, title: "اربعین حسینی [۱۴۰۵]", isHoliday: true },
  { month: 5, day: 14, title: "روز بزرگداشت صدور فرمان مشروطیت", isHoliday: false },
  { month: 5, day: 20, title: "رحلت حضرت رسول اکرم و شهادت امام حسن (ع) [۱۴۰۵]", isHoliday: true },
  { month: 5, day: 21, title: "روز حمایت از صنایع کوچک و متوسط", isHoliday: false },
  { month: 5, day: 22, title: "شهادت حضرت امام رضا (ع) [۱۴۰۵]", isHoliday: true },
  { month: 5, day: 30, title: "شهادت حضرت امام حسن عسکری (ع) [۱۴۰۵]", isHoliday: true },

  // --- Shahrivar (Month 6) ---
  { month: 6, day: 1, title: "روز پزشک (بزرگداشت ابوعلی سینا)", isHoliday: false },
  { month: 6, day: 4, title: "روز کارمند (تقدیر از تیم)", isHoliday: false },
  { month: 6, day: 5, title: "روز داروسازی (بزرگداشت زکریای رازی)", isHoliday: false },
  { month: 6, day: 8, title: "میلاد حضرت رسول اکرم و امام جعفر صادق (ع) [۱۴۰۵]", isHoliday: true },

  // --- Mehr (Month 7) ---
  { month: 7, day: 8, title: "روز بزرگداشت مولوی (جلال‌الدین محمد بلخی)", isHoliday: false },
  { month: 7, day: 20, title: "روز بزرگداشت حافظ شیرازی", isHoliday: false },
  { month: 7, day: 29, title: "روز ملی صادرات", isHoliday: false },

  // --- Aban (Month 8) ---
  { month: 8, day: 1, title: "روز آمار و برنامه‌ریزی استراتژیک", isHoliday: false },
  { month: 8, day: 23, title: "شهادت حضرت فاطمه زهرا (س) [۱۴۰۵]", isHoliday: true },
  { month: 8, day: 29, title: "روز جهانی کارآفرینی (تمرکز استراتژیک)", isHoliday: false },

  // --- Azar (Month 9) ---
  { month: 9, day: 16, title: "روز دانشجو (توسعه یادگیری و مهارت)", isHoliday: false },
  { month: 9, day: 25, title: "روز پژوهش و فناوری", isHoliday: false },
  { month: 9, day: 30, title: "جشن شب یلدا (طولانی‌ترین شب سال)", isHoliday: false },

  // --- Dey (Month 10) ---
  { month: 10, day: 4, title: "میلاد حضرت عیسی مسیح (ع)", isHoliday: false },
  { month: 10, day: 10, title: "روز ملی توسعه و ارزیابی استراتژیک", isHoliday: false },
  { month: 10, day: 29, title: "روز ملی هوای پاک", isHoliday: false },

  // --- Bahman (Month 11) ---
  { month: 11, day: 3, title: "ولادت حضرت امام علی (ع) و روز پدر [۱۴۰۵]", isHoliday: true },
  { month: 11, day: 17, title: "مبعث حضرت رسول اکرم (ص) [۱۴۰۵]", isHoliday: true },
  { month: 11, day: 22, title: "پیروزی انقلاب اسلامی", isHoliday: true },
  { month: 11, day: 29, title: "روز عشق ایرانی (سپندارمزگان)", isHoliday: false },

  // --- Esfand (Month 12) ---
  { month: 12, day: 5, title: "روز مهندس (بزرگداشت خواجه نصیر طوسی)", isHoliday: false },
  { month: 12, day: 6, title: "ولادت حضرت قائم (عج) و نیمه شعبان [۱۴۰۵]", isHoliday: true },
  { month: 12, day: 10, title: "شهادت حضرت امام علی (ع) [۱۴۰۵]", isHoliday: true },
  { month: 12, day: 15, title: "روز درختکاری و سرسبزی محیط زیست", isHoliday: false },
  { month: 12, day: 29, title: "ملی شدن صنعت نفت ایران", isHoliday: true }
];

import { toJalaali, toGregorian, isLeapJalaaliYear, jalaaliMonthLength } from "jalaali-js";

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const res = toJalaali(gy, gm, gd);
  return { jy: res.jy, jm: res.jm, jd: res.jd };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): GregorianDate {
  const res = toGregorian(jy, jm, jd);
  return { gy: res.gy, gm: res.gm, gd: res.gd };
}

// Check if Jalali Year is Leap (Kabise)
export function isJalaliLeapYear(jy: number): boolean {
  return isLeapJalaaliYear(jy);
}

// Get Days in a Jalali Month
export function getDaysInJalaliMonth(jy: number, jm: number): number {
  return jalaaliMonthLength(jy, jm);
}

// Get Day of the Week (Saturday=0, Sunday=1, ..., Friday=6)
export function getJalaliDayOfWeek(jy: number, jm: number, jd: number): number {
  const { gy, gm, gd } = jalaliToGregorian(jy, jm, jd);
  const d = new Date(gy, gm - 1, gd);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  // Convert Sunday=0 -> 1, Saturday=6 -> 0
  return (day + 1) % 7;
}

// Format date into nice Shamsi string: YYYY/MM/DD
export function formatJalaliString(jy: number, jm: number, jd: number): string {
  const mm = String(jm).padStart(2, "0");
  const dd = String(jd).padStart(2, "0");
  return `${jy}/${mm}/${dd}`;
}

export function parseJalaliString(dateStr: string): JalaliDate {
  // Safe parsing of YYYY/MM/DD
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    return {
      jy: parseInt(parts[0], 10),
      jm: parseInt(parts[1], 10),
      jd: parseInt(parts[2], 10),
    };
  }
  // Fallback
  return { jy: 1405, jm: 4, jd: 12 };
}

export { SHAMSI_MONTHS };
