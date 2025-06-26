import "server-only";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";

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
          <Toaster position="top-center" richColors />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
