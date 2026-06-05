# monorepo

## Introduction

State of the art monorepo using pnpm 11

## Prerequisites

- [mise](https://mise.jdx.dev/) — manages Node, pnpm (`curl https://mise.jdx.dev/install.sh | sh`)

### Environment Variables

Copy the example env file and then edit your values:

```bash
cp .env.example .env.local   # macOS/Linux
copy .env.example .env.local # or on Windows
```

### Install Dependencies

```bash
pnpm install
```

## Run the Development Server

```bash
pnpx turbo --filter @my-subscriptions/app dev
```

Open http://localhost:3000 with your browser to see the result.

- Click “Go to Dashboard”
  - If you’re signed out, you’ll be redirected to the embedded sign-in page
  - After sign-in, you’ll be returned to `/chat`
