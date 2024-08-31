"use client";
import Link from "next/link";
import React, { useState } from "react";
import "./header.scss";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Ghoury from "./profile.png";

export default function HeaderPage() {
  const [isNavActive, setIsNavActive] = useState(false);

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
        </ul>
      </nav>
      <div className="icons">
        <UserOutlined />
        <HeartOutlined />
        <ShoppingCartOutlined />
      </div>
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
