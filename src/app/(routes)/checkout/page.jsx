"use client";
import { Button } from "@/components/ui/button";
import { ArrowBigRight } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();

  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    zipcode: "",
    address: "",
  });

  /** --------------------------
   * Load JWT + User from storage
   * -------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const jwtToken = sessionStorage.getItem("jwt");
    const userData = sessionStorage.getItem("user");

    if (!jwtToken) {
      router.push("/sign-in");
      return;
    }

    setJwt(jwtToken);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setForm((prev) => ({
        ...prev,
        username: parsedUser.username || "",
        email: parsedUser.email || "",
      }));
    }
  }, [router]);

  /** --------------------------
   * Fetch Cart Items
   * -------------------------- */
  const getCartItems = useCallback(async () => {
    if (!user || !jwt) return;

    try {
      const result = await GlobalApi.getCartItems(user.id, jwt);
      setCartItems(result || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [user, jwt]);

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  /** --------------------------
   * Calculate Totals
   * -------------------------- */
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);
  }, [cartItems]);

  const delivery = 200;
  const tax = subtotal * 0.09;
  const total = subtotal + delivery + tax;

  /** --------------------------
   * Handle Input Change
   * -------------------------- */
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** --------------------------
   * Handle Payment
   * -------------------------- */
  const handlePayment = () => {
    if (Object.values(form).some((v) => !v)) {
      alert("Please fill all required fields");
      return;
    }

    alert("Ready for payment gateway integration!");
  };

  return (
    <div>
      <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">
        Checkout
      </h2>

      <div className="p-5 md:px-10 grid grid-cols-1 md:grid-cols-3 py-8">
        {/* Billing Details */}
        <div className="col-span-2 mx-5 md:mx-20">
          <h2 className="font-bold text-3xl">Billing Details</h2>

          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                name="username"
                value={form.username}
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary"
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Phone + Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                name="phone"
                type="tel"
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary"
                placeholder="+94 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Zip Code</label>
              <input
                name="zipcode"
                onChange={handleInput}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary"
                placeholder="12345"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              name="address"
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary"
              placeholder="Your complete address"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="mx-5 md:mx-10 border rounded-lg mt-8 md:mt-0 h-fit">
          <h2 className="p-3 bg-gray-200 font-bold text-center rounded-t-lg">
            Total Cart ({cartItems.length})
          </h2>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between font-bold">
              SubTotal: <span>Rs. {subtotal.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between text-gray-600">
              Delivery: <span>Rs. {delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              Tax (9%): <span>Rs. {tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              Total:
              <span className="text-green-600">Rs. {total.toFixed(2)}</span>
            </div>

            <Button
              className="flex gap-2 items-center justify-center mt-4 bg-green-600 hover:bg-green-700"
              onClick={handlePayment}
            >
              Proceed to Payment <ArrowBigRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
