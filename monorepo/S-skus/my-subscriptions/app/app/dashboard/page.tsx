"use client"

import { useAuth, useUser } from "@clerk/nextjs"

export const dynamic = "force-dynamic"

export default function ChatPage() {
	const { getToken } = useAuth()
	const { user } = useUser()
	getToken({ template: "my-subscriptions" })

	return <main className="h-dvh">TODO Dashboard</main>
}
