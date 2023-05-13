import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["valentine", "halloween"],
  },
  plugins: [require("daisyui")],
} satisfies Config;
