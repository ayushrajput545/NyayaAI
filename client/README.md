# NyayaAI frontend

The frontend is a Next.js App Router application with TypeScript and Tailwind
CSS. It includes the NyayaAI landing page and email-OTP authentication flow.

## Getting started

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the FastAPI server base URL. API
configuration is centralized in `src/lib/api.ts`.

## Authentication

The frontend uses the FastAPI auth routes under `/auth/api/v1`: `register`,
`verify-email`, `resend-otp`, `login`, and `me`. The login response supplies a
bearer access token and user; the backend token expires after 30 minutes and
does not provide a refresh token. The frontend keeps the access token in
`sessionStorage`, restores the current user from `/auth/api/v1/me` on reload,
and clears the local session when an authenticated request returns 401.
Logout clears the browser session; the backend does not expose a logout or
token-revocation route.

Because the backend returns a token rather than setting an HttpOnly cookie,
the browser-side token is accessible to JavaScript. `sessionStorage` limits
its lifetime to the current tab session but is not an HttpOnly-cookie
equivalent.

## Workspace API contract

Workspace requests are made in `src/app/workspace/page.tsx`:

- `POST /rag/api/v1/ask_que` accepts `question`, `use_multi_agent`,
  `use_my_doc`, and optional integer `conversation_id` and `document_id`;
  responses return the conversation ID as a string, an answer, and sources
  (`filename`, `page_number`, and `content`). When `use_my_doc` is true, the
  request must identify a document owned by the current user. Both keyword and
  vector retrieval are restricted to that document in Quick Search and Deep
  Research.
- `GET /conversations/api/v1/get-conversations`,
  `GET /conversations/api/v1/{conversation_id}`, and
  `DELETE /conversations/api/v1/{conversation_id}` are used for saved history.
  A conversation is created by the ask endpoint when no conversation ID is
  supplied; the frontend does not generate conversation or user IDs.

The backend requires an authenticated user for every ask request, including
Quick Search. An anonymous request currently returns HTTP 401, so anonymous
Quick Search cannot complete until the backend supports it. The workspace
still allows anonymous users to compose and submit a Quick Search without
redirecting them; it surfaces this backend limitation. There is no endpoint to
list uploaded documents, so document-only scope can select only PDFs uploaded
through the Documents page in the current browser tab. Saved conversation
messages do not include source data, so the workspace does not fabricate
citations for restored conversations.

## Document management API contract

Document routes are mounted at `/documents/api/v1` and require an
authenticated user:

- `POST /upload` accepts a multipart `file` and returns `message`,
  `document_id`, `filename`, and `total_chunks`. The backend validates PDF
  content, enforces a 20 MB maximum, and processes the file during the request.
- `GET /{document_id}/download` returns the PDF file.
- `DELETE /{document_id}` deletes the user's document and its chunks.
- There is no document-list endpoint. The document page displays only upload
  responses returned during the current visit and does not infer a user's
  existing document collection.
- `GET /{document_id}` is declared with the upload response schema, but the
  handler returns a database document model that does not provide the schema's
  `message`, `document_id`, and `total_chunks` fields. The page avoids relying
  on this mismatched detail response.

Set `YOUTUBE_WALKTHROUGH_URL` and `GITHUB_REPOSITORY_URL` in
`src/lib/site-config.ts` to enable the optional footer and video links.

## Structure

- `src/app/` — App Router entry points, global styles and metadata
- `src/components/layout/` — shared navigation and footer
- `src/components/providers/` — application-wide providers such as toasts
- `src/components/auth/` — login, registration and email verification forms
- `src/components/ui/` — reusable interface primitives and states
- `src/contexts/` — authentication state
- `src/lib/` — shared utilities, API clients and browser session handling
- `src/services/` — backend authentication service
