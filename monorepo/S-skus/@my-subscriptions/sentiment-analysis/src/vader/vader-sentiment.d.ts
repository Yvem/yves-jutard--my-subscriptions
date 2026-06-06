// vader-sentiment ships CommonJS with no type defs.
declare module "S-skus/@my-subscriptions/sentiment-analysis/src/vader/vader-sentiment" {
	export const SentimentIntensityAnalyzer: {
		polarity_scores(text: string): { neg: number; neu: number; pos: number; compound: number }
	}
}
