/** @type {import('next').NextConfig} */


const nextConfig = {
    
  };
  
export default nextConfig;

// Don't use
// <img src="/image.jpg" />

// Do use
// <img src={`${process.env.NODE_ENV === 'production' ? '/cv' : ''}/image.jpg`} />

