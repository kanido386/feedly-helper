# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

feedly-helper is a personal tool for fetching unread articles from Feedly. It has two parts:
- **`lambda/`** — Express.js app deployed to AWS Lambda via `serverless-http` + `node-lambda`
- **`frontend/`** — React (Create React App) app deployed to GitHub Pages

## Commands

### Lambda (backend)

```bash
cd lambda
npm install
npm run dev        # Run locally with nodemon + dotenv on port 3000
npm run deploy     # Deploy to AWS Lambda (requires $ARN_LAMBDA and $ARN_CHROMIUM_LAYER env vars)
```

Deployment excludes the `.cache` directory (Puppeteer browser cache). Requires `lambda/.env` — copy from `lambda/.env.example`.

### Frontend

```bash
cd frontend
npm install
npm start          # Dev server
npm run build      # Production build
npm test           # Run Jest tests
npm run deploy     # Build and deploy to GitHub Pages
```

## Architecture

### Lambda (`lambda/`)

- **`index.js`** — Express app with all routes. Dual-mode: runs as a local HTTP server when `NODE_ENV=local`, otherwise exports `serverless(app)` as an AWS Lambda handler.
- **`feedly.js`** — Calls the Feedly v3 API (`GET /v3/streams/:streamId/contents`) with pagination to collect all unread articles.

**Key routes:**
- `GET /feedly` — Fetches all unread Feedly article URLs for the user, returned as a Markdown list
- `GET /token` — Uses Puppeteer to log into Feedly via browser automation, extracts the `feedlyToken` from `localStorage`, then stores it in the Lambda's own environment variables via AWS SDK
- `POST /encrypt` / `POST /decrypt` — AES encryption/decryption using env-configured key+IV
- `POST /updateEnv` — Updates a Lambda environment variable via AWS SDK (used to store the Feedly token)

**Browser automation:**
- Local (`NODE_ENV=local`): uses `puppeteer-extra` + `puppeteer-extra-plugin-stealth` (visible browser)
- AWS Lambda: uses `rebrowser-puppeteer-core` + `@sparticuz/chromium` (headless, deployed as a Lambda Layer). The `pageController` module wraps Turnstile bypass logic (based on [zfcsoftware/puppeteer-real-browser](https://github.com/zfcsoftware/puppeteer-real-browser)).

**Required env vars** (see `lambda/.env.example`):
- `CRYPTO_ALGORITHM`, `CRYPTO_KEY`, `CRYPTO_IV` — for token encryption
- `FEEDLY_ACCESS_TOKEN`, `FEEDLY_USER_ID` — Feedly API credentials
- `EMAIL`, `PASSWORD` — Feedly login for Puppeteer-based token refresh
- `FUNCTION_ARN` — ARN of this Lambda function itself (used for self-updating env vars)

### Frontend (`frontend/`)

A minimal React app (`frontend/src/App.js`) with a single "Fetch Feedly" button. Clicking it calls `GET $REACT_APP_API_ENDPOINT/feedly` and displays the result in a textarea. Set `REACT_APP_API_ENDPOINT` in a `.env` file in the `frontend/` directory to point at the Lambda URL.

### AWS Infrastructure

The Lambda self-updates its own `FEEDLY_ACCESS_TOKEN` env var via the AWS SDK (`@aws-sdk/client-lambda`). Token refresh is triggered by calling `GET /token`, which can be automated with Amazon EventBridge Scheduler. The `@sparticuz/chromium` binary is deployed as a separate Lambda Layer, referenced via `$ARN_CHROMIUM_LAYER` during deployment.
