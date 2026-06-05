import { assert } from "@monorepo-private/assert"
import { type HttpClient, type HttpClientOptions, createꓽHttpClient } from "@monorepo-private/http-client"
import type { Immutable, PositiveInteger } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

export interface LinkdApiV1Client extends HttpClient {}

const BASE_URL = "https://linkdapi.com/api/v1/"
export function createꓽclient(options?: Immutable<Partial<HttpClientOptions>>): LinkdApiV1Client {
	return createꓽHttpClient(BASE_URL, options)
}

const MAX_COUNT = 50

export async function GETꓽⳇsearchⳇpeople(
	http_client: LinkdApiV1Client,
	params: {
		firstName?: string | undefined
		lastName?: string | undefined
		profileLanguage?: string | undefined
		count?: PositiveInteger | undefined
	},
): Promise<
	Array<{
		urn: string
		profileID: string
		url: string
		firstName: string
		lastName: string
		fullName: string
		headline: string
		location: string
		profilePictureURL: string | undefined
		premium: boolean
	}>
> {
	const url = Object.entries(params).reduce((url, [k, v]) => {
		url.searchParams.append(k, v)
		return url
	}, new URL("search/people", BASE_URL))

	const response = await http_client.get(url.toString())

	// the search is fuzzy. clamp it to exact matches if possible
	let people = [...(response.data?.data?.people || [])].sort((pA, pB) => {
		// no profile picture is an obvious sign the account is not active
		const profilePictureScoreA = pA.profilePictureURL ? 1 : 0
		const profilePictureScoreB = pB.profilePictureURL ? 1 : 0
		if (profilePictureScoreA !== profilePictureScoreB) return profilePictureScoreB - profilePictureScoreA

		// exact matches have priority
		const matchFirstNameScoreA = params.firstName ? (pA.firstName === params.firstName ? 1 : -1) : 0
		const matchFirstNameScoreB = params.firstName ? (pB.firstName === params.firstName ? 1 : -1) : 0

		const matchLastNameScoreA = params.lastName ? (pA.lastName === params.lastName ? 1 : -1) : 0
		const matchLastNameScoreB = params.lastName ? (pB.lastName === params.lastName ? 1 : -1) : 0

		const nameMatchScoreA = matchFirstNameScoreA + matchLastNameScoreA
		const nameMatchScoreB = matchFirstNameScoreB + matchLastNameScoreB
		if (nameMatchScoreA !== nameMatchScoreB) return nameMatchScoreB - nameMatchScoreA

		// then premium = more active
		const premiumScoreA = pA.premium ? 1 : 0
		const premiumScoreB = pB.premium ? 1 : 0
		if (premiumScoreA !== premiumScoreB) return premiumScoreB - premiumScoreA

		// then by stable profile id ordering
		return pA.profileID.localeCompare(pB.profileID)
	})
	if (params.firstName) {
		const backup = people
		people = people.filter((p) => p.firstName === params.firstName)
		if (people.length === 0) people = backup
	}
	if (params.lastName) {
		const backup = people
		people = people.filter((p) => p.lastName === params.lastName)
		if (people.length === 0) people = backup
	}

	return people
}

interface Post {
	url: string
	type: "original" | "reshare"
	content: string
	engagements: {}
	tms: number
}
export async function GETꓽⳇpostsⳇall(
	http_client: LinkdApiV1Client,
	params: {
		urn: string
	},
): Promise<Array<Post>> {
	const url = new URL("posts/all", BASE_URL)
	url.searchParams.append("urn", params.urn)

	const response = await http_client.get(url.toString())
	const postsⵧraw = response.data?.data?.posts || []

	// trim
	const posts = postsⵧraw.map((postⵧraw): Post => {
		const { url, text, engagements, resharedPostContent, postedAt } = postⵧraw
		const type: Post["type"] = resharedPostContent ? "reshare" : "original"
		const content = [text, resharedPostContent?.text]
			.map((s = "") => {
				s = s.normalize("NFKC") // NON TRIVIAL this normalization convert mathematical bold and italic back to ascii = important for analysis
				if ((s as any).toWellFormed) s = (s as any).toWellFormed() // https://devdocs.io/javascript/global_objects/string/towellformed
				return s?.trim()
			})
			.filter((s) => !!s)
			.join("\n")

		return {
			url,
			type,
			content,
			engagements,
			tms: postedAt.timestamp,
		}
	})

	return posts
}

export async function getꓽuser__posts(
	http_client: LinkdApiV1Client,
	{
		firstName,
		lastName,
		profileLanguage = "en",
	}: {
		firstName?: string
		lastName?: string
		profileLanguage?: string
	},
): Promise<Array<Post>> {
	const candidates = await GETꓽⳇsearchⳇpeople(http_client, {
		firstName,
		lastName,
		profileLanguage,
		count: MAX_COUNT,
	})

	const best_match = candidates[0]

	if (!best_match) return []

	const posts = await GETꓽⳇpostsⳇall(http_client, {
		urn: best_match.urn,
	})

	return posts
}
