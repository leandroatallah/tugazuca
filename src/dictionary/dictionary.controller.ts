import { Request, Response } from "express";
import dictionaryRepository from "./dictionary.repository.js";
import { DictionaryService } from "./dictionary.service.js";
import { DictionaryError } from "./dictionary.types.js";
import logger from "../services/logger.js";

const dictionaryService = new DictionaryService(dictionaryRepository);

export async function getWordComparison(req: Request, res: Response) {
  const { term } = req.params;

  try {
    const result = await dictionaryService.getWordComparison(term);
    res.json({ data: result });
  } catch (error) {
    if (error instanceof DictionaryError) {
      return res.status(error.status).json({
        error: error.message,
        code: error.code,
      });
    }
    logger.trace(error);
    return res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}
