import React from "react";
import Outfit from "./Outfit";

const Outfits = ({ outfits }) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
      {outfits.map((outfit) => (
        <Outfit key={outfit._id} outfit={outfit} />
      ))}
    </div>
  );
};

export default Outfits;