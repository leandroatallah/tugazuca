import { Schema } from "redis-om";

export type DictionaryLanguage = {
  meaning: string;
  usage: string;
};

export type DictionaryEntry = {
  word: string;
  brazil: DictionaryLanguage;
  portugal: DictionaryLanguage;
  notes: string;
};

export const DictionaryEntrySchema = new Schema(
  "DictionaryEntry",
  {
    word: { type: "string" },
    "brazil.meaning": { type: "string" },
    "brazil.usage": { type: "string" },
    "portural.meaning": { type: "string" },
    "portural.usage": { type: "string" },
    notes: { type: "string" },
  },
  {
    dataStructure: "JSON",
  },
);
