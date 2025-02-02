import React from "react";
import HeaderPage from "./ui/header/page";
import Footer from "./ui/footer/page";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <HeaderPage />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
