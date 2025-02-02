"use client";
import React, { useState } from "react";
import { Layout, Menu, Avatar, Badge } from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./layout.scss";
import { RootState } from "@/lib/store";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import AddProductPage from "../add/product/page";
// import UpdateProductPage from "../update/product/page"; // Import the Update Product page
import authThunks from "@/lib/toolkit/auth/authThunks";
import { useRouter } from "next/navigation";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const AdminLayout: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>("dashboard");
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleMenuClick = (e: { key: string }) => {
    setActiveMenuItem(e.key);
  };

  const handleLogout = async () => {
    const response = await dispatch(authThunks.signOut());
    if (response.meta.requestStatus === "fulfilled") {
      router.push("/pages/login");
    } else {
      alert("Logout failed. Please try again.");
    }
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case "dashboard":
        return <div>Dashboard Content</div>;
      case "add-product":
        return <AddProductPage />;
      case "update-product":
        return <div>Updated Product</div>;
      case "orders":
        return <div>Orders Content</div>;
      case "customers":
        return <div>Customers Content</div>;
      case "settings":
        return <div>Settings Content</div>;
      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }} className="admin-layout">
      <Sider collapsible breakpoint="lg" collapsedWidth="80" className="sider">
        <div className="avatar-container">
          <Avatar src={user?.avatar} size={110} />
        </div>
        <div className="user-name">{user?.name}</div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeMenuItem]}
          onClick={handleMenuClick}
          className="menu"
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <SubMenu key="products" icon={<ShopOutlined />} title="Products">
            <Menu.Item key="add-product" icon={<PlusOutlined />}>
              Add Product
            </Menu.Item>
            <Menu.Item key="update-product" icon={<EditOutlined />}>
              Update Product
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            Orders
          </Menu.Item>
          <Menu.Item key="customers" icon={<UserOutlined />}>
            Customers
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <div className="header-title">E-Commerce Dashboard</div>
          <div className="header-actions">
            <Badge count={5}>
              <BellOutlined className="icon" />
            </Badge>
            <SettingOutlined className="icon" />
          </div>
        </Header>
        <Content className="content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
