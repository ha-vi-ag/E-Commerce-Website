import React, { useState } from "react";
import Link from "./link.js";
import Link1 from "./link1";

function Header({ isAuthenticated, csrfToken, findProducts, findCart }) {
  return (
    <ul className="Header">
      <li className="Header-item">
        <button className="active" onClick={findProducts}>
          Shop
        </button>
      </li>
      {isAuthenticated ? (
        <Link csrfToken={csrfToken} findCart={findCart} />
      ) : (
        <Link1 />
      )}
    </ul>
  );
}

export default Header;
