import "./App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Products } from "./components/User/Products";
import { AddProduct } from "./components/Admin/AddProduct";
import { EditProduct } from "./components/Admin/EditProduct";
import { Cart } from "./components/User/Cart";
import { Orders } from "./components/User/Orders";
import { ClientError } from "./components/Error/ClientError";
import { ServerError } from "./components/Error/ServerError";
import { SignUp } from "./components/auth/Signup";
import { Login } from "./components/auth/Login";

export const UserContext = React.createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div className="App">
      <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/admin/edit-product" element={<EditProduct />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/user/orders" element={<Orders />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/error/server" element={<ServerError />} />
          <Route path="*" element={<ClientError />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;