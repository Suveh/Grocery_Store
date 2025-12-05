"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

function MyOrder() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const jwtToken = sessionStorage.getItem("jwt");
    const userData = sessionStorage.getItem("user");

    setJwt(jwtToken);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!jwt) {
      //router.replace("/");
      return;
    }

    if (user && jwt) {
      getMyOrder();
    }
  }, [user, jwt]); // ✅ Fixed: Added dependencies

  const getMyOrder = async () => {
    setLoading(true);
    try {
      const orderList_ = await GlobalApi.getMyOrder(user.id, jwt);
      console.log("Orders:", orderList_);
      setOrderList(orderList_ || []);
    } catch (error) {
      console.error("Order Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">
          My Orders
        </h2>
        <div className="py-8 mx-7 md:mx-20">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">
        My Orders
      </h2>
      <div className="py-8 mx-7 md:mx-20">
        <h2 className="text-3xl font-bold text-primary mb-6">Order History</h2>
        <div className="space-y-4">
          {orderList.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No orders found.
            </p>
          ) : (
            orderList.map((item, index) => (
              <Collapsible key={item.id} className="border rounded-lg"> {/* ✅ Added key */}
                <CollapsibleTrigger className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center">
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Order #{item.id}</h3>
                    <p className="text-sm text-gray-600">
                      Total: Rs. {item.totalOrderAmount?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment ID: {item.paymentId || "N/A"}
                    </p>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Order Items:</h4>
                    {item.orderItemList?.length > 0 ? (
                      item.orderItemList.map((orderItem, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 border rounded">
                          {orderItem.product?.image?.[0]?.url && (
                            <img 
                              src={`http://localhost:1337${orderItem.product.image[0].url}`}
                              alt={orderItem.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{orderItem.product?.name || "Unknown Product"}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {orderItem.quantity} × Rs. {orderItem.price?.toFixed(2)}
                            </p>
                            <p className="text-sm font-semibold">
                              Subtotal: Rs. {(orderItem.quantity * orderItem.price)?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No items in this order</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrder;