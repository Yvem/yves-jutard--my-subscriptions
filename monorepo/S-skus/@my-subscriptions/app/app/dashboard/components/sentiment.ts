import type { SentimentLabel, SentimentResponse } from "@/app/api/sentiment/route"

export type { SentimentLabel }

export type AnalyzerName = "vader sentiment" | "llm sentiment"

export type Sentiment = {
	analyzer: AnalyzerName
	label: SentimentLabel
	score: number // normalized to [-1, 1]
}

export type Analyzer = {
	name: AnalyzerName
	analyze: (text: string) => Promise<Sentiment>
}

// VADER runs locally. Code-split: the ~426 KB lexicon loads only on first use.
const vaderⵧanalyzer: Analyzer = {
	name: "vader sentiment",
	analyze: async (text) => {
		const { SentimentIntensityAnalyzer } = await import("vader-sentiment")
		const { compound } = SentimentIntensityAnalyzer.polarity_scores(text)
		return { analyzer: "vader sentiment", label: labelⵧfor(compound), score: compound }
	},
}

// LLM runs server-side behind the generic sentiment endpoint.
const llmⵧanalyzer: Analyzer = {
	name: "llm sentiment",
	analyze: async (text) => {
		const response = await fetch("/api/sentiment", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		})
		if (!response.ok) throw new Error((await response.text()) || `POST /api/sentiment → ${response.status}`)
		const { label, score } = (await response.json()) as SentimentResponse
		return { analyzer: "llm sentiment", label, score }
	},
}

// Standard VADER thresholds (Hutto & Gilbert, 2014).
const labelⵧfor = (compound: number): SentimentLabel =>
	compound >= 0.05 ? "positive" : compound <= -0.05 ? "negative" : "neutral"

// Each analyzer is independent, so callers can run them all in parallel.
export const analyzers: readonly Analyzer[] = [vaderⵧanalyzer, llmⵧanalyzer]
