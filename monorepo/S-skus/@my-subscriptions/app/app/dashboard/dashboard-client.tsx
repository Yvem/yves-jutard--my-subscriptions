"use client"

import { Thread } from "@/components/assistant-ui/thread"
import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react"
import { ErrorPrimitive, MessagePrimitive } from "@assistant-ui/react"
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

import { MeFetcher } from "./me-fetcher"
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

						<div className="flex-1 overflow-hidden">
							{/*<Thread />*/}
							<MeFetcher />
							<h1>Your digital presence</h1>
							<section>
								<Results />
							</section>
							{false && (
								<small>
									<pre>{JSON.stringify(user, undefined, 2)}</pre>
								</small>
							)}
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</AssistantRuntimeProvider>
	)
}

function Results() {
	const { user } = useUser()
	if (!user)
		return (
			<>
				<Skeleton className="aui-thread-list-skeleton h-4 w-full" />
				<span className="shimmer text-foreground/60">Loading...</span>
			</>
		)

	const providers = user?.externalAccounts.reduce((acc, { provider }) => {
		acc.add(provider)
		return acc
	}, new Set<string>())
	//console.log(providers)

	return (
		<>
			<HeatGraph data={[]} />
			<section>
				<h2>LinkedIn</h2>
				<div>{!user && <Skeleton className="aui-thread-list-skeleton h-4 w-full" />}</div>
				{user && !providers.has("linkedin_oidc") && (
					<div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">Not connected</div>
				)}
				{providers.has("linkedin_oidc") && <Skeleton className="aui-thread-list-skeleton h-4 w-full" />}
			</section>
			<section>
				<h2>GitHub</h2>
				<div>
					{!user && <Skeleton className="aui-thread-list-skeleton h-4 w-full" />}
					{user && !providers.has("github_oidc") && (
						<div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">Not connected</div>
					)}
					{providers.has("github_oidc") && <Skeleton className="aui-thread-list-skeleton h-4 w-full" />}
				</div>
			</section>
		</>
	)
}
