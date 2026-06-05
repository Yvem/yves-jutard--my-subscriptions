import { expect } from "chai"

import type { HttpClientError } from "@monorepo-private/http-client"

import { createꓽclient, getꓽuser__posts, GETꓽⳇpostsⳇall, GETꓽⳇsearchⳇpeople } from "./index.ts"

/////////////////////////////////////////////////

describe(`LinkedIn API v2`, function () {
	this.timeout(30_000)

	const http_client = createꓽclient({
		headers: {
			"X-linkdapi-apikey":
				"rnd-LC4ZYmjwBC3QwpHrst1jszbp4RfLirg2w7UnVU9hp9dkI-_1hZx2HM7WaLmsUbqYIO1ouNlBxBPZRy3pt6iEpAWe2aGRUA",
		},
	})

	describe("/search/people", function () {
		it("should work", async () => {
			try {
				const result = await GETꓽⳇsearchⳇpeople(http_client, {
					// Many users with this name, useful for tests, nothing personal
					firstName: "Oliver",
					lastName: "Zhang",
					profileLanguage: "en",
					count: 50,
				})
				console.log(result)
				throw new Error("Should have thrown")
			} catch (err: HttpClientError) {
				// correct path but no Auth
				expect(err).to.have.deep.property(
					"url",
					"https://linkdapi.com/api/v1/search/people?firstName=Oliver&lastName=Zhang&profileLanguage=en&count=50",
				)
				expect(err).to.have.deep.property("status", 403)
			}
		})
	})
	describe("/posts/all", function () {
		it("should work", async () => {
			try {
				const result = await GETꓽⳇpostsⳇall(http_client, {
					urn: "ACoAAABCMjsBlsnsypQrujQIErVuOdIdbCIH5O0",
				})
				console.log(result)
				throw new Error("Should have thrown")
			} catch (err: HttpClientError) {
				// correct path but no Auth
				expect(err).to.have.deep.property(
					"url",
					"https://linkdapi.com/api/v1/search/people?urn=ACoAAABCMjsBlsnsypQrujQIErVuOdIdbCIH5O0",
				)
				expect(err).to.have.deep.property("status", 403)
			}
		})
	})

	describe("getꓽuser__posts", function () {
		it("should work", async () => {
			try {
				const result = await getꓽuser__posts(http_client, {
					firstName: "Yves",
					lastName: "Jutard",
				})
				console.log(result)
				throw new Error("Should have thrown")
			} catch (err: HttpClientError) {
				expect(err).to.have.deep.property("status", 403)
			}
		})
	})
})
