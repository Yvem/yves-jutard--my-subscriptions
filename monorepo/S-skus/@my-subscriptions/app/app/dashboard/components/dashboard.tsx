"use client"

import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { UserButton, useUser } from "@clerk/nextjs"
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@my-subscriptions/ui/components/breadcrumb"
import { HeatGraph } from "@my-subscriptions/ui/components/heat-graph"
import { Separator } from "@my-subscriptions/ui/components/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@my-subscriptions/ui/components/sidebar"
import { Skeleton } from "@my-subscriptions/ui/components/skeleton"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { useEffect } from "react"
import useSWR from "swr"

import { ConnectExternalAccountButton, ExternalAccount, type ExternalAccountResource } from "./external-account"
import { LinkedInSection, postsⵧtoⵧheatPoints, type LinkedInData } from "./linkedin"
import { DashboardSidebar } from "./sidebar"

export const DashboardClient = () => {
	const { user } = useUser()

	const runtime = useChatRuntime({
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		transport: new AssistantChatTransport({
			api: "/api/chat",
		}),
	})

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<SidebarProvider>
				<div className="flex h-dvh w-full pr-0.5">
					<DashboardSidebar />

					<SidebarInset>
						<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
							<SidebarTrigger />
							<Separator orientation="vertical" className="border-border mr-2 h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink href="/">My Subscriptions</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										<BreadcrumbPage>Dashboard</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>

							<div className="ml-auto">
								<div className="flex items-center gap-3">
									<span className="text-muted-foreground text-sm">
										{`Welcome${user?.firstName ? `, ${user.firstName}` : ""}`}
									</span>
									<UserButton />
								</div>
							</div>
						</header>

						<div className="flex-1 overflow-y-auto">
							{/*<Thread />*/}
							<div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-10">
								<div className="mb-8 space-y-1">
									<h1 className="text-3xl font-semibold tracking-tight">Your digital presence</h1>
									<p className="text-muted-foreground text-sm">
										Connect your accounts to map your presence across the web.
									</p>
								</div>
								<Results />
								{false && (
									<small>
										<pre>{JSON.stringify(user, undefined, 2)}</pre>
									</small>
								)}
							</div>
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</AssistantRuntimeProvider>
	)
}

function Results() {
	const { user } = useUser()

	// Returning from the GitHub OAuth round-trip lands here, but the cached user
	// resource can still be stale (no GitHub account yet). Reload once it's
	//  available, so the newly linked account renders without a manual refresh.
	useEffect(() => {
		void user?.reload()
	}, [user?.id])

	const external_accounts = (user?.externalAccounts || []).reduce((acc, ea) => {
		acc.set(ea.provider, ea)
		return acc
	}, new Map<string, ExternalAccountResource>())

	const linkedinAccount = external_accounts.get("linkedin_oidc")

	// A null key keeps SWR idle until LinkedIn is actually connected, so we never
	// fire the request the route would only reject. SWR then dedupes concurrent
	// callers / StrictMode double-mounts and caches across re-renders & navigation.
	const linkedin = useSWR(linkedinAccount ? "/api/me/linkedin" : null, fetchꓽjson<LinkedInData>)
	const heatPoints = linkedin.data?.posts ? postsⵧtoⵧheatPoints(linkedin.data.posts) : []

	return (
		<div className="space-y-8">
			<HeatGraph data={heatPoints} />
			<LinkedInSection
				account={linkedinAccount}
				userLoaded={Boolean(user)}
				data={linkedin.data}
				error={linkedin.error}
				isLoading={linkedin.isLoading}
			/>
			<section className="space-y-3">
				<h2 className="text-lg font-medium">GitHub</h2>
				{!user && <Skeleton className="h-16 w-full" />}
				{user && !external_accounts.has("github") && (
					<ConnectExternalAccountButton strategy="oauth_github" label="Connect GitHub" />
				)}
				{external_accounts.has("github") && <ExternalAccount ea={external_accounts.get("github")!} />}
			</section>
		</div>
	)
}

async function fetchꓽjson<T>(url: string): Promise<T> {
	const response = await fetch(url)
	if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
	return response.json() as Promise<T>
}
