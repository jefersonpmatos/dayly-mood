"use server";

import prisma from "@/lib/prisma";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function createEntry({
  userId,
  date,
  mood,
  note,
  imgs,
}: {
  userId: string;
  date: Date;
  mood: string;
  note?: string;
  imgs?: string;
}) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const week = Math.ceil(date.getDate() / 7);
  const day = date.getDate();

  const data = {
    userId,
    year,
    month,
    week,
    day,
    date,
    mood,
    note,
    imgs,
  };

  const alreadyExists = await prisma.entry.findFirst({
    where: {
      userId,
      year,
      month,
      week,
      day,
    },
  });

  if (alreadyExists) {
    const updatedEntry = await prisma.entry.update({
      where: {
        id: alreadyExists.id,
      },
      data: {
        date,
        mood,
        note,
        imgs,
      },
    });
    return updatedEntry;
  }

  if (!alreadyExists) {
    const entry = await prisma.entry.create({
      data,
    });
    return entry || [];
  }
}

export async function getUserEntries() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user.id) {
    return [];
  }

  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId: session?.user.id,
      },
      orderBy: {
        date: "asc",
      },
    });
    return entries;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw new Error("Failed to fetch entries");
  }
}
// Função para obter entradas por usuário e ano
export async function getEntriesByYear(year: number) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session?.user.id) {
    return [];
  }

  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId: session?.user.id,
        year,
      },
    });

    // Retorne um array vazio caso não existam entradas
    return entries || [];
  } catch (error) {
    console.error("Error fetching entries:", error);
    return []; // Retorne um array vazio em caso de erro também
  }
}

// Função para obter entradas por ano e mês
export async function getEntriesByMonth(
  userId: string,
  year: number,
  month: number
) {
  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId,
        year,
        month,
      },
      orderBy: {
        date: "asc",
      },
    });
    return entries;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw new Error("Failed to fetch entries");
  }
}

export async function removeEntryImgs(entryId: string, index: number) {
  try {
    // Encontrar a entrada
    const entry = await prisma.entry.findUnique({
      where: {
        id: entryId,
      },
    });

    // Verificar se a entrada e suas imagens existem
    if (!entry?.imgs) {
      throw new Error("Entry not found");
    }

    // Dividir as imagens, remover a imagem do índice e atualizar
    const imgsArray = entry.imgs.split(",");
    if (index < 0 || index >= imgsArray.length) {
      throw new Error("Invalid index");
    }

    const updatedImgs = imgsArray.filter((_, i) => i !== index).join(",");

    // Atualizar o banco de dados com as imagens removidas
    await prisma.entry.update({
      where: {
        id: entryId,
      },
      data: {
        imgs: updatedImgs,
      },
    });
  } catch (error) {
    console.error("Error removing entry images:", error);
    throw new Error("Failed to remove entry images");
  }
}
