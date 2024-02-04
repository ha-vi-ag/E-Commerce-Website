import React from 'react';
import { UserContext } from "../../App";

export const ServerError = () => {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(UserContext);
  return (
    <div>ServerError</div>
  )
}
