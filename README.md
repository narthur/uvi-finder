# UVI Finder Action

A GitHub Action that automatically identifies [User-Visible Improvements](https://messymatters.com/uvi) (UVIs) in pull requests using OpenAI's API. It analyzes the changes between the base and head branches to detect improvements that would be visible or meaningful to end users.

## Features

- 🔍 Automatically detects user-visible improvements in PR changes
- 🤖 Uses OpenAI's API for intelligent analysis
- 💬 Maintains an up-to-date comment in the PR listing all identified UVIs
- 📊 Exposes UVI count and details as outputs for use in other workflow steps
- 🔄 Updates automatically when PR changes

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.