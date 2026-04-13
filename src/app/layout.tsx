import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "@/providers/ApolloWrapper";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "VA LMS",
  description: "V-Align Technologies — Enterprise Learning Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full antialiased">
        <ApolloWrapper>
          <AuthProvider>{children}</AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
