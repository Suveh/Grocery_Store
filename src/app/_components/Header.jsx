"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  CircleUserRound,
  LayoutGrid,
  Search,
  LogOut,
  User,
  CreditCard,
  Users,
  ShoppingBasket,
} from "lucide-react";
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
import { UpdateCartContext } from "../_context/UpdateCartContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItemList from "./CartItemList";
import { toast } from "sonner";

function Header() {
  const [categoryList, setCategoryList] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();
  const [totalCartItems, setTotalCartItems] = useState(0);
  const { updateCart, setUpdateCart } = React.useContext(UpdateCartContext);
  const [cartItemList, setCartItemList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [avatar, setAvatar] = useState("");

  const checkLoginStatus = () => {
    const jwtToken = sessionStorage.getItem("jwt");
    const userData = sessionStorage.getItem("user");
    setJwt(jwtToken);
    setUser(userData ? JSON.parse(userData) : null);
    setIsLogin(!!jwtToken);
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

    const handleProfileUpdate = () => {
      console.log("Profile updated, refreshing user data...");
      checkLoginStatus();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("login", handleLoginEvent);
    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      // Cleanup event listeners
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("login", handleLoginEvent);
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    if (user && jwt) {
      getCartItems();
    }
  }, [updateCart, user, jwt]);

  const getCategoryList = () => {
    GlobalApi.getCategory().then((resp) => {
      console.log("category list response", resp.data.data);
      setCategoryList(resp.data.data);
    });
  };

  const getCartItems = async () => {
    const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
    console.log(cartItemList_);
    setTotalCartItems(cartItemList_?.length);
    setCartItemList(cartItemList_);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    const avatarUrl = sessionStorage.getItem("avatar");

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setAvatar(avatarUrl || parsedUser.avatar?.url); // Use avatar from sessionStorage or user data
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("user");
    setJwt(null);
    setUser(null);
    setIsLogin(false);
    router.push("/sign-in");
  };

  const onDeleteItem = async (documentId) => {
    try {
      console.log("🔍 DELETE DEBUG - Starting delete for ID:", documentId);
      console.log("🔍 DELETE DEBUG - JWT available:", !!jwt);
      console.log("🔍 DELETE DEBUG - User ID:", user?.id);

      const resp = await GlobalApi.deleteCartItem(documentId, jwt);
      console.log("✅ DELETE DEBUG - API Success:", resp);

      // Update local state
      setCartItemList((prev) =>
        prev.filter((item) => item.documentId !== documentId)
      );
      setTotalCartItems((prev) => Math.max(prev - 1, 0));

      toast("Item removed!");
    } catch (error) {
      console.error("❌ DELETE DEBUG - API Failed:");
      console.error(" - Status:", error.response?.status);
      console.error(" - Status Text:", error.response?.statusText);
      console.error(" - Error Data:", error.response?.data);
      console.error(" - Full Error:", error);
      toast.error("Failed to remove item from server");
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;

    try {
      // 1) search products whose name contains q
      const products = await GlobalApi.searchProductsByName(q);

      if (!products || products.length === 0) {
        // if nothing found, you can toast or just stay
        console.log("No products found for", q);
        return;
      }

      // 2) get its first category
      const firstProduct = products[0];
      const firstCategory = firstProduct.categories?.[0];

      if (!firstCategory?.name) {
        console.log("Product has no category, cannot route to category page");
        return;
      }

      // 3) go to category page with q as query param
      router.push(
        `/products-category/${encodeURIComponent(
          firstCategory.name
        )}?q=${encodeURIComponent(q)}`
      );
      setSearchTerm("");
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const [subtotal, setSubTotal] = useState(0);
  useEffect(() => {
    let total = 0;
    cartItemList.forEach((element) => {
      total = total + element.amount;
    });
    setSubTotal(total.toFixed(2));
  }, [cartItemList]);

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
            className="w-32 h-auto cursor-pointer"
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
        <form className="relative" onSubmit={handleSearchSubmit}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex gap-4 items-center ">
        {/* Cart */}
        <Sheet>
          <SheetTrigger>
            <div className="flex gap-2 items-center text-gray-700 hover:text-primary cursor-pointer transition-colors">
              <ShoppingBasket className="h-5 w-5" />
              <span className="font-medium bg-primary text-white px-2 rounded-full">
                {totalCartItems}
              </span>
            </div>
          </SheetTrigger>
          <SheetContent className="flex flex-col h-full">
            <SheetHeader className="shrink-0">
              <SheetTitle className="bg-primary text-white font-bold text-lg p-2 mt-5">
                My Cart
              </SheetTitle>
            </SheetHeader>

            {/* Scrollable cart items area */}
            <div className="flex-1 min-h-0">
              <CartItemList
                cartItemList={cartItemList}
                onDeleteItem={onDeleteItem}
              />
            </div>

            {/* Fixed checkout section at bottom */}
            {cartItemList.length > 0 && (
              <div className="border-t pt-4 shrink-0">
                <h2 className="text-lg font-bold flex justify-between mb-4 ml-4 mr-4">
                  Subtotal<span>Rs. {subtotal}</span>
                </h2>
                <SheetClose asChild>
                  <Button
                    className="w-90 bg-primary hover:bg-primary/90 ml-3 mb-4"
                    onClick={() => router.push(jwt ? "/checkout" : "/sign-in")}
                  >
                    Checkout
                  </Button>
                </SheetClose>
              </div>
            )}
          </SheetContent>
        </Sheet>
        {/* Login Button / User Icon */}

        {!isClient ? (
          // Show loading state during SSR
          <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
        ) : !isLogin ? (
          <Link href="/sign-in">
            <Button className="bg-primary hover:bg-green-700 text-white">
              Login
            </Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="p-2 rounded-full cursor-pointer transition-colors hover:bg-gray-100">
                {(() => {
                  // Get avatar from localStorage ONLY (frontend-only avatars)
                  const localAvatar = user?.id
                    ? localStorage.getItem(`avatar_${user.id}`)
                    : null;

                  // Validate it's a proper base64 data URL
                  const isValidBase64 =
                    localAvatar &&
                    localAvatar.startsWith("data:image/") &&
                    localAvatar.includes(";base64,");

                  if (isValidBase64) {
                    return (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={localAvatar}
                          alt={user?.username || "User"}
                          width={32}
                          height={32}
                          className="object-cover"
                          onError={(e) => {
                            console.error("Avatar failed to load");
                            e.target.style.display = "none";
                            // Show fallback
                            const parent = e.target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              fallback.className =
                                "h-full w-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold";
                              fallback.textContent =
                                user?.username?.charAt(0).toUpperCase() || "U";
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                    );
                  }

                  // No avatar, show user initial
                  const userInitial =
                    user?.username?.charAt(0).toUpperCase() || "U";
                  return (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border border-gray-200">
                      {userInitial}
                    </div>
                  );
                })()}
              </div>
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
              <Link href="/my-order">
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
