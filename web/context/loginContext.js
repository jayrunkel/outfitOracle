import { createContext, useContext, useState } from "react";

const Context = createContext();

export function LoginProvider({ children }) {
  const [email, setEmail] = useState("");

  const setLoggedInEmail = (emailAddr) => {
    console.log({addItemToCart: product});
    setEmail(emailAddr);
  };

  return (
    <Context.Provider value={[email, setLoggedInEmail]}>{children}</Context.Provider>
  );
}

export function useEmailContext() {
  return useContext(Context);
}