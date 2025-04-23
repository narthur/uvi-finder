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
const MAX_CHUNK_SIZE = 4000; // Conservative limit to leave room for prompts
function chunkDiff(diff) {
    // Split by file (each file starts with 'diff --git')
    const files = diff.split(/(?=diff --git )/);
    const chunks = [];
    let currentChunk = "";
    for (const file of files) {
        // If adding this file would exceed chunk size, start a new chunk
        if (currentChunk.length + file.length > MAX_CHUNK_SIZE && currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = file;
        }
        else {
            currentChunk += file;
        }
    }
    // Add the last chunk if it's not empty
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }
    return chunks;
}
export async function findUVIs(options) {
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
    // The diff comes back as a string when using mediaType: "diff"
    const diffText = response.data.toString();
    const chunks = chunkDiff(diffText);
    const allImprovements = [];
    // Analyze each chunk
    for (const chunk of chunks) {
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `Please analyze this diff for user-visible improvements:\n\n${chunk}`,
                },
            ],
            temperature: 0.2,
        });
        // Parse and validate the response
        const content = completion.choices[0]?.message?.content;
        if (!content)
            continue;
        try {
            const result = JSON.parse(content);
            const parsed = OpenAIResponseSchema.safeParse(result);
            if (parsed.success) {
                allImprovements.push(...parsed.data.improvements);
            }
            else {
                console.error("Invalid OpenAI response format:", parsed.error);
            }
        }
        catch (error) {
            console.error("Failed to parse OpenAI response:", error);
        }
    }
    // Deduplicate improvements by description
    const uniqueImprovements = Array.from(new Map(allImprovements.map(item => [item.description, item])).values());
    return uniqueImprovements;
}
