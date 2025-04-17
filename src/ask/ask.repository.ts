import { Repository } from "redis-om";
import { DictionaryEntrySchema } from "./ask.model.js";
import redisClient from "../services/redis.js";

const askRepository = new Repository(DictionaryEntrySchema, redisClient);
await askRepository.createIndex();

export default askRepository;
