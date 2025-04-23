# Implementation Plan for UVI Finder Action

## Core Components

1. Setup Project Structure
   - Configure TypeScript
   - Add necessary dependencies (OpenAI SDK, GitHub SDK)
   - Create source directory structure

2. Core Implementation
   - Create main action handler
   - Implement diff retrieval from GitHub API
   - Setup OpenAI client and prompt engineering
   - Create UVI detection logic
   - Implement PR comment management

3. Testing
   - Setup test infrastructure
   - Create unit tests
   - Add integration tests

## Implementation Details

### Phase 1: Project Setup
- Create tsconfig.json
- Add dependencies
- Setup ESLint
- Create src directory structure

### Phase 2: Core Implementation
- Create main action entry point
- Implement GitHub API integration
  - Get PR diff
  - Manage PR comments
- Implement OpenAI integration
  - Setup client
  - Create prompt template
  - Process responses
- Create UVI detection logic
  - Parse OpenAI response
  - Extract improvements
  - Format for output

### Phase 3: Testing
- Setup Vitest
- Create test fixtures
- Implement unit tests
- Add integration tests with mock responses