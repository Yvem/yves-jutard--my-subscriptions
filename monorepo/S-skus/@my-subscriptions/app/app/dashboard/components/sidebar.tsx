import { GitHubIcon } from "@/components/icons/github"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@my-subscriptions/ui/components/sidebar"
import { CalendarSync } from "lucide-react"
import type * as React from "react"

const howItWorksSteps = [
	{
		title: "Connect your accounts",
		description: "Link LinkedIn or GitHub in one click. We only read what's public.",
	},
	{
		title: "See your activity",
		description: "Your activity is charted on a heat graph so you can glance your history.",
	},
	{
		title: "Review the analysis",
		description: "Each post is scored for sentiment, surfacing the overall tone of your digital footprint.",
	},
	{
		title: "Ask the assistant",
		description: "Chat with the built-in assistant to further reflect on your activity. (TO BE IMPLEMENTED)",
	},
] as const

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader className="aui-sidebar-header mb-2 border-b">
				<div className="aui-sidebar-header-content flex items-center justify-between">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<a href="/">
									<div className="aui-sidebar-header-icon-wrapper bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
										<CalendarSync className="aui-sidebar-header-icon size-4" />
									</div>
									<div className="aui-sidebar-header-heading me-6 flex flex-col gap-0.5 leading-none">
										<span className="aui-sidebar-header-title font-semibold">my-subscriptions</span>
									</div>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</div>
			</SidebarHeader>
			<SidebarContent className="aui-sidebar-content px-4 py-2">
				<p className="text-muted-foreground mb-4 text-sm leading-relaxed">
					MySubscriptions analyze your public footprint across the social accounts you connect (read-only).
				</p>
				<ol className="space-y-4">
					{howItWorksSteps.map(({ title, description }, index) => (
						<li key={title} className="flex gap-3">
							<span className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
								{index + 1}
							</span>
							<div className="flex flex-col gap-0.5">
								<span className="text-sm font-medium">{title}</span>
								<span className="text-muted-foreground text-xs leading-relaxed">{description}</span>
							</div>
						</li>
					))}
				</ol>
			</SidebarContent>
			<SidebarRail />
			<SidebarFooter className="aui-sidebar-footer border-t">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a
								href="https://github.com/Yvem/yves-jutard--my-subscriptions"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="aui-sidebar-footer-icon-wrapper bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<GitHubIcon className="aui-sidebar-footer-icon size-4" />
								</div>
								<div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none">
									<span className="aui-sidebar-footer-title font-semibold">GitHub</span>
									<span>View Source</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
