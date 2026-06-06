# TODO — Take-home review findings

Review lens: this repo is a take-home assignment (not fully finished). Items are
prioritized by what costs the most points with an evaluator. Each item keeps a
stable ID so it can be referenced in commits / discussion.

Suggested order before submission: **B1, B2, S1** (broken + leaky) → **S2 + H1**
(biggest polish signal) → **T1, T3** (tests + docs).

---

## 🔴 Blockers (app is broken right now)

- [ ] **B1** — Remove the bare `xxx` identifier in `S-skus/@my-subscriptions/app/app/api/me/linkedin/route.ts:27`.
  It throws `ReferenceError` at runtime and fails the build, so the whole LinkedIn
  route dies before doing anything. (Currently staged / unfinished work.)
- [ ] **B2** — Remove the secret leak in the same file (`linkedin/route.ts:7`):
  `console.log("GET /api/me/linkedin ...", process.env["LINKDAPI_KEY"])` prints the
  API key to host logs.

## 🟠 Security & privacy

- [ ] **S1** — Strip identity/PII logging:
  - `app/api/me/route.ts` — `console.log({ accountsByProvider })` (full verified accounts).
  - `app/dashboard/dashboard-client.tsx` — `console.log({ user })` and
    `console.log({ external_accounts })` write PII to the **browser** console.
- [ ] **S2** — API routes should return `401 JSON`, not redirect. `proxy.ts`
  `isProtectedRoute` includes `/api(.*)` and `307`s unauthenticated calls to
  `/sign-in`; `fetch()` follows the redirect and receives sign-in HTML, so
  `fetchꓽjson` throws an opaque parse error. Redirect pages only; 401 the API.
- [ ] **S3** — Validate env at startup. `process.env["LINKDAPI_KEY"]` is
  `string | undefined` but is assigned into a `Record<string,string>` header. Add a
  zod (or manual) env schema so a missing key fails loud, not as a malformed header.

## 🟡 Correctness

- [ ] **C1** — Fix invalid markup + missing React keys in `dashboard-client.tsx`
  `LinkedInPresence`: `<ol>` whose children are `<small><pre>` (not `<li>`), and a
  `.map()` with no `key`.
- [ ] **C2** — `client--com.linkdapi` `GETꓽⳇsearchⳇpeople`: `searchParams.append(k, v)`
  receives numbers (`count`) and possibly `undefined`; `undefined` is coerced to the
  literal string `"undefined"` in the query. Filter `undefined`, `String()` the rest.
- [ ] **C3** — Confirm Clerk provider id. `getUserOauthAccessToken(userId, "linkedin_oidc")`
  may need the `oauth_` prefix (`oauth_linkedin_oidc`) depending on Clerk version; if
  wrong it returns no token and the route 401s.
- [ ] **C4** — `1-isomorphic/http-client/module/src/fetch.ts`: `export const _fetch =
  globalThis.fetch` is unbound. Use `globalThis.fetch.bind(globalThis)` to avoid
  illegal-invocation in runtimes that check the receiver.

## 🧹 Code hygiene (what a take-home is really grading)

- [ ] **H1** — Delete dead code before submitting:
  - `app/dashboard/me-fetcher.tsx` (unused duplicate fetcher).
  - `toProfile` in `api/me/route.ts` (defined, never called) + the large commented-out
    token-fetching block.
  - `dashboard-client.tsx`: `{false && …}` branch, `{/*<Thread />*/}`, commented skeletons.
  - `sidebar.tsx`: `TODO sth` literal text rendered in the UI.
- [ ] **H2** — `<HeatGraph data={[]} />` is hardcoded empty placeholder. Wire it or cut it.
- [ ] **H3** — `Post.engagements: {}` (empty-object type) accepts almost anything and
  documents nothing. Model it properly or use `unknown`.
- [ ] **H4** — `HttpClient` interface declares `get(path, options?)` optional, but the
  concrete impl methods take `options` as required. Align the signatures.

## 🧪 Tests & docs

- [ ] **T1** — Add a focused unit test for the ranking logic in `GETꓽⳇsearchⳇpeople`
  (the most interesting code in the repo). Move the ~137 KB of inline JSON fixtures
  (`client--com.linkdapi` tests/notes) into `*.json` files.
- [ ] **T2** — `S-skus/@my-subscriptions/sentiment-analysis` is an empty stub
  (`exports: "./*": "./src/*"` but no `src/`). Implement or remove.
- [ ] **T3** — Fix stale/contradictory docs:
  - App `README.md` references `middleware.ts` (file is `proxy.ts`), `app/assistant.tsx`,
    and a "Go to Chat" CTA (landing says "Go to Dashboard" → `/dashboard`).
  - Root `AGENTS.md` is an empty heading skeleton — fill overview / build / test / security.

## 🏛️ Architecture notes (defensible — call them out, don't necessarily change)

- [ ] **A1** — Unicode-glyph identifiers (`createꓽclient`, `userⵧlinkedin`, `Url‿str`,
  `GETꓽⳇuserinfo`). Striking but polarizing (un-typeable, grep-hostile, onboarding cost).
  If keeping, document the naming convention in `AGENTS.md` so it reads as intentional.
- [ ] **A2** — LinkedIn route awaits are strictly sequential (userinfo → search → posts,
  each depends on the previous, so it's fine). Consider returning partial data so one
  slow third-party call doesn't block the whole dashboard.
- [ ] **A3** — `force-dynamic` + auth checks in both page and middleware is redundant
  defense-in-depth (intentional belt-and-suspenders) — fine, just noted.
