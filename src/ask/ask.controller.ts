import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { DictionaryEntry, DictionaryEntryEntity } from "./ask.model.js";
import askRepository from "./ask.repository.js";
import logger from "../services/logger.js";
import { openAiResponseCreate } from "../services/openai.js";

export async function getCacheEntryByWord(word: string) {
  try {
    return await askRepository
      .search()
      .where("word")
      .equals(word)
      .return.first();
  } catch (error: unknown) {
    if (typeof error === "string") {
      throw new Error(error);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export async function createCacheEntry(data: DictionaryEntryEntity) {
  return await askRepository.save(data);
}

function toEntityData(entry: DictionaryEntry): DictionaryEntryEntity {
  return {
    word: entry.word,
    "brazil.meaning": entry.brazil.meaning,
    "brazil.usage": entry.brazil.usage,
    "portugal.meaning": entry.portugal.meaning,
    "portugal.usage": entry.portugal.usage,
    notes: entry.notes,
  };
}

function fromEntityFields(entity: any): DictionaryEntry {
  return {
    word: entity.word,
    brazil: {
      meaning: entity["brazil.meaning"],
      usage: entity["brazil.usage"],
    },
    portugal: {
      meaning: entity["portugal.meaning"],
      usage: entity["portugal.usage"],
    },
    notes: entity.notes,
  };
}

export async function getWordComparison(req: Request, res: Response) {
  const { term } = req.params;

  try {
    // Check for cache data
    const cached = await getCacheEntryByWord(term);
    if (cached) {
      logger.info("Retrieve entry from cache");
      return res.json(cached);
    }

    // Request new entry from OpenAI
    logger.info("Request OpenAI API to create entry");
    const prompt = `Explique a palavra "${term}" comparando o português do Brasil e o português de Portugal. Dê exemplos e indique se o uso pode gerar mal-entendidos.`;
    const promptPath = path.join(process.cwd(), "src/ask/ask.prompt.txt");
    const instructions = await fs.readFile(promptPath, "utf-8");
    const response = await openAiResponseCreate({
      instructions,
      input: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Insert new cache entry
    logger.info("Creating new dictionary entry");
    const created = JSON.parse(response.output_text) as DictionaryEntry;
    const result = await createCacheEntry(toEntityData(created));
    logger.info("New dictionary entry created successfully");

    return res.json({ data: fromEntityFields(result) });
  } catch (error) {
    throw new Error(`Failed to parse OpenAI response to JSON: ${error}`);
  }
}
