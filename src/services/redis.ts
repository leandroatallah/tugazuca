import { createClient } from "redis";
import logger from "./logger.js";

const url = process.env.REDIS_URL;

const client = await createClient({
  url,
})
  .on("error", (err) => logger.error("Redis Client Error", err))
  .connect()
  .then((client) => {
    logger.info("Connected to Redis Client!");
    return client;
  })
  .catch((err) => {
    logger.error("Erro ao conectar ao Redis:", err);
    throw err;
  });

export default client;
