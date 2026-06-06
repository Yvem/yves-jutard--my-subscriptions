# monorepo

## Introduction

A complete monorepo using pnpm 11 and turbo.

This monorepo is designed to hold several Stock Keeping Units aka. final products (common for startups iterating
quickly) while allowing to share packages between them. The SKUs can be split in several packages as well for better
architecture.

Current available SKUs:

- ["My Subscriptions"](S-skus/%40my-subscriptions/README.md)

## Installation

We use [mise](https://mise.jdx.dev/) to manage the core dev engines: Node, pnpm.

Install it with `curl https://mise.jdx.dev/install.sh | sh` the `mise install`.

Then install dependencies:

```bash
pnpm install
```

## Local execution

See each SKU or package for more details.

But let's be quick:

```bash
pnpx turbo --filter @my-subscriptions/app dev
```

## Contributing

See [CONTRIBUTING](%23%23CONTRIBUTING/01-intro.md)

## TODO

- proper TypeScript setup
  - and fix TypeScript issues
- A proper linter setup
  - and fix issues
- A proper logger + logging strategy
- mise scripts to clean/update/install/etc.
- A proper CI/CD
- A proper release process
- A proper documentation
- A proper code style guide
- A proper testing strategy
- A proper code coverage strategy
