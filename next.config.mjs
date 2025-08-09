/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // /studio 以下は常に /studio に割り当て（深いリンク 404 回避）
    return [{ source: '/studio/:path*', destination: '/studio' }];
  },
};
export default nextConfig;
