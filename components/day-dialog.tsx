"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleHelp, Loader2, UploadIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn, getDateStatus, moodColors, moods } from "@/lib/utils";
import { Entry } from "@prisma/client";
import { NoteEditor } from "./note-editor";
import { DayInfo } from "./day-info";
import { createEntry, removeEntryImgs } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useEntries } from "@/lib/queries";
import { toast } from "@/hooks/use-toast";

type Mood =
  | "sad"
  | "angry"
  | "tired"
  | "neutral"
  | "thoughtful"
  | "ironic"
  | "happy"
  | "excited"
  | "elated"
  | "surprised";

interface DayDialogProps {
  date: Date;
  entry?: Entry;
}

export const DayDialog: React.FC<DayDialogProps> = ({ date, entry }) => {
  const session = authClient.useSession();
  const { mutate: mutateEntries } = useEntries();

  const [mood, setMood] = useState<Mood>("neutral");
  const [note, setNote] = useState("");
  const [imgs, setImgs] = useState<File[]>([]);
  const [imgsPreview, setImgsPreview] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setMood(entry.mood as Mood);
      setNote(entry.note || "");
      setImgsPreview(entry.imgs?.split(",") || []);
    }
  }, [entry]);

  const handleImagesPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const images = Array.from(files);

      const oversizedFiles = images.filter((file) => file.size > maxFileSize);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: "Each file must be less than 5MB.",
        });
        return;
      }

      const previewUrls = images.map((file) => URL.createObjectURL(file));
      setImgs((prev) => [...prev, ...images]);
      setImgsPreview((prev) => [...prev, ...previewUrls]);
    }
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const img of images) {
      const formData = new FormData();
      formData.append("image", img);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        if (data?.data?.url) {
          uploadedUrls.push(data.data.url);
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          title: "Image upload failed",
          description: `An error occurred while uploading one or more images. Please try again.`,
        });
      }
    }

    return uploadedUrls;
  };

  const onSave = async () => {
    if (!session.data) {
      toast({
        title: "You must be logged in",
        description: "Login to save your progress",
      });
      return;
    }

    setIsLoading(true);

    try {
      const uploadedUrls = await uploadImages(imgs);

      if (uploadedUrls.length === 0 && imgs.length > 0) {
        toast({
          title: "Image upload failed",
          description: "No images were successfully uploaded.",
        });
        setIsLoading(false);
        return;
      }

      await createEntry({
        userId: session.data.user.id,
        date,
        mood,
        note,
        imgs: uploadedUrls.join(","),
      });

      toast({
        title: "Entry created 🚀",
        description: "Back tomorrow and keep tracking your days",
      });

      mutateEntries();
    } catch (error) {
      console.error("Error creating entry:", error);
      toast({
        title: "Ops, something went wrong",
        description: "We could not create your entry, please try again",
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const removeImage = async (index: number) => {
    await removeEntryImgs(entry?.id as string, index);
    setImgs((prev) => prev.filter((_, i) => i !== index));
    setImgsPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const renderEditor =
    (getDateStatus(date) === "passed" && !entry) ||
    getDateStatus(date) === "today";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size="icon"
        disabled={getDateStatus(date) === "coming"}
        onClick={() => setOpen(true)}
        className={cn(
          "size-9 sm:size-8  md:size-7 text-lg md:text-sm disabled:opacity-30",
          getDateStatus(date) === "today" && !entry && "animate-bounce"
        )}
        style={{
          backgroundColor: entry ? moodColors[entry?.mood as Mood] : "#e0e7f1",
        }}
      >
        {date.getDate()}
      </Button>
      <DialogContent>
        {getDateStatus(date) === "passed" && entry && (
          <DayInfo date={date} entry={entry} />
        )}
        {renderEditor && (
          <>
            <DialogHeader>
              <DialogTitle className="text-text">
                {date.toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                })}
              </DialogTitle>
              <DialogDescription>How are you feeling today?</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <Button
                  key={m.label}
                  size="sm"
                  variant="neutral"
                  onClick={() => setMood(m.label as Mood)}
                  style={{
                    backgroundColor:
                      m.label === mood ? moodColors[mood] : "#e0e7f1",
                  }}
                >
                  {m.emoji} {m.label}
                </Button>
              ))}
            </div>

            <NoteEditor value={note} onChange={setNote} />
            <div>
              <label className="block text-sm font-medium text-text">
                <div className="flex items-center gap-2">
                  <p>Images ({imgsPreview.length}/3)</p>
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Take a moment to select images that truly matter to
                          you, as they help tell your story.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {imgsPreview.map((img, index) => (
                  <div
                    key={img.slice(0, 10) + index}
                    className="relative aspect-square"
                  >
                    <Image
                      src={img}
                      alt={img}
                      fill
                      className="w-full h-full object-cover rounded-base"
                    />
                    <Button
                      size="icon"
                      variant="noShadow"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 size-6"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {imgsPreview.length < 3 && (
                <label className="text-text block w-full border border-border rounded-base p-4 text-center cursor-pointer  hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow transition-all">
                  <UploadIcon className="size-6 mx-auto mb-2" />
                  <span className="text-sm">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    max={3}
                    onChange={handleImagesPreview}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <DialogFooter>
              <Button size="sm" onClick={onSave} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
