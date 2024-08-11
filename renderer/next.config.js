/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
        child_process: false,
      },
    };
    return config;
  },
};

if (process.env.NODE_ENV === 'production') {
  nextConfig.eslint = {
    ignoreDuringBuilds: true,
  };
}

module.exports = nextConfig;
