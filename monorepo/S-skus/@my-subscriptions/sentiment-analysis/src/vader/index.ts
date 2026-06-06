// Ambient types for the untyped vader-sentiment module. Must be a triple-slash reference
// (not an import) so the import("vader-sentiment") below stays a string literal turbopack
// can code-split, and so source consumers of this package pick the types up.
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="./vader-sentiment.d.ts" />

import type { Analyzer, SentimentLabel } from "../types"

export const analyzerⵧvader: Analyzer = {
	name: "vader",
	analyze: async (text) => {
		const { SentimentIntensityAnalyzer } = await import("vader-sentiment") // optim: the ~426 KB lexicon loads only on actual use.
		const { compound } = SentimentIntensityAnalyzer.polarity_scores(text)
		return { analyzer: "vader", label: get_label(compound), score: compound }
	},
}

// Standard VADER thresholds (Hutto & Gilbert, 2014).
function get_label(compound: number): SentimentLabel {
	return compound >= 0.05 ? "positive" : compound <= -0.05 ? "negative" : "neutral"
}
