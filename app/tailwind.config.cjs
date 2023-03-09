/** @type {import("tailwindcss").Config} */
module.exports = {
   presets: [
      {
         content: ["./src/**/*.{ts,tsx}", "./src/_app.tsx"],
         theme: {
            extend: {
               colors: {
                  "dark-bg": "#181a1b",
                  "dark-containers": "#242526",
               },
            },
         },
      },
   ],
   content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
};
