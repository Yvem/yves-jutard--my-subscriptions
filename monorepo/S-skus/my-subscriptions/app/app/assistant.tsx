"use client"

import { Thread } from "@/components/assistant-ui/thread"
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar"
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react"
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { useAuth, UserButton, useUser } from "@clerk/nextjs"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { useMemo } from "react"

export const Assistant = () => {
	const { getToken } = useAuth()
	const { user } = useUser()

	const cloud = useMemo(
		() =>
			new AssistantCloud({
				baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!,
				authToken: async () => {
					const token = await getToken({ template: "my-subscriptions" })

					if (!token) throw new Error("Missing Clerk JWT")

					return token
				},
			}),
		[getToken],
	)

	const runtime = useChatRuntime({
		cloud,
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		transport: new AssistantChatTransport({
			api: "/api/chat",
		}),
	})

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<SidebarProvider>
				<div className="flex h-dvh w-full pr-0.5">
					<ThreadListSidebar />
					<SidebarInset>
						<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
							<SidebarTrigger />
							<Separator orientation="vertical" className="border-border mr-2 h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink
											href="https://www.assistant-ui.com/docs/getting-started"
											target="_blank"
											rel="noopener noreferrer"
										>
											Build Your Own ChatGPT UX
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										<BreadcrumbPage>Starter Template</BreadcrumbPage>
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
							<Thread />
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</AssistantRuntimeProvider>
	)
}
