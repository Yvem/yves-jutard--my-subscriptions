"use client"

import { Skeleton } from "@my-subscriptions/ui/components/skeleton"
import type { DataPoint } from "heat-graph"
import { useState } from "react"

import { ConnectExternalAccountButton, ExternalAccount, type ExternalAccountResource } from "./external-account"

export type LinkedInPost = {
	url: string
	type: "original" | "reshare"
	content: string
	engagements: PostEngagements | null
	tms: number
}

type PostEngagements = {
	totalReactions: number
	commentsCount: number
	repostsCount: number
	reactions: { reactionType: string; reactionCount: number }[] | null
}

export type LinkedInData = {
	userⵧlinkedin?: { given_name?: string; family_name?: string; picture?: string }
	userⵧlinkdapi?: { url?: string }
	posts?: LinkedInPost[]
}

export const postsⵧtoⵧheatPoints = (posts: LinkedInPost[]): DataPoint[] =>
	posts.map((post) => ({ date: new Date(post.tms), count: 1 }))

export function LinkedInSection({
	account,
	userLoaded,
	data,
	error,
	isLoading,
}: {
	account?: ExternalAccountResource
	userLoaded: boolean
	data?: LinkedInData
	error?: unknown
	isLoading: boolean
}) {
	return (
		<section className="space-y-3">
			<h2 className="text-lg font-medium">LinkedIn</h2>
			{!userLoaded && <Skeleton className="h-16 w-full" />}
			{userLoaded && !account && (
				<ConnectExternalAccountButton strategy="oauth_linkedin_oidc" label="Connect LinkedIn" />
			)}
			{account && <ExternalAccount ea={account} url={data?.userⵧlinkdapi?.url} />}
			{account && <LinkedInPresence data={data} error={error} isLoading={isLoading} />}
		</section>
	)
}

function LinkedInPresence({ data, error, isLoading }: { data?: LinkedInData; error?: unknown; isLoading: boolean }) {
	if (isLoading) return <p className="text-muted-foreground text-sm">Loading your LinkedIn posts…</p>
	if (error || !data?.posts) return <p className="text-destructive text-sm">Error loading your LinkedIn posts.</p>

	const posts = data.posts
	return (
		<div className="space-y-3">
			<p className="text-muted-foreground text-sm">
				{posts.length} post{posts.length === 1 ? "" : "s"} found.
			</p>
			<ol className="space-y-3">
				{posts.map((post) => (
					<li key={post.url}>
						<PostCard post={post} />
					</li>
				))}
			</ol>
		</div>
	)
}

function PostCard({ post }: { post: LinkedInPost }) {
	const [expanded, setExpanded] = useState(false)

	return (
		<div className="flex items-stretch gap-3">
			<div className="bg-card text-card-foreground flex flex-1 flex-col gap-2 rounded-lg border p-3 shadow-xs">
				<div className="text-muted-foreground flex items-center gap-2 text-xs">
					<PostTypeBadge type={post.type} />
					<span>{formatDate(post.tms)}</span>
				</div>

				<p className={`text-sm whitespace-pre-line ${expanded ? "" : "line-clamp-3"}`}>{post.content}</p>
				<button
					type="button"
					onClick={() => setExpanded((value) => !value)}
					className="text-muted-foreground hover:text-foreground w-fit text-xs underline"
				>
					{expanded ? "Show less" : "Show more"}
				</button>

				<div className="text-muted-foreground flex items-center gap-3 text-xs">
					<span>{summarizeEngagements(post.engagements)}</span>
					<a
						href={post.url}
						target="_blank"
						rel="noreferrer noopener"
						className="hover:text-foreground underline"
					>
						View on LinkedIn
					</a>
				</div>
			</div>

			<PostSentiment />
		</div>
	)
}

function PostTypeBadge({ type }: { type: LinkedInPost["type"] }) {
	return (
		<span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
			{type}
		</span>
	)
}

// TODO: wire sentiment analysis. This is a placeholder panel; pass the analysis
// result in as a prop and render it here once available.
function PostSentiment() {
	return (
		<aside className="bg-muted/40 text-muted-foreground flex w-40 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-3 text-center text-xs">
			<span className="font-medium">Sentiment</span>
			<span className="opacity-70">Pending analysis</span>
		</aside>
	)
}

function summarizeEngagements(engagements: LinkedInPost["engagements"]): string {
	if (!engagements) return "No engagement"
	const { totalReactions, commentsCount, repostsCount } = engagements
	return `👍 ${totalReactions} · 💬 ${commentsCount} · 🔁 ${repostsCount}`
}

function formatDate(tms: number): string {
	return new Date(tms).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}
