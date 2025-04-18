import { Schema } from "redis-om";

export type DictionaryLanguage = {
  meaning: string;
  usage: string;
};

export type DictionaryEntry = {
  word: string;
  brazil: DictionaryLanguage;
  portugal: DictionaryLanguage;
  similarity: "identical" | "similar" | "different" | "conflicting";
  notes: string;
};

export type DictionaryEntryEntity = Omit<
  DictionaryEntry,
  "brazil" | "portugal"
> & {
  "brazil.meaning": string;
  "brazil.usage": string;
  "portugal.meaning": string;
  "portugal.usage": string;
};

export const DictionaryEntrySchema = new Schema(
  "DictionaryEntry",
  {
    word: { type: "string" },
    "brazil.meaning": { type: "string" },
    "brazil.usage": { type: "string" },
    "portural.meaning": { type: "string" },
    "portural.usage": { type: "string" },
    similarity: { type: "string" },
    notes: { type: "string" },
  },
  {
    dataStructure: "JSON",
  },
);
