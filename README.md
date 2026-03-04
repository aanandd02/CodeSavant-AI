
# CodeSavant-AI

CodeSavant-AI is an AI-powered code review application where users submit code, select a language, and receive structured review feedback.

## Project Structure

- `Frontend/`: React + Vite client application
- `Backend/`: Express API wrapped for serverless execution

## Tech Stack (Current Implementation)

- Frontend: React 19, Vite, React Router, Auth0 React SDK
- Editor and rendering: `react-simple-code-editor`, Prism, `react-syntax-highlighter`, `react-markdown`
- UI and animation: Framer Motion, custom CSS
- Backend: Node.js, Express, CORS, Morgan, `express-rate-limit`, `serverless-http`
- AI provider: Groq Chat Completions (`llama-3.3-70b-versatile`) via OpenAI-compatible SDK

## Core Features

- Auth0-based login flow on the frontend (`Auth0Provider` + `loginWithRedirect`)
- AI code review request from frontend to backend API
- Supported languages:
  - JavaScript
  - C
  - C++
  - Java
- Structured review output sections:
  - `🔴 Mistakes`
  - `💡 Improvements`
  - `🛠 Corrected Code`
- Copy and apply actions for corrected code in the review panel
- Backend rate limiting: 100 requests per 15 minutes per IP

## Backend API

Base route:

- `/ai`

Endpoint:

- `POST /ai/get-review`

Request body:

```json
{
  "code": "string (required)",
  "language": "javascript | c | cpp | java"
}
```

Response body:

```json
{
  "review": "AI-generated markdown/text with one code block"
}
```

Validation and behavior:

- Returns `400` if `code` is missing or invalid
- Falls back to `javascript` when `language` is unsupported
- Returns `500` on internal processing errors

## Environment Variables

### Backend (`Backend/.env`)

```env
GROQ_API_KEY=your_groq_api_key
```

### Frontend (`Frontend/.env`)

```env
VITE_API_BASE_URL=your_backend_base_url
```

Example:

```env
VITE_API_BASE_URL=https://your-aws-api-url
```

## Deployment Notes

The backend is configured for AWS serverless runtime.

- `Backend/server.js` exports:
  - `module.exports.handler = serverless(app, { basePath: "/default" })`
- This matches an AWS Lambda style deployment behind an API Gateway path.
- There is no `app.listen(...)` in the current backend file.

## Frontend Local Setup

```bash
cd Frontend
npm install
npm run dev
```

## CORS Allowlist (Current Hardcoded Values)

- `http://localhost:5173`
- `https://codesavant-ai-frontend.onrender.com`

## Frontend Routes

- `/`: Playground (editor + AI review)
- `/docs`: Documentation page
- `/changelog`: Changelog page
