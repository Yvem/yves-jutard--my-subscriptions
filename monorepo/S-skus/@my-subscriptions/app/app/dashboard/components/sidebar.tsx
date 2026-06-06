import { GitHubIcon } from "@/components/icons/github"
import { UserAvatar } from "@clerk/nextjs"
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
			<SidebarContent className="aui-sidebar-content px-2">
				<ol>
					<li>Connect your social accounts</li>
					<li>review the analysis</li>
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
