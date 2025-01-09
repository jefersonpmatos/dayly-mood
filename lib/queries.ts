import useSWR from "swr";
import { Entry } from "@prisma/client";
import { getEntriesByYear } from "@/lib/api";

const fetcher = async () => {
  const entries = await getEntriesByYear(new Date().getFullYear());
  return entries;
};

export const useEntries = () => useSWR<Entry[]>("entries", fetcher);
