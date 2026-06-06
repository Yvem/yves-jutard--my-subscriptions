export type SentimentLabel = "positive" | "neutral" | "negative"

export type SentimentRequest = { text: string }

interface SentimentBase {
	label: SentimentLabel
	score: number // score normalized to [-1, 1]
}

export interface SentimentExtended extends SentimentBase {
	confidence: number // [0, 1]
	performativeNegativity: boolean // negative surface wording, positive intent (humble-brag)
	rationale: string
}

export type AnalyzerName = "vader" | "llm"

export type Sentiment = ({ analyzer: "vader" } & SentimentBase) | ({ analyzer: "llm" } & SentimentExtended)

export type Analyzer = {
	name: AnalyzerName
	analyze: (text: string) => Promise<Sentiment>
}
