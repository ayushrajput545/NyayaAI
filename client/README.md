# NyayaAI frontend

The frontend is a Next.js App Router application with TypeScript and Tailwind
CSS. The landing page introduces NyayaAI and its research workflow. Product
authentication and backend integrations are not implemented here.

## Getting started

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the FastAPI server base URL. API
configuration is centralized in `src/lib/api.ts`; add endpoint-specific
functions only when their backend contracts are defined.

Set `YOUTUBE_WALKTHROUGH_URL` and `GITHUB_REPOSITORY_URL` in
`src/lib/site-config.ts` to enable the optional footer and video links.

## Structure

- `src/app/` — App Router entry points, global styles and metadata
- `src/components/layout/` — shared navigation and footer
- `src/components/providers/` — application-wide providers such as toasts
- `src/components/ui/` — reusable interface primitives and states
- `src/lib/` — shared utilities and API client
