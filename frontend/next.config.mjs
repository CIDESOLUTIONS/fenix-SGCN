/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita el modo standalone para crear una copia optimizada de la app para Docker
  output: 'standalone',
  reactStrictMode: true,
};

export default nextConfig;
