"use client"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background-950">
          {children}
      </body>
    </html>
  );
}
