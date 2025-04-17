import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = "gpt-4.1-nano";

// try {
//   logger.info("Trying to connect to OpenAI...");
//   await client.models.list();
//   logger.info("Successful connection with OpenAI");
// } catch (error) {
//   logger.error("Error connecting to OpenAI", error);
// }

type ResponseCreateParamsNonStreaming =
  OpenAI.Responses.ResponseCreateParamsNonStreaming;

export async function openAiResponseCreate(
  params: Partial<ResponseCreateParamsNonStreaming>,
) {
  const response = await client.responses.create({
    model,
    ...params,
  } as ResponseCreateParamsNonStreaming);

  return response;
}

export { client };
