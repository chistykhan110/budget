import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import LinkLibrary from "@/components/complexElements/LinkLibrary";

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
        help layout
        {children}
        <LinkLibrary/>
      </body>
    </html>
  );
}
