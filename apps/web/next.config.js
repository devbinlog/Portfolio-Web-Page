/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // native 바이너리가 있는 패키지는 번들링하지 않고 node_modules에서 그대로 사용
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
}

module.exports = nextConfig
