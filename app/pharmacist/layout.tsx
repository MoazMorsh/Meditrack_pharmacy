import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/pharmacist/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pharmacist Dashboard | Meditrack",
  description: "Pharmacist dashboard for Meditrack pharmacy",
}

export default function PharmacistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </ThemeProvider>
    </div>
  )
}
