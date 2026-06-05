import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { TooltipProvider } from "@my-subscriptions/ui/components/tooltip"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "MySubscriptions by Yves Jutard",
	description: "Review your footprint on social platforms",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<ClerkProvider dynamic signInUrl="/sign-in" signUpUrl="/sign-up" appearance={{ baseTheme: dark }}>
			<html lang="en" className="dark">
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<TooltipProvider>{children}</TooltipProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
