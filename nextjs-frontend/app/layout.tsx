import "./globals.css"
import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem themes={['light', 'dark', 'purple', 'cyber', 'midnight']}>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}