import React, { useState, useEffect, useContext } from "react";
import { Header } from "../Header";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

export const Products = () => {
  const [products, setproducts] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let obj = await fetch("http://localhost:5000/");
        obj = await obj.json();
        console.log(obj);
        setproducts(obj.products);
      } catch (err) {
        console.log(err);
        navigate("/error/server");
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header userHandle={{isAuthenticated, setIsAuthenticated}} />
      <div className="flex-container">
        {products.map((product) => {
          return (
            <div key={product._id} className="card">
              <div className="card-info">
                <h2>{product.title}</h2>
              </div>
              <img
                src={"http://localhost:5000/" + product.imageUrl}
                alt="Placeholder"
              />
              <div className="card-info">
                <p>${product.price}</p>
                <p>{product.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
