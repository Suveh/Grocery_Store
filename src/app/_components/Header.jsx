"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CircleUserRound, LayoutGrid, Search, ShoppingBag, LogOut, User, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalApi from "../_utils/GlobalApi";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const [categoryList, setCategoryList] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  const checkLoginStatus = () => {
    const jwt = sessionStorage.getItem("jwt");
    setIsLogin(!!jwt);
  };

  // Set client-side flag and check login status
  useEffect(() => {
    setIsClient(true);
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    const handleLoginEvent = () => {
      checkLoginStatus();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login', handleLoginEvent);
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleLoginEvent);
    };
  }, []);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    GlobalApi.getCategory().then((resp) => {
      console.log("category list response", resp.data.data);
      setCategoryList(resp.data.data);
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("user");
    setIsLogin(false);
    router.push("/sign-in");
  };

  // Don't render dropdown content until client-side to avoid hydration issues
  const renderDropdownContent = () => {
    if (!isClient) {
      return (
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2 text-sm text-gray-500">Loading...</div>
        </DropdownMenuContent>
      );
    }

    return (
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categoryList.map((category, index) => {
          const imageUrl =
            category.icon?.[0]?.formats?.small?.url || category.icon?.[0]?.url;

          return (
            <Link
              href={"/products-category/" + category.name}
              key={category.id || index}
            >
              <DropdownMenuItem className="flex items-center gap-4 cursor-pointer">
                {imageUrl ? (
                  <Image
                    src={`http://localhost:1337${imageUrl}`}
                    alt={category.name || `Category ${index}`}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <LayoutGrid className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <h2 className="text-sm">{category.name}</h2>
              </DropdownMenuItem>
            </Link>
          );
        })}
      </DropdownMenuContent>
    );
  };

  return (
    <div className="p-4 shadow-md bg-white flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/LOGO.png"
            alt="logo"
            width={150}
            height={60}
            className="w-32 h-auto"
            priority
          />
        </Link>

        {/* Categories Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="hidden md:flex gap-2 items-center"
            >
              <LayoutGrid className="h-5 w-5" />
              Categories
            </Button>
          </DropdownMenuTrigger>
          {renderDropdownContent()}
        </DropdownMenu>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex gap-4 items-center">
        {/* Cart */}
        <div className="flex gap-2 items-center text-gray-700 hover:text-primary cursor-pointer transition-colors">
          <ShoppingBag className="h-5 w-5" />
          <span className="font-medium">0</span>
        </div>

        {/* Login Button / User Icon */}
        {!isClient ? (
          // Show loading state during SSR
          <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
        ) : !isLogin ? (
          <Link href="/sign-in">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Login
            </Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 h-auto rounded-full hover:bg-green-100">
                <CircleUserRound className="h-10 w-10 text-primary cursor-pointer" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/orders">
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
              </Link>
              <Link href="/addresses">
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Addresses
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default Header;