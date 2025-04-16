import { createClient } from "redis";

const url = process.env.REDIS_URL;

export async function createRedisClient() {
  const client = await createClient({
    url,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  return client;
}
