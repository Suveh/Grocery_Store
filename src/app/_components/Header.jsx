import React from "react";
import Image from "next/image";
import { LayoutGrid, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  return (
    <div className="p-4 shadow-md bg-white flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Image 
          src="/LOGO.png" 
          alt="logo" 
          width={150} 
          height={60}
          className="w-32 h-auto"
        />
        
        {/* Categories Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden md:flex gap-2 items-center">
              <LayoutGrid className="h-5 w-5" />
              Categories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Brows Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Fruits & Vegetables</DropdownMenuItem>
            <DropdownMenuItem>Dairy & Eggs</DropdownMenuItem>
            <DropdownMenuItem>Meat & Seafood</DropdownMenuItem>
            <DropdownMenuItem>Bakery</DropdownMenuItem>
            <DropdownMenuItem>Beverages</DropdownMenuItem>
          </DropdownMenuContent>
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
        <div className="flex gap-2 items-center text-gray-700 hover:text-green-600 cursor-pointer transition-colors">
          <ShoppingBag className="h-5 w-5" />
          <span className="font-medium">0</span>
        </div>
        
        {/* Login Button */}
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Login
        </Button>
      </div>
    </div>
  );
}

export default Header;