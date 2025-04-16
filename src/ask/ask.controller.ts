import { Request, Response } from "express";
import fs from "fs/promises";
import { DictionaryEntry } from "./ask.model.js";
import openAIClient from "../services/openai.js";
import path from "path";

export async function getWordComparison(req: Request, res: Response) {
  const { term } = req.params;

  const prompt = `Explique a palavra "${term}" comparando o português do Brasil e o português de Portugal. Dê exemplos e indique se o uso pode gerar mal-entendidos.`;
  const promptPath = path.join(__dirname, "./ask.prompt.txt");
  const instructions = await fs.readFile(promptPath, "utf-8");

  try {
    const response = await openAIClient.responses.create({
      model: "gpt-4.1-nano",
      instructions,
      input: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    res.json(JSON.parse(response.output_text) as DictionaryEntry);
  } catch (error) {
    throw new Error(`Failed to parse OpenAI response to JSON: ${error}`);
  }
}
