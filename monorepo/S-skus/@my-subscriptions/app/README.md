## Development

You can start customizing the UI by modifying components in the `components/assistant-ui/` directory.

### Key Files

- `app/page.tsx` — Public landing page (top-right auth controls, “Go to Chat” CTA)
- `app/chat/page.tsx` — Protected chat page (Assistant UI)
- `app/assistant.tsx` — Assistant runtime setup (Assistant Cloud + Clerk token)
- `app/api/chat/route.ts` — Demo chat API endpoint using OpenAI
- `app/sign-in/[[...sign-in]]/page.tsx` — Embedded Clerk sign-in
- `app/sign-up/[[...sign-up]]/page.tsx` — Embedded Clerk sign-up
- `app/layout.tsx` — App wrapper with `ClerkProvider` (embedded routes configured)
- `middleware.ts` — Protects `/chat` and `/api`, keeps `/` public
