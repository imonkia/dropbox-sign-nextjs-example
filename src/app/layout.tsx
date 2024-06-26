import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Dropbox Sign Next.js Example",
  description: "Basic working example app using Dropbox Sign Node SDK and hellosign-embedded front-end library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar/>
          {children}
        <Footer />
      </body>
    </html>
  );
}
