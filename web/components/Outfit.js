import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/outline";

const Outfit = ({ outfit }) => {
  return (
    <Link href={{pathname: `/outfits/${outfit._id}`}}>
      <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition">
        <div className="flex items-end justify-end h-56 w-full bg-cover relative">
          <Image
            src={outfit.dalle_image || "http://assets.myntassets.com/v1/images/style/properties/7a5b82d1372a7a5c6de67ae7a314fd91_images.jpg"}
            alt={outfit.productDisplayName || "No Outfit Name"}
            layout="fill"
            objectFit="cover"
            className="absolute z-0"
          />
          <button className="absolute z-10 p-2 rounded-full bg-green-600 text-white mx-5 -mb-4 hover:bg-green-500 focus:outline-none focus:bg-green-500">
            <ShoppingCartIcon className="w-5 h-5" /> 
          </button>
        </div>
        <div className="px-5 py-3">
          <h3 className="text-gray-700 uppercase">{outfit.outfit_array.outfit_name || "No Outfit Name"}</h3>
          <div className="text-sm">
            {outfit.outfit_array.gpt_response || "No Description"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Outfit;
