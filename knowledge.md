# UVI Finder Knowledge

## Project Overview
- GitHub Action to detect user-visible improvements in PRs using OpenAI
- Uses GPT-4 by default for analysis
- Maintains PR comments with findings
- Exposes results as action outputs

## Development Guidelines
- Run `pnpm install` to install dependencies
- Run `pnpm build` to compile TypeScript
- Run `pnpm test` to run tests
- Run `pnpm lint` to check code style

## Important Notes
- The action requires both `github-token` and `openai-api-key` secrets
- Only runs on pull_request events
- OpenAI response must be in JSON format with an `improvements` array
- PR comments are maintained by finding existing comments that start with the header text