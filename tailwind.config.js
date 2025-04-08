/** @type {import('tailwindcss').Config} */
<body className="bg-red-500 text-white p-10">Hello World {children}</body>
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
