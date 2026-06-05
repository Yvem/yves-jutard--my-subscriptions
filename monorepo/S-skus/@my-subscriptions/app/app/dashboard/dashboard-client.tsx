"use client"

import { Thread } from "@/components/assistant-ui/thread"
import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react"
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { useAuth, UserButton, useUser } from "@clerk/nextjs"
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@my-subscriptions/ui/components/breadcrumb"
import { Separator } from "@my-subscriptions/ui/components/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@my-subscriptions/ui/components/sidebar"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { useMemo } from "react"

import { DashboardSidebar } from "./sidebar"

export const DashboardClient = () => {
	const { getToken } = useAuth()
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
							<pre>{JSON.stringify(user, undefined, 2)}</pre>
							TODO Dashboard{" "}
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</AssistantRuntimeProvider>
	)
}
