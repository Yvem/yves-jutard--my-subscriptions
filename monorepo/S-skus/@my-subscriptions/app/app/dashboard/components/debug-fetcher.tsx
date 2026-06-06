"use client"

import { useEffect } from "react"

export function Debug() {
	useEffect(() => {
		fetch("/api/me/linkedin").catch((error) => console.error("Failed to call /api/me", error))
	}, [])

	return null
}
