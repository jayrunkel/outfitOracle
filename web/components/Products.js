import React from "react";
import Product from "./Product";
import PropTypes from 'prop-types';



  

const Products = ({ products }) => {

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
      {products.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
};


Products.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object)
}


export default Products;
