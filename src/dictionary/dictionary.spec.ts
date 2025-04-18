import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../server.js";
import OpenAI from "openai";

vi.mock("redis", () => {
  const mockClient = {
    on: vi.fn().mockReturnThis(),
    connect: vi.fn().mockResolvedValue(true),
    expire: vi.fn().mockResolvedValue(1),
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
    del: vi.fn().mockResolvedValue(1),
  };

  return {
    createClient: vi.fn().mockReturnValue({
      ...mockClient,
      connect: vi.fn().mockResolvedValue(mockClient),
    }),
  };
});

vi.mock("redis-om", () => ({
  Repository: vi.fn().mockImplementation(() => ({
    createIndex: vi.fn().mockResolvedValue(true),
    search: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
      return: {
        first: vi.fn().mockResolvedValue(null),
      },
    }),
    save: vi.fn().mockImplementation((data) => ({
      ...data,
      entityId: "mock-id",
    })),
  })),
  Schema: vi.fn().mockImplementation((name, definition) => ({
    name,
    definition,
    createIndex: vi.fn().mockResolvedValue(true),
  })),
  EntityId: String,
}));

vi.mock("openai", () => ({
  default: vi.fn().mockImplementation(() => ({
    responses: {
      create: vi.fn().mockResolvedValue({
        output_text: JSON.stringify({
          word: "gajo",
          brazil: {
            meaning: "cara, sujeito",
            usage: "informal, comum no dia a dia",
          },
          portugal: {
            meaning: "homem, indivíduo",
            usage: "muito comum em Portugal",
          },
          notes: "Termo mais comum em Portugal que no Brasil",
        }),
      }),
    },
  })),
}));

describe("Dictionary", () => {
  describe("GET /ask/:term", () => {
    it("should request OpenAI API and create new Redis dictionary entry", async () => {
      // const openAiSpy = vi.spyOn(OpenAI.prototype.responses, "create");
      const response = await request(app).get("/ask/gajo");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("word", "gajo");
      // expect(openAiSpy).toBeCalled();
    });

    it("should retrieve entry from Redis cache", async () => {
      // ...
    });

    it("should request a new entry from OpenAI API when Redis cache expires", async () => {
      // ...
    });
  });
});
