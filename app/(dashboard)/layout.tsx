import '../../styles/globals.css'
import { Inter } from "next/font/google"

import type React from "react"
import { SettingsProvider } from "@/contexts/settings-context"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { ThemeProvider } from "../components/theme"
import Header from "../components/Header"
import Footer from "../components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Minimal Creative Agency",
    description: "Apple-inspired design portfolio",
}

export default function LayoutDashboard({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <SettingsProvider>
                        <TooltipProvider delayDuration={0}>
                            <div className="min-h-screen flex">
                                <Sidebar />
                                <div className="flex-1">
                                    <TopNav />
                                    <div className="container mx-auto p-6 max-w-7xl">
                                        <main className="w-full">{children}</main>
                                    </div>
                                </div>
                            </div>
                        </TooltipProvider>
                    </SettingsProvider>
                </ThemeProvider>
            </body>
        </html>



    )
}

