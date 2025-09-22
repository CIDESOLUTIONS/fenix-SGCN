/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Necesario para Docker
  images: {
    unoptimized: true, // Para evitar problemas con imágenes en Docker
  },
};

export default nextConfig;
