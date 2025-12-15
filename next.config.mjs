/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize BAML native modules to prevent webpack from trying to bundle them
      config.externals = config.externals || []
      config.externals.push('@boundaryml/baml')
      config.externals.push('@boundaryml/baml-darwin-arm64')
    }
    return config
  },
}

export default nextConfig
