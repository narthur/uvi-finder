import * as core from "@actions/core";
import * as github from "@actions/github";
import OpenAI from "openai";
import { findUVIs } from "./uvi-finder.js";
import { updatePRComment } from "./github-utils.js";

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

    // Get PR context
    const { pull_request: pr } = github.context.payload;
    if (!pr) {
      throw new Error("This action can only be run on pull requests");
    }

    // Find UVIs
    const uvis = await findUVIs({
      octokit,
      openai,
      model,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pullNumber: pr.number,
      base: pr.base.sha,
      head: pr.head.sha,
    });

    // Update PR comment
    await updatePRComment({
      octokit,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pullNumber: pr.number,
      uvis,
      header: commentHeader,
    });

    // Set outputs
    core.setOutput("uvi-count", uvis.length);
    core.setOutput("uvi-list", JSON.stringify(uvis));
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unexpected error occurred");
    }
  }
}

run();
