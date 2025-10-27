/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Exclude Supabase Edge Functions from Next.js build
    config.externals = config.externals || [];
    config.externals.push({
      'supabase/functions': 'commonjs supabase/functions',
    });
    return config;
  },
};

module.exports = nextConfig;
