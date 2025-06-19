import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {hostname: 'elijah-recordion.b-cdn.net', protocol: 'https', port: '', pathname: '/**'}, // Bunny CDN
      {protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '/**'} // Google profile images
    ]
  }
};

export default nextConfig;
