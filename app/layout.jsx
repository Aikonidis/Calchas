import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-zinc-900 text-white min-h-screen">{children}</body>
    </html>
  );
}
