import React from "react";
import "./footer.scss"; // Import SCSS for styling
import { Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h1>ghoury.pk</h1>
        <p>Your trusted e-commerce partner</p>
      </div>
      <div className="footer-content">
        <div className="footer-section">
          <h2>Quick Links</h2>
          <ul className="footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Contact Us</h2>
          <ul className="footer-contact">
            <li>
              <PhoneOutlined />
              <p>(123) 456-7890</p>
            </li>
            <li>
              <EnvironmentOutlined />
              <p>123 E-commerce St, Suite 100, City, Country</p>
            </li>
            <li>
              <MailOutlined />
              <p>
                <a href="mailto:info@ghoury.pk">info@ghoury.pk</a>
              </p>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Follow Us</h2>
          <ul className="footer-social">
            <li>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookOutlined />
              </Link>
            </li>
            <li>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <TwitterOutlined />
              </Link>
            </li>
            <li>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramOutlined />
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-subscribe">
          <input type="text" placeholder="Enter your email" />
          <Button
            type="primary"
            icon={<MailOutlined />}
            href="#subscribe"
            size="large"
          >
            Subscribe
          </Button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ghoury.pk. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
