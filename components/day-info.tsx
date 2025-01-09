import { Entry } from "@prisma/client";

import { NoteEditor } from "./note-editor";
import { moods } from "@/lib/utils";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ZoomableImage } from "./zoomable-image";

interface DayInfoProps {
  date: Date;
  entry: Entry | undefined;
}

export const DayInfo = ({ date, entry }: DayInfoProps) => {
  if (!entry) return <div>No entry</div>;

  const mood = moods.find((mood) => mood.label === entry.mood);

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-text capitalize">
          <span>
            {mood?.emoji} {mood?.label}
          </span>
        </DialogTitle>
        <DialogDescription>
          <span className="mr-2">
            {date?.toLocaleString("default", { day: "2-digit" })}
          </span>
          <span>{date?.toLocaleString("default", { month: "short" })}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <NoteEditor reandOnly value={entry.note || ""} onChange={() => {}} />

        <ZoomableImage images={entry.imgs as string} />
      </div>
    </div>
  );
};
