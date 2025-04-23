import type { getOctokit } from "@actions/github";
import type { OpenAI } from "openai";
import type { UVI } from "./schemas.js";

export interface FindUVIsOptions {
  octokit: ReturnType<typeof getOctokit>;
  openai: OpenAI;
  model: string;
  owner: string;
  repo: string;
  pullNumber: number;
  base: string;
  head: string;
}

export interface UpdatePRCommentOptions {
  octokit: ReturnType<typeof getOctokit>;
  owner: string;
  repo: string;
  pullNumber: number;
  uvis: UVI[];
  header: string;
}
