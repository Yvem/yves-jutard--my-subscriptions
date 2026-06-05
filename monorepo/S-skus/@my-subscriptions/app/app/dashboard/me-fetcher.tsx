"use client"

import { useEffect } from "react"

export function MeFetcher() {
	useEffect(() => {
		fetch("/api/me").catch((error) => console.error("Failed to call /api/me", error))
	}, [])

	return null
}
