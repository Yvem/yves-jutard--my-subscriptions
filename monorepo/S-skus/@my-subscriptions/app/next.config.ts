import { withAui } from "@assistant-ui/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
}

export default withAui(nextConfig)
