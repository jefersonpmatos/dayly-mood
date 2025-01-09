import { Entry } from "@prisma/client";
import { DayDialog } from "./day-dialog";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  entry?: Entry;
}

interface CalendarProps {
  month: string;
  days: CalendarDay[];
}

export const weekDays = Array.from({ length: 7 }, (_, i) =>
  new Date(2024, 0, i + 1).toLocaleString("default", { weekday: "short" })
);

export const Calendar: React.FC<CalendarProps> = ({ month, days }) => {
  return (
    <div className="grid grid-cols-7 gap-1.5 w-fit">
      <h3 className="font-base capitalize col-span-7 text-text text-2xl md:text-lg">
        {month}
      </h3>
      {weekDays.map((day, index) => (
        <div
          key={`weekDay-${day}-${index}`}
          className="text-center text-xs text-text"
        >
          {day}
        </div>
      ))}
      {days.map((day, index) => (
        <>
          {!day.isCurrentMonth && <div key={index} />}

          {day.isCurrentMonth && (
            <div key={`day-${day.date}-${index}`}>
              <DayDialog
                key={index + day.date.getTime()}
                date={day.date}
                entry={day.entry}
              />
            </div>
          )}
        </>
      ))}
    </div>
  );
};
