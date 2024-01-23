import "./App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ShopPage from "./components/ShopPage";

function App() {
  const [currentPageTitle, setCurrentPageTitle] = useState("Ecart");
  const [shopDetails, setShopDetails] = useState({
    pageTitle: "",
    products: [],
    isAuthenticated: false,
  });

  const [cartDetails, setCartDetails] = useState({
    pageTitle: "",
    products: [],
    isAuthenticated: false,
  });

  const findProducts = async () => {
    let obj = await fetch("http://localhost:5000/");
    obj = await obj.json();
    obj.isAuthenticated = true;
    setShopDetails(obj);
    setCurrentPageTitle(obj.pageTitle);
  };

  const findCart = async () => {
    let obj = await fetch("http://localhost:5000/cart");
    obj = await obj.json();
    obj.isAuthenticated = true;
    setCartDetails(obj);
    setCurrentPageTitle(obj.pageTitle);
  };

  useEffect(() => {
    if (currentPageTitle === "Ecart") findProducts();
  });

  return (
    <div className="App">
      <Header
        isAuthenticated={true}
        csrfToken="hello"
        findProducts={findProducts}
        findCart={findCart}
      />
      {currentPageTitle === "Shop" && <ShopPage details={shopDetails} />}
      {currentPageTitle === "Cart" && <CartPage details={cartDetails} />}
    </div>
  );
}

export default App;
