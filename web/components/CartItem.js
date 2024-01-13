import React from "react";
import Image from "next/image";
import {
    XIcon,
    PlusCircleIcon,
    ArrowNarrowRightIcon,
  } from "@heroicons/react/outline";

const CartItem = ({productId, product}) => {
    return (
        <div className="flex justify-between mt-6">
            <div className="flex">
            <Image
                src={product.link}
                height={80}
                width={80}
                objectFit="cover"
                className="rounded"
                alt={product.productDisplayName}
            />
            <div className="mx-3">
                <h3 className="text-sm text-gray-600">{product.productDisplayName}</h3>
                <div className="flex items-center mt-2">
                    <button className="text-gray-500 focus:outline-none focus:text-gray-600">
                        <PlusCircleIcon className="h-5 w-5" />
                    </button>
                    <span className="text-gray-700 mx-2">1</span>
                    <button className="text-gray-500 focus:outline-none focus:text-gray-600">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            </div>
            <span className="text-gray-600">{product.price}</span>
        </div>
    )
}

export default CartItem;