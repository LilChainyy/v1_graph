import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Event Context",
  description: "Upcoming market events with historical context and scenario analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Market Event Context
              </Link>
              <nav className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Feed
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About & Disclosures
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>Educational context only. Not investment advice.</strong>
              </p>
              <p>
                This tool provides historical context for educational purposes. 
                Past performance does not guarantee future results. 
                Always consult with a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}