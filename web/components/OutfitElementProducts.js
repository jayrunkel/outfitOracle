import React, { useState } from "react";
import Products from "./Products";





const OutfitElementProducts = ({outfit, elementName, index}) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };

    return (
        <li className="mb-4">
            <div onClick={toggleVisibility}>{elementName}</div>
            <div className={`${isVisible ? 'block' : 'hidden'}`}>
              <Products products={outfit.outfit_results[index]}/>
            </div>
        </li>
    )
};

export default OutfitElementProducts;