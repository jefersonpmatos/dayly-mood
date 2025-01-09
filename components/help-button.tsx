"use client";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const texts = {
  en: {
    title: "Annual Diary",
    description: "How does the Annual Diary work?",
    moodNote:
      "You can add a mood, a note, and up to 3 images per day to capture your moment!",
    today:
      "You can edit today's content as many times as you want! But be careful! You can only do this until midnight.",
    hasDone:
      "Already done today? Come back tomorrow and keep going tracking your days",
    previousDays:
      "You can add entries to days that are still empty, but you won't be able to update them. So, choose wisely.",
    simpleAndPractical:
      "Simple and practical — designed to help you track your best days! And the not so good ones, too.",
    keepGoing:
      "Keep going every day! A little effort each day creates a great story by year-end! 📖💫 Track your moods and memories — you'll be amazed at how far you’ve come! 💪🚀",
    recap: "Come back at the end of the year for a recap of your journey! ✨",
  },
  pt: {
    title: "Diário Anual",
    description: "Como funciona o Diário Anual?",
    moodNote:
      "Você pode definir seu humor, adicionar uma nota e até 3 imagens por dia para capturar seu momento!",
    today:
      "Você pode editar o conteúdo do dia de hoje quantas vezes quiser! Mas fique atento! Você só pode fazer isso até meia-noite.",
    hasDone: "Já fez hoje? Volte amanha e continue registrando seus dias!",
    previousDays:
      "Você pode adicionar entradas para dias ainda vazios, mas não poderá atualizá-los. Então, escolha com sabedoria.",
    simpleAndPractical:
      "Simples e prático — projetado para ajudar você a acompanhar seus melhores dias! E os nem tão bons também.",
    keepGoing:
      "Continue todo dia! Um pouco de esforço por dia cria uma grande história no final do ano! 📖💫 Acompanhe seus humores e memórias — você ficará surpreso com o quanto evoluiu! 💪🚀",
    recap: "Volte no final do ano para uma retrospectiva da sua jornada! ✨",
  },
};

export const HelpButton = () => {
  const [language, setLanguage] = useState<"en" | "pt">("en");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <HelpCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b-2 border-border pb-2">
          <DialogTitle className="text-text">
            {texts[language].title}
          </DialogTitle>
          <DialogDescription>{texts[language].description}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-text">
          <strong>{texts[language].moodNote}</strong>
          <br />
          <br />
          🗓 <span>{texts[language].today}</span>
          <br />
          <br />✅ <span>{texts[language].hasDone}</span>
          <br />
          <br />
          🚫 <span>{texts[language].previousDays}</span>
          <br />
          <br />
          🚀 <span>{texts[language].simpleAndPractical}</span>
          <br />
          <br />
          <span>{texts[language].keepGoing}</span>
          <br />
          <br />
          <span>{texts[language].recap}</span>
          <br />
        </p>
        <DialogFooter>
          <Button
            onClick={() => setLanguage((prev) => (prev === "en" ? "pt" : "en"))}
          >
            {language === "en" ? "Português" : "English"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
