import { Repository } from "redis-om";
import { DictionaryEntrySchema } from "./dictionary.model.js";
import redisClient from "../services/redis.js";

const dictionaryRepository = new Repository(DictionaryEntrySchema, redisClient);
await dictionaryRepository.createIndex();

export default dictionaryRepository;
