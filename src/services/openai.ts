import OpenAI from "openai";
import { config } from "../config/index.js";

const client = new OpenAI({
  apiKey: config.openai.apiKey,
});

type ResponseCreateParamsNonStreaming =
  OpenAI.Responses.ResponseCreateParamsNonStreaming;

export async function openAiResponseCreate(
  params: Partial<ResponseCreateParamsNonStreaming>,
) {
  const response = await client.responses.create({
    model: config.openai.model,
    ...params,
  } as ResponseCreateParamsNonStreaming);

  return response;
}

export { client };
