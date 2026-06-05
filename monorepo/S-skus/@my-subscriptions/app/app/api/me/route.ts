import { auth, clerkClient } from "@clerk/nextjs/server"

export async function GET() {
	const { userId } = await auth()
	if (!userId) return new Response("Unauthorized", { status: 401 })

	const client = await clerkClient()
	const user = await client.users.getUser(userId)

	// 1) Which SSO providers are connected (and actually verified/active)?
	const connectedProviders = user.externalAccounts
		.filter((a) => a.verification?.status === "verified")
		.map((a) => a.provider) // e.g. 'oauth_github', 'oauth_linkedin_oidc'

	// 2) Grab the access token for each
	const tokensByProvider = Object.fromEntries(
		await Promise.all(
			connectedProviders.map(async (provider) => {
				const res = await client.users.getUserOauthAccessToken(userId, provider)
				return [provider, res.data[0]?.token ?? null] as const
			}),
		),
	)

	console.log("access tokens:", tokensByProvider)

	return Response.json({ connectedProviders })
}
