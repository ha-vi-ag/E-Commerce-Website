import React from 'react'
import { Header } from "../Header"
import { UserContext } from "../../App";

export const Cart = () => {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(UserContext);
  return (
    <div>
      <Header userHandle={{ isAuthenticated, setIsAuthenticated }} />
      Cart
    </div>
  );
}
