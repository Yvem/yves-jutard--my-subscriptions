"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { CalendarSync } from "lucide-react"
import Link from "next/link"

export default function Home() {
	const { isSignedIn } = useAuth()

	return (
		<main className="flex min-h-dvh flex-col">
			<header className="flex items-center justify-between border-b px-4 py-3">
				<div className="flex items-center gap-2">
					<div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
						<CalendarSync className="size-4" />
					</div>
					<span className="font-semibold">My Subscriptions</span>
				</div>

				<div className="flex items-center gap-2">
					{isSignedIn ? (
						<UserButton />
					) : (
						<>
							<SignInButton>
								<Button variant="ghost" size="sm" aria-label="Sign in">
									Sign in
								</Button>
							</SignInButton>
							<SignUpButton>
								<Button variant="outline" size="sm" aria-label="Sign up">
									Sign up
								</Button>
							</SignUpButton>
						</>
					)}
				</div>
			</header>

			<section className="flex flex-1 items-center justify-center px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
					<h1 className="text-3xl font-semibold tracking-tight">My Subscriptions (Yves Jutard)</h1>

					<p className="text-muted-foreground max-w-prose">Review your footprint on social platforms</p>

					<div className="mt-2">
						<Button asChild>
							<Link href="/dashboard" aria-label="Go to dashboard">
								Go to Dashboard
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	)
}
