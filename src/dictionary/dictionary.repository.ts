import { EntityId, Repository } from "redis-om";
import {
  DictionaryEntry,
  DictionaryEntryEntity,
  DictionaryEntrySchema,
} from "./dictionary.model.js";
import redisClient from "../services/redis.js";
import { config } from "../config/index.js";

export class DictionaryRepository {
  private repository: Repository;

  constructor() {
    this.repository = new Repository(DictionaryEntrySchema, redisClient);
    this.repository.createIndex();
  }

  async getCacheEntryByWord(word: string) {
    const entity = await this.repository
      .search()
      .where("word")
      .equals(word)
      .return.first();

    return entity ? this.fromEntityFields(entity) : null;
  }

  async createCacheEntry(data: DictionaryEntry): Promise<DictionaryEntry> {
    const entityData = this.toEntityData(data);
    const saved = await this.repository.save(entityData);
    await redisClient.expire((saved as any)[EntityId], config.redis.ttl);
    return this.fromEntityFields(saved);
  }

  private toEntityData(entry: DictionaryEntry): DictionaryEntryEntity {
    return {
      word: entry.word,
      "brazil.meaning": entry.brazil.meaning,
      "brazil.usage": entry.brazil.usage,
      "portugal.meaning": entry.portugal.meaning,
      "portugal.usage": entry.portugal.usage,
      notes: entry.notes,
    };
  }

  private fromEntityFields(entity: any): DictionaryEntry {
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
}

export default new DictionaryRepository();
