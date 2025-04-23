import * as core from "@actions/core";
import * as github from "@actions/github";
import OpenAI from "openai";
import { findUVIs } from "./uvi-finder.js";
import { updatePRComment } from "./github-utils.js";
import { z } from "zod";

// Define the push event payload schema
const PushEventSchema = z.object({
  before: z.string(),
  after: z.string(),
});

async function run(): Promise<void> {
  try {
    // Get inputs
    const githubToken = core.getInput("github-token", { required: true });
    const openaiApiKey = core.getInput("openai-api-key", { required: true });
    const model = core.getInput("model") || "gpt-4";
    const commentHeader =
      core.getInput("comment-header") || "## User-Visible Improvements";

    // Initialize clients
    const octokit = github.getOctokit(githubToken);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Get PR context if available
    const { pull_request: pr } = github.context.payload;

    // If no PR, analyze the push diff instead
    let uvis;
    if (!pr) {
      core.info("No PR context found, analyzing push diff instead");
      const { owner, repo } = github.context.repo;
      
      // Parse and validate push event payload
      const pushPayload = PushEventSchema.parse(github.context.payload);

      uvis = await findUVIs({
        octokit,
        openai,
        model,
        owner,
        repo,
        base: pushPayload.before,
        head: pushPayload.after,
      });
    } else {
      // PR context available, use PR number
      const prData = z
        .object({
          base: z.object({
            sha: z.string(),
          }),
          head: z.object({
            sha: z.string(),
          }),
        })
        .parse(pr);

      uvis = await findUVIs({
        octokit,
        openai,
        model,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pullNumber: pr.number,
        base: prData.base.sha,
        head: prData.head.sha,
      });

      // Only update PR comment if we're in a PR context
      await updatePRComment({
        octokit,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pullNumber: pr.number,
        uvis,
        header: commentHeader,
      });
    }

    // Log UVIs to action output in all contexts
    if (uvis.length > 0) {
      core.info("User-Visible Improvements Found:");
      uvis.forEach((uvi, index) => {
        core.info(`${String(index + 1)}. ${uvi.description}${uvi.impact ? ` (${uvi.impact})` : ""}`);
      });
    } else {
      core.info("No user-visible improvements were found.");
    }

    // Set outputs regardless of PR context
    core.setOutput("uvi-count", uvis.length);
    core.setOutput("uvi-list", JSON.stringify(uvis));
  } catch (error) {
    // Type-safe error handling
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

void run();
