import { expect } from "chai"

import type { HttpClientError } from "@monorepo-private/http-client"

import { createꓽclient, GETꓽⳇuserinfo } from "./index.ts"

/////////////////////////////////////////////////

describe(`LinkedIn API v2`, function () {
	describe("/userinfo", function () {
		const http_client = createꓽclient({
			headers: {
				Authorization: "Bearer XYZ",
			},
		})

		it("should work", async () => {
			try {
				const result = await GETꓽⳇuserinfo(http_client)
				console.log(result)
				throw new Error("Should have thrown")
			} catch (err: HttpClientError) {
				// correct path but no Auth
				expect(err).to.have.deep.property("url", "https://api.linkedin.com/v2/userinfo")
				expect(err).to.have.deep.property("status", 401)
			}
		})
	})
})
