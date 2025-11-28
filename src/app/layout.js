"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdateCartCotext";
import React from "react";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const params=usePathname();
  const [updateCart,setUpdateCart]=React.useState(false); 
  const showHeader=params=="/sign-in" || params=='/create-account' || params=='/forgot-password'? false : true;
  return (
    <html lang="en">
      <body className={outfit.className}>
        <UpdateCartContext.Provider value={{updateCart,setUpdateCart}}>
        {showHeader&&<Header />}
        {children}
        <Toaster/>
        </UpdateCartContext.Provider>
      </body>
    </html>
  );
}
