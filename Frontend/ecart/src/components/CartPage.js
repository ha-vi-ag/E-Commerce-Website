import React from "react";

function CartPage({ details }) {
  const { pageTitle, products, isAuthenticated } = details;
  document.title = pageTitle;
  if (products.length <= 0) {
    return <h1>No Product in cart</h1>;
  } else {
    return (
      <div className="content">
        {products.map((product) => {
          return (
            <div key={product._id} className="card">
              <img
                src={"http://localhost:5000/" + product.imageUrl}
                alt="Denim Jeans"
                style={{ width: "100%" }}
              />
              <h1>{product.title}</h1>
              <p className="price">${product.price} </p>
              <p>{product.description}</p>

              {isAuthenticated && (
                <p className="link">
                  <a href={"/addtocart/" + product.id}>Add to Cart</a>
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default CartPage;
