/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'chrome-aws-lambda', // Ignora chrome-aws-lambda en el servidor
      ]
    }
    return config
  },
}

export default nextConfig
