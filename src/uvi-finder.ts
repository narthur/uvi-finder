import type { FindUVIsOptions, UVI } from "./types.js";

const SYSTEM_PROMPT = `You are an expert at identifying user-visible improvements (UVIs) in code changes.
Your task is to analyze the provided code diff and identify any changes that would be visible or meaningful to end users.
Focus on actual improvements that users would notice or benefit from, not internal changes.
Respond with a JSON array of improvements, each with a description and optional category and impact fields.`;

export async function findUVIs(options: FindUVIsOptions): Promise<UVI[]> {
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
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  // Parse the response
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return [];
  }

  try {
    const result = JSON.parse(content);
    return result.improvements || [];
  } catch (error) {
    console.error("Failed to parse OpenAI response:", error);
    return [];
  }
}
