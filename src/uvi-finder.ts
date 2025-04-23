import type { FindUVIsOptions } from "./types.js";
import { OpenAIResponseSchema } from "./schemas.js";

const SYSTEM_PROMPT = `You are an expert at identifying user-visible improvements (UVIs) in code changes.
Your task is to analyze the provided code diff and identify any changes that would be visible or meaningful to end users.
Focus on actual improvements that users would notice or benefit from, not internal changes.
Your response should be valid JSON with this exact structure:
{
  "improvements": [
    {
      "description": "Description of the improvement",
      "category": "Optional category of the improvement",
      "impact": "Optional description of the impact"
    }
  ]
}`;

export async function findUVIs(options: FindUVIsOptions) {
  const { octokit, openai, model, owner, repo, pullNumber } = options;

  // Get the PR diff
  const response = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
    mediaType: {
      format: "diff",
    },
  });

  const diff = response.data;

  // Ask OpenAI to analyze the diff
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Please analyze this diff for user-visible improvements:\n\n${diff}`,
      },
    ],
    temperature: 0.2,
  });

  // Parse and validate the response
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return [];
  }

  try {
    const result = JSON.parse(content);
    const parsed = OpenAIResponseSchema.safeParse(result);
    
    if (!parsed.success) {
      console.error("Invalid OpenAI response format:", parsed.error);
      return [];
    }

    return parsed.data.improvements;
  } catch (error) {
    console.error("Failed to parse OpenAI response:", error);
    return [];
  }
}
