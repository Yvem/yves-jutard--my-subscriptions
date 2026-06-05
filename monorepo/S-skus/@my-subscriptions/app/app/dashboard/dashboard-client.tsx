"use client"

import { useUser } from "@clerk/nextjs"

export function DashboardClient() {
	const { user } = useUser()

	return (
		<main className="h-dvh">
			<header>user {JSON.stringify(user)}</header>
			TODO Dashboard{" "}
		</main>
	)
}
