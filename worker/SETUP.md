# Enable the real‑AI (Claude) assistant — setup guide

This turns the portfolio chatbot from the built‑in engine into **real Claude AI**,
running through a tiny **Cloudflare Worker** that keeps your Anthropic API key
secret. It ships with anti‑spam controls already built in (see the bottom).

You'll do ~6 steps (mostly clicking + 4 commands). Total time ~15 minutes.
Nothing here exposes your API key in the website code.

> Prereqs: Node.js (already installed) and a terminal. All commands run from the
> **`worker/`** folder (`cd "Nasser Portfolio/worker"`).

---

## 1. Get an Anthropic API key + set a spend cap (your hard cost backstop)

1. Go to **https://console.anthropic.com** → sign up / log in.
2. **Billing** → add a small amount of credit (e.g. **$5**). With Claude Haiku, that's roughly **a few thousand messages**.
3. **Limits** → set a **Monthly spend limit** (e.g. **$5**). This is the ultimate ceiling — the assistant can never cost more than this, no matter what.
4. **API keys** → **Create key** → copy it (starts with `sk-ant-...`). Keep it somewhere safe; you'll paste it once in step 4.

## 2. Connect Cloudflare (free)

```bash
cd "Nasser Portfolio/worker"
npx wrangler login
```
This opens your browser — create a free Cloudflare account if you don't have one, and click **Allow**.

## 3. (Recommended) Create the daily‑cap store

```bash
npx wrangler kv namespace create BUDGET
```
It prints something like `id = "abc123..."`. **Copy that id** and paste it into
**`wrangler.toml`**, replacing `PASTE_YOUR_KV_NAMESPACE_ID_HERE`.

*(If that command errors on an older wrangler, use `npx wrangler kv:namespace create BUDGET`. You can also skip this step entirely — the per‑IP limit and your monthly spend cap still protect you — but then delete the `[[kv_namespaces]]` block from `wrangler.toml` so deploy doesn't complain.)*

## 4. Store your API key as a secret (never in code)

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```
Paste the `sk-ant-...` key when prompted. Cloudflare stores it encrypted — it's
never in your repo or the website.

## 5. Deploy the Worker

```bash
npx wrangler deploy
```
When it finishes it prints your Worker URL, e.g.:
```
https://nasser-assistant.YOUR-SUBDOMAIN.workers.dev
```
**Copy that URL.**

## 6. Point the website at it

1. Open **`src/lib/assistant.ts`** and paste the URL into:
   ```ts
   export const ASSISTANT_API_URL: string = 'https://nasser-assistant.YOUR-SUBDOMAIN.workers.dev'
   ```
2. Rebuild + push so the live site picks it up:
   ```bash
   cd "Nasser Portfolio"
   git add -A && git commit -m "Enable Claude-powered assistant" && git push
   ```
   GitHub Pages redeploys in ~1 minute. Open https://nassersaleh.ca and try the assistant — it's now Claude.

> Prefer not to touch the code? Just send me the Worker URL and I'll paste it in and redeploy.

---

## Anti‑spam / abuse controls (already built in)

| Control | Where | Effect |
|---|---|---|
| **Origin allowlist** | `wrangler.toml` → `ALLOWED_ORIGINS` | Only your domains can call the assistant — other sites/scripts get a 403. |
| **Per‑IP rate limit** | `wrangler.toml` → `RATE_LIMITER` (15/min) | One visitor can't flood it; extra requests get a polite "slow down" reply. |
| **Global daily cap** | `wrangler.toml` → `DAILY_MAX` (500/day) + KV | Hard ceiling on total calls per day. |
| **Output cap** | `worker.js` → `MAX_OUTPUT_TOKENS` (450) | Caps response length → caps per‑message cost. |
| **Input caps** | `worker.js` | Limits message count + length (still allows pasting a full job description). |
| **Scoped prompt** | `worker.js` → `SYSTEM_PROMPT` | Only answers about Nasser; refuses "act as ChatGPT" / off‑topic misuse. |
| **Monthly spend limit** | Anthropic Console (step 1) | The hard dollar backstop — nothing can exceed it. |

**Tuning:** edit the numbers in `wrangler.toml` / `worker.js`, then `npx wrangler deploy` again.
**Change the model:** edit `MODEL` in `worker.js` (`claude-haiku-4-5` → `claude-sonnet-4-6` or `claude-opus-4-8`) and redeploy.

If the Worker is ever down or over budget, the website automatically falls back to
the built‑in offline engine, so the assistant always answers something.
