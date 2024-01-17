import React from "react";
import Image from "next/image";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/outline";
import { useCartContext } from "../context/cartContext";
import OutfitElementProducts from "./OutfitElementProducts";




const OutfitElementsDetails = ({ outfit }) => {

  const [cartItems, addItemToCart] = useCartContext()  
  
  return (
    <div className="w-full">
     <div className="w-full h-64 md:w-1/2 lg:h-96 relative">
        <Image
          src={outfit.link || "http://assets.myntassets.com/v1/images/style/properties/7a5b82d1372a7a5c6de67ae7a314fd91_images.jpg"}
          alt={outfit.productDisplayName || "No outfit Name"}
          layout="fill"
          objectFit="cover"
          className="absolute z-0 rounded"
        />
      </div>
    <div className="md:flex">
      
      <div className="w-full  mx-auto mt-5 md:ml-8 md:mt-0">
        <h3 className="text-gray-700 uppercase text-lg">{outfit.productDisplayName || "No Outfit Name"}</h3>
        <div className="text-gray-300 mt-3">{outfit.description || "No outfit description"}</div>
        <span className="text-gray-500 mt-3">Price Range ${outfit.price}</span>
        <hr className="my-3" />
        <div className="mt-2">
          <label className="text-green-500 text-2xl font-semibold" htmlFor="count">
            Complete The Look:
          </label>
          <div className="flex items-center mt-1 ml-4">
            <ol>
            {
              outfit.outfit_array.map((eName, index) =>
                <OutfitElementProducts outfit={outfit} elementName={eName} index={index}/>
              )
            }
            </ol>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OutfitElementsDetails;
