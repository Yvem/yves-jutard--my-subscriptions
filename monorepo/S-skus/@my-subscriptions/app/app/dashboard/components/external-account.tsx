"use client"

import { useReverification, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@my-subscriptions/ui/components/avatar"
import { Button } from "@my-subscriptions/ui/components/button"

type UserReturn = ReturnType<typeof useUser>
type UserResource = NonNullable<UserReturn["user"]>
export type ExternalAccountResource = UserResource["externalAccounts"][number]
type OAuthStrategy = Parameters<UserResource["createExternalAccount"]>[0]["strategy"]

export function ExternalAccount({ ea, url }: { ea: ExternalAccountResource; url?: string }) {
	const fullName = [ea.firstName, ea.lastName].filter(Boolean).join(" ")
	const initials =
		[ea.firstName, ea.lastName]
			.map((name) => name?.[0])
			.filter(Boolean)
			.join("")
			.toUpperCase() || "?"

	return (
		<div className="bg-card text-card-foreground flex w-full items-center gap-3 rounded-lg border p-3 shadow-xs">
			<Avatar>
				<AvatarImage src={ea.imageUrl} alt={fullName} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className="text-sm font-medium leading-none">{fullName || ea.username || ea.emailAddress}</span>
				{ea.emailAddress && <span className="text-muted-foreground text-xs">{ea.emailAddress}</span>}
				{!!url && (
					<a href={url} target="_blank" rel="noreferrer noopener">
						<span className="text-muted-foreground text-xs">{url}</span>
					</a>
				)}
			</div>
		</div>
	)
}

export function ConnectExternalAccountButton({ strategy, label }: { strategy: OAuthStrategy; label: string }) {
	const { user } = useUser()

	// Adding a connected account is a sensitive operation: Clerk requires the
	// session to be freshly re-verified. useReverification catches that challenge,
	// shows the built-in reverification modal, then replays the wrapped action.
	const createExternalAccount = useReverification((params: Parameters<UserResource["createExternalAccount"]>[0]) =>
		user!.createExternalAccount(params),
	)

	const connect = async () => {
		if (!user) return

		const externalAccount = await createExternalAccount({
			strategy,
			redirectUrl: `${window.location.origin}/dashboard`, // where to land after consent
		})

		const verificationUrl = externalAccount.verification?.externalVerificationRedirectURL
		if (verificationUrl) {
			window.location.href = verificationUrl.href // off to the provider's consent screen
		}
	}

	return (
		<Button variant="outline" size="sm" onClick={connect}>
			{label}
		</Button>
	)
}
