import type { Analyzer, Sentiment } from "@my-subscriptions/sentiment-analysis"

const SENTIMENT_ENDPOINT = "/api/analyze-sentiment"

// LLM runs server-side behind the sentiment endpoint. Results are cached in
// localStorage (keyed by text) so dev refreshes don't re-pay for the same posts.
export const analyzerⵧllm: Analyzer = {
	name: "llm",
	analyze: async (text) => {
		const cached = read_cache(text)
		if (cached) return { ...cached }

		const response = await fetch(SENTIMENT_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		})
		if (!response.ok) throw new Error((await response.text()) || `POST ${SENTIMENT_ENDPOINT} → ${response.status}`)
		const result = (await response.json()) as Sentiment
		write_cache(text, result) // only successes are cached, so failures retry next time
		return { ...result }
	},
}

// Bump the version when the model/rubric/schema changes to invalidate stale entries.
const CACHE_PREFIX = "sentiment:llm:v1:"

const read_cache = (text: string): Sentiment | undefined => {
	try {
		const raw = globalThis.localStorage?.getItem(CACHE_PREFIX + hashⵧof(text))
		return raw ? (JSON.parse(raw) as Sentiment) : undefined
	} catch {
		return undefined // unavailable / corrupt storage falls back to a fresh call
	}
}

const write_cache = (text: string, response: Sentiment): void => {
	try {
		globalThis.localStorage?.setItem(CACHE_PREFIX + hashⵧof(text), JSON.stringify(response))
	} catch {
		// ignore quota / unavailable storage: caching is best-effort
	}
}

// cyrb53 — small, fast, low-collision string hash; keeps keys short.
const hashⵧof = (text: string): string => {
	let h1 = 0xdeadbeef
	let h2 = 0x41c6ce57
	for (let i = 0; i < text.length; i++) {
		const ch = text.charCodeAt(i)
		h1 = Math.imul(h1 ^ ch, 2654435761)
		h2 = Math.imul(h2 ^ ch, 1597334677)
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
	return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}
