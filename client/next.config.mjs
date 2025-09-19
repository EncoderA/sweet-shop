/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "sweet-shop-incubyte.vercel.app"
      },
      {
        protocol: "http", 
        hostname: "localhost",
        port: "3001",
      },
    ],
  },
};

export default nextConfig;
