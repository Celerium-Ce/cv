/** @type {import('next').NextConfig} */


const nextConfig = {
    output: "export", // Required for GitHub Pages static export
    basePath: "/cv", // Replace with your GitHub repository name
    assetPrefix: "/cv/",
    images: {
      unoptimized: true, // Disables Next.js image optimization
    },
  };
  
export default nextConfig;

