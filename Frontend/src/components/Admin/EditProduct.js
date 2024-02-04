import React from 'react'
import { Header } from "../Header"
import { UserContext } from "../../App";

export const EditProduct = () => {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(UserContext);
  return (
    <div>
      <Header userHandle={{ isAuthenticated, setIsAuthenticated }} />
      Edit page
    </div>
  );
}
