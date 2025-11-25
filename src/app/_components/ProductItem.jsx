import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProductItemDetails from "./ProductItemDetails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ProductItem({ product }) {
  return (
    <div className="p-2 md:p-6 flex flex-col items-center justify-center gap-3 border rounded-lg hover:scale-110 transition-all ease-in-out hover:shadow-lg cursor-pointer">
      <Image
        src={process.env.NEXT_PUBLIC_BACKEND_URL + product?.image?.[0].url}
        alt={product.name}
        width={500}
        height={300}
        className="relative h-48 w-48 md:h-56 md:w-56 bg-gray-50 rounded-xl overflow-hidden"
      />
      <h2 className="font-bold text-lg">{product.name}</h2>
      <div className="font-bold text-lg flex gap-3">
        {product.sellingPrice && <h2>${product.sellingPrice}</h2>}
        <h2
          className={`font-bold text-lg ${
            product.sellingPrice && "line-through text-gray-500"
          }`}
        >
          ${product.mrp}
        </h2>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Add to Cart
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            
              <ProductItemDetails product={product}/>
            
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductItem;
