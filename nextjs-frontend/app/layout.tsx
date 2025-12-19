import { cookies } from "next/headers";
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const get = async () => {
    const cookieStore = await cookies()
    console.log(cookieStore)
  }

  get()

  return (
    <html lang="en">
      <body className="bg-indigo-950">
          {children}
      </body>
    </html>
  );
}
