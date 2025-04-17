import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { DictionaryEntry, DictionaryEntryEntity } from "./dictionary.model.js";
import dictionaryRepository from "./dictionary.repository.js";
import logger from "../services/logger.js";
import redisClient from "../services/redis.js";
import { openAiResponseCreate } from "../services/openai.js";
import { config } from "../config/index.js";

export class DictionaryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 500,
  ) {
    super(message);
    this.name = "DictionaryError";
  }
}

export async function getCacheEntryByWord(word: string) {
  try {
    return await dictionaryRepository
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

// TODO: Check if is better move repository functions
export async function createCacheEntry(data: DictionaryEntryEntity) {
  const CACHE_TTL = config.redis.ttl;
  const entry = await dictionaryRepository.save(data);
  await redisClient.expire(entry.entityId, CACHE_TTL);
  return entry;
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
    const promptPath = path.join(
      process.cwd(),
      "src/dictionary/dictionary.prompt.txt",
    );
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
    if (error instanceof DictionaryError) {
      return res.status(error.status).json({
        error: error.message,
        code: error.code,
      });
    }
    return res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}
