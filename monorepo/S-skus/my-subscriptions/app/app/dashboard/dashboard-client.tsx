"use client"

import { useUser } from "@clerk/nextjs"

export function DashboardClient() {
	const { user } = useUser()

	return <main className="h-dvh">TODO Dashboard {JSON.stringify(user)}</main>
}
