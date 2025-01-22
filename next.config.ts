import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
});

export default nextConfig;
