/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f7f7f7",
          100: "#ededed",
          200: "#d9d9d9",
          300: "#c4c4c4",
          400: "#9d9d9d",
          500: "#7b7b7b",
          600: "#555555",
          700: "#434343",
          800: "#262626",
          900: "#171717",
          950: "#0d0d0d",
        },
        notion: {
          default: "#ffffff",
          gray: {
            light: "#f7f6f3",
            medium: "#ebeced",
            dark: "#e4e5e7",
            text: "#37352f",
          },
          accent: {
            light: "#f7f6f3",
            medium: "#ebeced",
            dark: "#37352f"
          },
          hover: "#f7f6f3",
          text: {
            default: "#37352f",
            gray: "#6b7280",
            light: "#9ca3af",
          },
          border: "#ebeced"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
