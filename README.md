# UVI Finder Action

A GitHub Action that automatically identifies [User-Visible Improvements](https://messymatters.com/uvi) (UVIs) in pull requests using OpenAI's API. It analyzes the changes between the base and head branches to detect improvements that would be visible or meaningful to end users.

## Features

- 🔍 Automatically detects user-visible improvements in PR changes
- 🤖 Uses OpenAI's API for intelligent analysis
- 💬 Maintains an up-to-date comment in the PR listing all identified UVIs
- 📊 Exposes UVI count and details as outputs for use in other workflow steps
- 🔄 Updates automatically when PR changes

## What is a UVI?

A User-Visible Improvement (UVI) is any change that directly impacts the end user experience. This includes:

- New features users can see or interact with
- Bug fixes that affect user experience
- UI improvements or changes
- Performance improvements noticeable to users
- User-facing text changes (documentation, error messages, labels)
- Accessibility improvements

Internal changes like code refactoring, CI improvements, or developer tooling updates are not considered UVIs since they don't directly affect the end user experience.

## Usage

Add this action to your workflow:

```yaml
name: Find UVIs
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  find-uvis:
    runs-on: ubuntu-latest
    permissions:
      content: read
      pull-requests: write  # Required for commenting on PRs
    steps:
      - uses: actions/uvi-finder@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for API access | Yes | N/A |
| `openai-api-key` | OpenAI API key for analysis | Yes | N/A |
| `model` | OpenAI model to use | No | `gpt-4` |
| `comment-header` | Custom header for PR comment | No | `## User-Visible Improvements` |

## Outputs

| Output | Description |
|--------|-------------|
| `uvi-count` | Number of UVIs found |
| `uvi-list` | JSON array of identified UVIs |

### Example using outputs

```yaml
steps:
  - uses: actions/uvi-finder@v1
    id: uvi
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      openai-api-key: ${{ secrets.OPENAI_API_KEY }}
  
  - name: Use UVI results
    run: |
      echo "Found ${{ steps.uvi.outputs.uvi-count }} improvements"
      echo "Improvements: ${{ steps.uvi.outputs.uvi-list }}"
```

## PR Comment Format

The action maintains a comment in your PR that looks like this:

```markdown
## User-Visible Improvements

This PR contains 3 user-visible improvements:

1. Added dark mode support for better visibility in low-light conditions
2. Improved error messages for failed API requests
3. Reduced page load time by 30%

Last updated: [timestamp]
```

## Limitations

- The action requires write permissions for pull requests to maintain comments
- Large PRs are automatically chunked to stay within OpenAI's context limits
- Package lock files are automatically excluded from analysis
- Only changes that directly affect end users are considered UVIs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.