import ".././styles/globals.css"
import { Inter } from "next/font/google"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import type React from "react"
import { ThemeProvider } from "../../components/theme"
import { SettingsProvider } from "@/contexts/settings-context"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Minimal Creative Agency",
  description: "Apple-inspired design portfolio",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex flex-col items-center justify-center my-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

