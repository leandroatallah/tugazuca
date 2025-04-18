export const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  redis: {
    url: process.env.REDIS_URL,
    ttl: 24 * 60 * 60, // 24 hours
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
  openai: {
    apiKey: process.env.OPEN_API_KEY,
    model: "gpt-4.1-nano",
  },
} as const;
