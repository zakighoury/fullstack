"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import "./header.scss";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Ghoury from "./GHOURYPK__1_-removebg-preview.png";
import { Button } from "antd";

export default function HeaderPage() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const cookie = document.cookie;
    const isVerified = cookie.includes("isVerified=true");
    console.log("isVerified", isVerified);
    setIsVerified(isVerified);
  }, []);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  return (
    <header>
      <div className="logo">
        <img src={Ghoury.src} alt="Logo" />
      </div>
      <nav>
        <ul className={isNavActive ? "nav-active" : ""}>
          <li>
            <Link href="/home">Home</Link>
          </li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/Men">Men</Link>
          </li>
          <li>
            <Link href="/Women">Women</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>

          {/* Conditionally render profile links only if the user is logged in and verified */}
          {isVerified ? (
            <>
              <li className="block">
                <Link href="/profile">Profile</Link>
              </li>
              <li className="block">
                <Link href="/wishlist">Wishlist</Link>
              </li>
              <li className="block">
                <Link href="/cart">ShopCart</Link>
              </li>
            </>
          ) : (
            // Show the Signup button if the user is not logged in or not verified
            <li>
              <Link
                style={{ padding: "0", textDecoration: "none" }}
                href="/pages/signup"
              >
                <Button className="custom-btn" type="primary">
                  Sign Up
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Conditionally render icons only if the user is logged in and verified */}
      {isVerified && (
        <div className="icons">
          <Link href={"/pages/main"}>
            <UserOutlined />
          </Link>
          <Link href={"/pages/wishlist"}>
            <HeartOutlined />
          </Link>

          <Link href={"/pages/addcart"}>
            <ShoppingCartOutlined />
          </Link>
        </div>
      )}

      <div
        className={`hamburger ${isNavActive ? "active" : ""}`}
        onClick={toggleNav}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}
