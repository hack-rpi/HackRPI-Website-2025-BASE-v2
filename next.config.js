/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Warning: While this allows builds to succeed with warnings, it's better to fix the issues
		ignoreDuringBuilds: true,
		dirs: ["app", "components", "utils", "types", "data"],
	},
	typescript: {
		// Dangerously allow production builds to successfully complete even if your project has type errors
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
