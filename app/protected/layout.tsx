import "./globals.css"
import { Inter } from "next/font/google"
 
import Header from "./components/Header"
import Footer from "./components/Footer"
import type React from "react"
import { ThemeProvider } from "./components/theme"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DOT SOL LTDA",
  description: "",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
            <main className="flex flex-col items-center justify-center my-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

