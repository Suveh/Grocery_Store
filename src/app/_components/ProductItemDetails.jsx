"use client";

import React from "react";
import Image from "next/image";
import { LoaderCircle, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GlobalApi from "../_utils/GlobalApi";
import { toast } from "sonner";
import { UpdateCartContext } from "../_context/UpdateCartContext";

function ProductItemDetails({ product }) {
  const {updateCart,setUpdateCart}=React.useContext(UpdateCartContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const jwt = sessionStorage.getItem("jwt");
  const [productTotalPrice, setProductTotalPrice] = React.useState(
    product.sellingPrice ? product.sellingPrice : product.mrp
  );
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const addToCart = () => {
    setLoading(true);
    if (!jwt) {
      router.push("/sign-in");
      setLoading(false);
      return;
    }
    const cartData = {
  product: product.id,
  quantity,
  amount: (quantity * productTotalPrice).toFixed(2),
  userid: user.id
};

    console.log("Adding to cart", cartData);

    GlobalApi.addToCart(cartData, jwt).then(
      (resp) => {
        console.log("Product added to cart", resp);
        toast("Product added to cart successfully");
        setUpdateCart(!updateCart);
        setLoading(false);
      },
      (e) => {
        console.error("❌ Error adding to cart:", e);
        toast("Error adding product to cart");
        setLoading(false);
      }
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-7 bg-white rounded-lg gap-4 sm:gap-6">
      <Image
        src={process.env.NEXT_PUBLIC_BACKEND_URL + product?.image?.[0].url}
        alt={product.name}
        width={300}
        height={300}
        className="bg-white p-5 h-80 w-[300px] object-contain rounded-lg"
      />
      <div className="p-4">
        <h2 className="font-bold text-2xl mb-4">{product.name}</h2>
        <p className="mb-4">{product.description}</p>
        <div className="font-bold text-xl flex gap-3 mb-4">
          {product.sellingPrice && (
            <h2 className="text-green-600">${product.sellingPrice}</h2>
          )}
          <h2
            className={`${
              product.sellingPrice && "line-through text-gray-500"
            }`}
          >
            ${product.mrp}
          </h2>
        </div>
        <h2 className="font-medium text-lg">
          Quantity ({product.itemQuantityType})
        </h2>
        <div className="flex flex-col items-baseline gap-3 mb-6">
          <div className="flex gap-3 items-center ">
            <div className="mt-5 p-2 border flex gap-10 items-center px-5 ">
              <button
                disabled={quantity == 1}
                onClick={() => setQuantity(quantity - 1)}
              >
                -
              </button>
              <h2>{quantity}</h2>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <h2 className="text-2xl font-bold mt-4">
              {" "}
              = ${(quantity * productTotalPrice).toFixed(2)}
            </h2>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="font-medium text-lg">
            <span className="font-bold">Category: </span>
            {product?.categories?.[0].name}
          </h2>
        </div>
        <Button
          className="flex gap-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          onClick={addToCart}
          disabled={loading}
        >
          <ShoppingBasket />
         {loading?<LoaderCircle className="animate-spin"/>:'Add to Cart'} 
        </Button>
      </div>
    </div>
  );
}

export default ProductItemDetails;
