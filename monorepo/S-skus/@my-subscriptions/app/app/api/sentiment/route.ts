export type SentimentLabel = "positive" | "neutral" | "negative"

export type SentimentRequest = { text: string }
export type SentimentResponse = { label: SentimentLabel; score: number } // score normalized to [-1, 1]

// Generic, provider-agnostic sentiment endpoint. Not tied to any feature.
export async function POST(request: Request) {
	const { text } = (await request.json()) as SentimentRequest
	if (!text?.trim()) return new Response("Missing text", { status: 400 })

	// STUB: no model wired yet, so fail loudly. This keeps the error path exercised
	// end-to-end (endpoint → analyzer → UI) until a real LLM is plugged in.
	// TODO: replace with a real LLM analysis via the existing `ai` + `@ai-sdk/openai`
	// deps — generateObject({ model: openai("…"), schema, prompt: text }) → { label, score }
	// returning `SentimentResponse`. Add auth gating + rate limiting before going
	// live (this is an open, cost-bearing endpoint once a model is wired).
	return new Response("LLM sentiment is not implemented yet", { status: 501 })
}
