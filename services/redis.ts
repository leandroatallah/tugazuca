import { createClient } from "redis";

const url = process.env.REDIS_URL;

const client = await createClient({
  url,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect()
  .then((client) => {
    console.log("Redis client conectado!");
    return client;
  })
  .catch((err) => {
    console.error("Erro ao conectar ao Redis:", err);
    throw err;
  });

export default client;
