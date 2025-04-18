import { createClient } from "redis";
import logger from "./logger.js";
import { config } from "../config/index.js";

const client = await createClient({
  url: config.redis.url,
  username: config.redis.username,
  password: config.redis.password,
  socket: {
    host: config.redis.socket.host,
    port: Number(config.redis.socket.port),
  },
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
