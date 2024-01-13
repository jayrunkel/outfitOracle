import { createContext, useContext, useState } from "react";

const Context = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (product) => {
    console.log({addItemToCart: product});
    setCartItems([...cartItems, product]);
  };

  return (
    <Context.Provider value={[cartItems, addItemToCart]}>{children}</Context.Provider>
  );
}

export function useCartContext() {
  return useContext(Context);
}