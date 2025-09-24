/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
          },
        ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '15mb',
      },
    },
};

export default nextConfig;
