import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Sidebar } from "@/components/layout/Sidebar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { DatabaseProvider } from "@/components/providers/DatabaseProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PalmVue Demo",
  description: "Frontend demo for entity and workflow management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <DatabaseProvider>
              <Sidebar />
              <main className="min-h-screen pl-64">
                <div className="mx-auto max-w-7xl p-8">{children}</div>
              </main>
              <Toaster />
            </DatabaseProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
