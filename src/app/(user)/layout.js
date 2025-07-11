import { Geist, Geist_Mono } from "next/font/google";
import "server-only";
import "../globals.css";
import LinkLibrary from "@/components/complexElements/LinkLibrary";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/complexElements/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Navbar/>
          {children}
          <LinkLibrary />
        </SessionProvider>
      </body>
    </html>
  );
}
