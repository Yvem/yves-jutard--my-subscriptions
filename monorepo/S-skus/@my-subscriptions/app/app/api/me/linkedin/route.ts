import { auth, clerkClient } from "@clerk/nextjs/server"

import { createꓽclient as createꓽclientⵧlinkdapi, getꓽuser__posts } from "@monorepo-private/client--com.linkdapi"
import { createꓽclient as createꓽclientⵧlinkedin, GETꓽⳇuserinfo } from "@monorepo-private/client--com.linkedin.api"

export async function GET() {
	console.log("GET /api/me/linkedin ...", process.env["LINKDAPI_KEY"])

	const { userId } = await auth()
	if (!userId) return new Response("Unauthorized", { status: 401 })

	const client = await clerkClient()
	const user = await client.users.getUser(userId)
	if (!user) return Response.json({}) // not ready yet

	const tokens = await client.users.getUserOauthAccessToken(userId, "linkedin_oidc")
	const access_tokenⵧlinkedin = tokens.data[0]?.token ?? null // there is usually only 1
	if (!access_tokenⵧlinkedin) return new Response("Missing LinkedIn Connection", { status: 401 })

	const clientⵧlinkedin = createꓽclientⵧlinkedin({
		headers: {
			Authorization: `Bearer ${access_tokenⵧlinkedin}`,
		},
	})
	const userⵧlinkedin = await GETꓽⳇuserinfo(clientⵧlinkedin)
	console.log({ userⵧlinkedin })

	// LinkedIn doesn't allow getting posts, use another API
	const clientⵧlinkdapi = createꓽclientⵧlinkdapi({
		headers: {
			"X-linkdapi-apikey": process.env["LINKDAPI_KEY"],
		},
	})
	const posts = await getꓽuser__posts(clientⵧlinkdapi, {
		firstName: userⵧlinkedin.given_name,
		lastName: userⵧlinkedin.family_name,
	})

	return Response.json({ userⵧlinkedin, posts })
}
