"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const params=usePathname();
  const showHeader=params=="/sign-in" || params=='/create-account' || params=='/forgot-password'? false : true;
  return (
    <html lang="en">
      <body className={outfit.className}>
        {showHeader&&<Header />}
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
