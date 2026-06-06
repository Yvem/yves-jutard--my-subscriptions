import { auth } from "@clerk/nextjs/server"
import { analyzerⵧllm } from "@my-subscriptions/sentiment-analysis"
import type { SentimentRequest } from "@my-subscriptions/sentiment-analysis"

// Generic, provider-agnostic sentiment endpoint. Not tied to any feature.
export async function POST(request: Request) {
	const { userId } = await auth()
	if (!userId) return new Response("Unauthorized", { status: 401 })

	const { text } = (await request.json()) as SentimentRequest
	if (!text?.trim()) return new Response("Missing text", { status: 400 })

	try {
		return Response.json(await analyzerⵧllm.analyze(text))
	} catch (error) {
		console.error("LLM sentiment failed", error)
		return new Response(error instanceof Error ? error.message : "LLM sentiment failed", { status: 502 })
	}
}
