/** @type {import('next').NextConfig} */
const nextConfig = {};

const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export', // Ensures static export for GitHub Pages
  assetPrefix: isProd ? '/celerium-ce/' : '',
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
};


