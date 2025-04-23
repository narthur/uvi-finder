import { describe, it, expect, vi } from "vitest";
import { findUVIs } from "./uvi-finder.js";

describe("findUVIs", () => {
  it("should return empty array when no improvements found", async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          get: vi.fn().mockResolvedValue({ data: "empty diff" }),
        },
      },
    };

    const mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({ improvements: [] }),
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findUVIs({
      octokit: mockOctokit as any,
      openai: mockOpenAI as any,
      model: "gpt-4",
      owner: "test",
      repo: "test",
      pullNumber: 1,
      base: "base-sha",
      head: "head-sha",
    });

    expect(result).toEqual([]);
  });

  it("should validate and return properly formatted improvements", async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          get: vi.fn().mockResolvedValue({ data: "test diff" }),
        },
      },
    };

    const validImprovement = {
      description: "Added dark mode support",
      category: "UI",
      impact: "Better visibility in low-light conditions",
    };

    const mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    improvements: [validImprovement],
                  }),
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findUVIs({
      octokit: mockOctokit as any,
      openai: mockOpenAI as any,
      model: "gpt-4",
      owner: "test",
      repo: "test",
      pullNumber: 1,
      base: "base-sha",
      head: "head-sha",
    });

    expect(result).toEqual([validImprovement]);
  });

  it("should handle invalid response format", async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          get: vi.fn().mockResolvedValue({ data: "test diff" }),
        },
      },
    };

    const mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    improvements: [
                      {
                        // Missing required 'description' field
                        category: "UI",
                      },
                    ],
                  }),
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findUVIs({
      octokit: mockOctokit as any,
      openai: mockOpenAI as any,
      model: "gpt-4",
      owner: "test",
      repo: "test",
      pullNumber: 1,
      base: "base-sha",
      head: "head-sha",
    });

    expect(result).toEqual([]);
  });
});
