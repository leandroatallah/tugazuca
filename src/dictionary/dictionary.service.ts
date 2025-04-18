import fs from "fs/promises";
import path from "path";
import logger from "../services/logger.js";
import { DictionaryEntry } from "./dictionary.model.js";
import { DictionaryRepository } from "./dictionary.repository.js";
import { openAiResponseCreate } from "../services/openai.js";

export class DictionaryService {
  constructor(private repository: DictionaryRepository) {}

  async getWordComparison(term: string): Promise<DictionaryEntry> {
    const cached = await this.repository.getCacheEntryByWord(term);
    if (cached) {
      logger.info("Retrieve entry from cache");
      return cached;
    }

    const entry = await this.createNewEntry(term);
    return entry;
  }

  async createNewEntry(term: string): Promise<DictionaryEntry> {
    logger.info("Request OpenAI API to create entry");
    const prompt = `Explique a palavra "${term}" comparando o português do 
    Brasil e o português de Portugal. Dê exemplos e indique se o uso pode 
    gerar mal-entendidos.`;
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
    const result = await this.repository.createCacheEntry(created);
    logger.info("New dictionary entry created successfully");

    return result;
  }
}
