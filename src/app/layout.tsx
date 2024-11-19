import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionWrapper } from "@/lib/SessionWrapper";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <div className="flex flex-1">
            <Navbar />
            <main className="flex-1 bg-black text-white pl-0.5 sm:pt-2 pt-1 sm:pb-2 pb-1 sm:pr-2.5 pr-1.5">
              {children}
            </main>
          </div>
          <Toaster />
        </body>
      </html>
    </SessionWrapper>
  );
}
