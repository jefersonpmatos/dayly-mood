"use client";

import { useState } from "react";

import { getMonthData } from "@/lib/utils";

import { Calendar } from "@/components/calendar";
import { Topbar } from "@/components/topbar";
import { useEntries } from "@/lib/queries";

export default function Home() {
  const [currentDate] = useState(new Date());
  const { data: entries } = useEntries();

  return (
    <div className="min-h-screen bg-bg space-y-8 pb-4">
      <Topbar />
      <main className="max-w-screen-lg mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center items-start">
          {Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date(currentDate.getFullYear(), i);
            const monthData = getMonthData(
              i,
              currentDate.getFullYear(),
              entries || []
            );
            return (
              <Calendar
                key={monthDate.getTime()}
                month={monthDate.toLocaleString("default", { month: "long" })}
                days={monthData.days}
              />
            );
          })}
        </div>
      </main>
      <footer className="mt-16">
        <p className="text-center text-text">
          Built with ❤️ by{" "}
          <a
            href="https://github.com/jefersonpmatos"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            jefersonpmatos
          </a>
        </p>
      </footer>
    </div>
  );
}
