require("dotenv").config();

import OpenAI from "openai";

const client = new OpenAI();

export default client;
