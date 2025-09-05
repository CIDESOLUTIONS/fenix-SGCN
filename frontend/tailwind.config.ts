import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // azul corporativo
        secondary: "#F59E0B", // amarillo
        accent: "#10B981", // verde
      },
    },
  },
  plugins: [],
};

export default config;
