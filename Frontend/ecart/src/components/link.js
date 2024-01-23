import React from "react";

function Link({ csrfToken, findCart }) {
  // console.log(csrfToken);
  return (
    <>
      <li className="Header-item">
        <a href="http://localhost:5000/admin/edit-product">Edit Products</a>
      </li>
      <li className="Header-item">
        <button onClick={findCart}>Carts</button>
      </li>
      <li className="Header-item">
        <a href="http://localhost:5000/orders">Orders</a>
      </li>
      <li className="Header-item">
        <a href="http://localhost:5000/admin/add-product">Add Products</a>
      </li>
      <form action="http://localhost:5000/logout" method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="logout" type="submit">
          Logout
        </button>
      </form>
    </>
  );
}

export default Link;
