import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import GlobalApi from "../_utils/GlobalApi";
import { Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function CartItemList({ cartItemList, onDeleteItem }) {
  const [deletingItems, setDeletingItems] = React.useState({});

  console.log("Cart data:", { cartItemList });

  const handleDeleteItem = async (cartDocumentId) => {
    setDeletingItems((prev) => ({ ...prev, [cartDocumentId]: true }));

    try {
      console.log("Deleting cart item:", cartDocumentId);
      await onDeleteItem(cartDocumentId);
      console.log("Cart item deleted successfully");
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      setDeletingItems((prev) => ({ ...prev, [cartDocumentId]: false }));
    }
  };



  return (
    <div className="flex flex-col h-full">
      {/* Scrollable items area */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {cartItemList.map((cart, index) => {
          const product = cart.product;
          const imageUrl = product?.image?.[0]?.url;
          const fullImageUrl = imageUrl
            ? process.env.NEXT_PUBLIC_BACKEND_URL + imageUrl
            : null;
          const isDeleting = deletingItems[cart.documentId];

          return (
            <div
              key={cart.id || index}
              className="flex items-center gap-4 p-4 border rounded-lg bg-white"
            >
              {fullImageUrl ? (
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={fullImageUrl}
                    fill
                    alt={product?.name || "Product image"}
                    className="object-cover rounded-md"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {product?.name || "Unknown Product"}
                </h3>
                <div className="flex gap-4 mt-1 text-sm">
                  <p className="text-gray-600">
                    Quantity: {cart.quantity || 0}
                  </p>
                  <p className="font-bold text-green-600">
                    Rs. {cart.amount || 0}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteItem(cart.documentId)}
                disabled={isDeleting}
                className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                title="Remove from cart"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        })}

        {cartItemList.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        )}
      </div>

      {/* Fixed footer - only shows when there are items */}
     
    </div>
  );
}

export default CartItemList;
