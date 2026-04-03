# Contributing to finprim

Thanks for your interest in contributing to finprim! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/finprim.git
   cd finprim
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the tests to make sure everything works:
   ```bash
   npm test
   ```

## Development Workflow

```bash
npm run dev        # Watch mode (rebuilds on changes)
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
npm run lint       # Type-check with tsc
npm run build      # Production build
```

## Making Changes

1. Create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes
3. Add tests for any new functionality
4. Ensure all tests pass: `npm test`
5. Ensure types are correct: `npm run lint`

## Pull Requests

- **Open an issue first** before submitting a PR for significant changes so we can discuss the approach
- Keep PRs focused - one feature or fix per PR
- Include tests for new validators, formatters, or calculations
- Update the README if you add a new public API

## What We're Looking For

Here are some areas where contributions are especially welcome:

- **New validators** - Additional financial data validators (e.g., SEPA, ACH)
- **Locale coverage** - More currency locales and formatting options
- **Bug reports** - Found an edge case? Open an issue with the input that failed
- **Documentation** - Improvements to docs, examples, or guides
- **Framework integrations** - Additional framework support beyond React/NestJS/Zod

## Code Style

- Write TypeScript (no `any` types)
- Follow the existing patterns in the codebase
- All validators return a discriminated union (`{ valid: true, ... } | { valid: false, error: string }`)
- Keep the core zero-dependency - framework integrations go in their own subpath

## Reporting Issues

When reporting a bug, please include:
- The input value that caused the issue
- Expected behavior
- Actual behavior
- Your Node.js and TypeScript versions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
