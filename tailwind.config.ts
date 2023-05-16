import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["cupcake", "halloween"],
  },
  plugins: [require("daisyui")],
} satisfies Config;
