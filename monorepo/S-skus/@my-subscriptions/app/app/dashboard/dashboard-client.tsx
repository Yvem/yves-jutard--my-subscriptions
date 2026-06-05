"use client"

import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { UserButton, useReverification, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@my-subscriptions/ui/components/avatar"
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@my-subscriptions/ui/components/breadcrumb"
import { Button } from "@my-subscriptions/ui/components/button"
import { HeatGraph } from "@my-subscriptions/ui/components/heat-graph"
import { Separator } from "@my-subscriptions/ui/components/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@my-subscriptions/ui/components/sidebar"
import { Skeleton } from "@my-subscriptions/ui/components/skeleton"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { useEffect } from "react"

import { MeFetcher } from "./me-fetcher"
import { DashboardSidebar } from "./sidebar"

type UserReturn = ReturnType<typeof useUser>
type UserResource = NonNullable<UserReturn["user"]>
type ExternalAccountResource = UserResource["externalAccounts"][number]

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
								<MeFetcher />
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
	// resource can still be stale (no github account yet). Reload once it's
	// available so the newly linked account renders without a manual refresh.
	useEffect(() => {
		void user?.reload()
	}, [user?.id])

	/*if (!user)
		return (
			<>
				<Skeleton className="aui-thread-list-skeleton h-4 w-full" />
				<span className="shimmer text-foreground/60">Loading...</span>
			</>
		)*/
	console.log({ user })

	const external_accounts = (user?.externalAccounts || []).reduce((acc, ea) => {
		acc.set(ea.provider, ea)
		return acc
	}, new Map<string, ExternalAccountResource>())
	console.log({ external_accounts })

	return (
		<div className="space-y-8">
			<HeatGraph data={[]} />
			<section className="space-y-3">
				<h2 className="text-lg font-medium">LinkedIn</h2>
				{!user && <Skeleton className="h-16 w-full" />}
				{user && !external_accounts.has("linkedin_oidc") && (
					<ConnectExternalAccountButton strategy="oauth_linkedin_oidc" label="Connect LinkedIn" />
				)}
				{external_accounts.has("linkedin_oidc") && <ExternalAccount ea={external_accounts.get("linkedin_oidc")!} />}
			</section>
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

function ExternalAccount({ ea }: { ea: ExternalAccountResource }) {
	const fullName = [ea.firstName, ea.lastName].filter(Boolean).join(" ")
	const initials =
		[ea.firstName, ea.lastName]
			.map((name) => name?.[0])
			.filter(Boolean)
			.join("")
			.toUpperCase() || "?"

	return (
		<div className="bg-card text-card-foreground flex w-full items-center gap-3 rounded-lg border p-3 shadow-xs">
			<Avatar>
				<AvatarImage src={ea.imageUrl} alt={fullName} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className="text-sm font-medium leading-none">{fullName || ea.username || ea.emailAddress}</span>
				{ea.emailAddress && <span className="text-muted-foreground text-xs">{ea.emailAddress}</span>}
			</div>
		</div>
	)
}

type OAuthStrategy = Parameters<UserResource["createExternalAccount"]>[0]["strategy"]

function ConnectExternalAccountButton({ strategy, label }: { strategy: OAuthStrategy; label: string }) {
	const { user } = useUser()

	// Adding a connected account is a sensitive operation: Clerk requires the
	// session to be freshly re-verified. useReverification catches that challenge,
	// shows the built-in reverification modal, then replays the wrapped action.
	const createExternalAccount = useReverification((params: Parameters<UserResource["createExternalAccount"]>[0]) =>
		user!.createExternalAccount(params),
	)

	const connect = async () => {
		if (!user) return

		const externalAccount = await createExternalAccount({
			strategy,
			redirectUrl: `${window.location.origin}/dashboard`, // where to land after consent
		})

		const verificationUrl = externalAccount.verification?.externalVerificationRedirectURL
		if (verificationUrl) {
			window.location.href = verificationUrl.href // off to the provider's consent screen
		}
	}

	return (
		<Button variant="outline" size="sm" onClick={connect}>
			{label}
		</Button>
	)
}

// <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">Not connected</div>
