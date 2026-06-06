import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

import type { Analyzer, SentimentExtended } from "../types"

// LLM runs server-side behind the sentiment endpoint. Results are cached in
// localStorage (keyed by text) so dev refreshes don't re-pay for the same posts.
export const analyzerⵧllm: Analyzer = {
	name: "llm",
	analyze: async (text): Promise<SentimentExtended> => {
		const { object } = await generateObject({
			model: MODEL,
			schema,
			system: RUBRIC,
			prompt: text,
		})
		return object
	},
}

// Direct OpenAI provider (reads OPENAI_API_KEY). Pin a dated snapshot in production
// for reproducible scores, e.g. openai("gpt-4o-mini-2024-07-18").
const MODEL = openai("gpt-4o-mini")

const RUBRIC = `You score the sentiment INTENDED BY THE AUTHOR of a short social media post.

Guidelines:
- Judge the author's intended affect, not the literal polarity of individual words.
- Treat self-deprecation, irony, and humour as POSITIVE when they're clearly playful and the
  post lands on an upbeat or generous note (sharing a resource, an "Enjoy!" sign-off). This is
  the classic LinkedIn arc: small stumble → joke → payoff.
- Set performativeNegativity to true when the surface wording is negative but the intent is
  positive (humble-brag, "I failed, but here's the lesson" framing).
- score is the intended affect in [-1, 1]; confidence is in [0, 1].
- Be decisive: don't drift toward neutral just because the text mixes cues.`

const schema = z.object({
	score: z.number().describe("Author's intended affect, -1 (very negative) to 1 (very positive)."),
	label: z.enum(["positive", "neutral", "negative"]),
	performativeNegativity: z
		.boolean()
		.describe("Negative surface wording but positive intent (humble-brag, self-deprecation)."),
	confidence: z.number().describe("Confidence in the score, 0 to 1."),
	rationale: z.string().describe("One or two sentences citing the cues that drove the score."),
})
