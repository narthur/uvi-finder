export interface UVI {
  description: string;
  category?: string;
  impact?: string;
}

export interface FindUVIsOptions {
  octokit: any; // We'll properly type this from @actions/github
  openai: any; // We'll properly type this from openai
  model: string;
  owner: string;
  repo: string;
  pullNumber: number;
  base: string;
  head: string;
}

export interface UpdatePRCommentOptions {
  octokit: any;
  owner: string;
  repo: string;
  pullNumber: number;
  uvis: UVI[];
  header: string;
}