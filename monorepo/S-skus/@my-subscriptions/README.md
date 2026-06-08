# My Subscriptions

## Introduction

An app extracting content from third-party accounts and performing sentiment analysis on them.

## Installation

Perform the monorepo install steps (See root README.md)

## API keys

- clerk
- https://linkdapi.com/dash
- https://platform.openai.com/api-keys

## Run the Development Server

```bash
pnpx turbo --filter @my-subscriptions/app dev
```

Open http://localhost:3000 with your browser to see the result.

- Click “Go to Dashboard”
  - If you’re signed out, you’ll be redirected to the embedded sign-in page
  - After sign-in, you’ll be returned to `/dashboard`
