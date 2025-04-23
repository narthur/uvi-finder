import type { getOctokit } from "@actions/github";
import type { OpenAI } from "openai";

export interface UVI {
  description: string;
  category?: string;
  impact?: string;
}

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
