import React, { useState, useEffect } from "react";
import { Header } from "../Header";
import { useNavigate } from "react-router-dom";

export const Products = () => {
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let obj = await fetch("http://localhost:5000/");
        obj = await obj.json();
        console.log(obj.isAuthenticated);
        setproducts(products);
      } catch (err) {
        console.log(err);
        navigate("/error/server");
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header isAuthenticated={true} />
    </>
  );
};
