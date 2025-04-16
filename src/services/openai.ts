import OpenAI from "openai";
import logger from "./logger.js";

const client = new OpenAI();

try {
  logger.info("Trying to connect to OpenAI...");
  await client.models.list();
  logger.info("Successful connection with OpenAI");
} catch (error) {
  logger.error("Error connecting to OpenAI", error);
}

export default client;
