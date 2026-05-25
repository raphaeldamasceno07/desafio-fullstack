import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    qualities: [25, 50, 75, 100],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-7c9c98106b604993beebff575dcad778.r2.dev', // 🌟 Permissão para o seu bucket exato do R2
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev', // Fallback curinga para aceitar qualquer bucket R2 da sua conta
      },
    ],
  },
}

export default nextConfig
