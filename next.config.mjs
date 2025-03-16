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

// Don't use
// <img src="/image.jpg" />

// Do use
// <img src={`${process.env.NODE_ENV === 'production' ? '/cv' : ''}/image.jpg`} />

