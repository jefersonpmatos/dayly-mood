import { Entry } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMonthData(
  month: number,
  year: number,
  entries: Entry[] = []
) {
  const firstDay = new Date(year, month, 1);
  firstDay.setHours(0, 0, 0, 0); // Elimina o deslocamento de horário
  const lastDay = new Date(year, month + 1, 0);
  lastDay.setHours(0, 0, 0, 0);

  const days: {
    date: Date;
    isCurrentMonth: boolean;
    entry?: Entry;
  }[] = [];

  const findEntryByDate = (date: Date) => {
    return entries.find(
      (entry) =>
        entry.date.getFullYear() === date.getFullYear() &&
        entry.date.getMonth() === date.getMonth() &&
        entry.date.getDate() === date.getDate()
    );
  };

  // Dias do mês anterior
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Ajuste para iniciar na segunda-feira
  for (let i = firstDayOfWeek; i > 0; i--) {
    const date = new Date(year, month, 1 - i);
    date.setHours(0, 0, 0, 0); // Normaliza o horário
    days.push({
      date,
      isCurrentMonth: false,
      entry: findEntryByDate(date),
    });
  }

  // Dias do mês atual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    date.setHours(0, 0, 0, 0); // Normaliza o horário
    days.push({
      date,
      isCurrentMonth: true,
      entry: findEntryByDate(date),
    });
  }

  // Dias do próximo mês
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    date.setHours(0, 0, 0, 0); // Normaliza o horário
    days.push({
      date,
      isCurrentMonth: false,
      entry: findEntryByDate(date),
    });
  }

  return { month, year, days };
}

export const moods: { emoji: string; label: string }[] = [
  { emoji: "😢", label: "sad" },
  { emoji: "😡", label: "angry" },
  { emoji: "😴", label: "tired" },
  { emoji: "😐", label: "neutral" },
  { emoji: "🤔", label: "thoughtful" },
  { emoji: "🙃", label: "ironic" },
  { emoji: "😊", label: "happy" },
  { emoji: "😃", label: "excited" },
  { emoji: "🤩", label: "elated" },
  { emoji: "😱", label: "surprised" },
];

export const moodColors = {
  angry: "#ef4444",
  sad: "#3b82f6",
  tired: "#6366f1",
  neutral: "#737373",
  thoughtful: "#0d9488",
  ironic: "#8b5cf6",
  happy: "#a3e636",
  excited: "#22c55e",
  elated: "#ec4899",
  surprised: "#f97316",
};

export function getDateStatus(date: Date): "passed" | "today" | "coming" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return "passed";
  } else if (inputDate.getTime() === today.getTime()) {
    return "today";
  } else {
    return "coming";
  }
}
