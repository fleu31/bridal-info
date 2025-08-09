/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // /studio/intent/edit/... など、/studio 以下はぜんぶ /studio を返す
    return [{ source: '/studio/:path*', destination: '/studio' }]
  },
};
module.exports = nextConfig;
