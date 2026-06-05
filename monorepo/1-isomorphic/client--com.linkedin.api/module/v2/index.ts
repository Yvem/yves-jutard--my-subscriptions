import { type HttpClient, type HttpClientOptions, createꓽHttpClient } from "@monorepo-private/http-client"
import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

export interface LinkedInV2Client extends HttpClient {}

export function createꓽclient(options?: Immutable<Partial<HttpClientOptions>>): LinkedInV2Client {
	return createꓽHttpClient("https://api.linkedin.com/v2/", options)
}

export async function GETꓽⳇuserinfo(http_client: LinkedInV2Client) {
	const response = await http_client.get("/userinfo")
	return response.data
}
