import React from "react";
import { Header } from "../Header";
import { UserContext } from "../../App";

export const ClientError = () => {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(UserContext);
  return (
    <>
      <Header userHandle={{ isAuthenticated, setIsAuthenticated }} />
      Page Not Found
    </>
  );
};
