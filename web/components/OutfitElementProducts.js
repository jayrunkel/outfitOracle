import React, { useState } from "react";
import Products from "./Products";
import FolderIcon from "./FolderIcon";






const OutfitElementProducts = ({outfit, elementName, index}) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };

    return (
        <li className="mb-4">
            <div className="flex w-full" onClick={toggleVisibility}>
                <FolderIcon className="h-6 mr-2"/>
                {elementName}
                </div>
            <div className={`${isVisible ? 'block' : 'hidden'}`}>
              <Products products={outfit.outfit_results[index]}/>
            </div>
        </li>
    )
};

export default OutfitElementProducts;