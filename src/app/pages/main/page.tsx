"use client";
import React, { useState } from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { RootState } from "@/lib/store";
import Layout1 from "@/app/components/layout";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import authThunks from "@/lib/toolkit/auth/authThunks";
import Profile from "../profile/page";
import { useRouter } from "next/navigation";
import "./MainPage.scss"; // Import the SCSS file
import withAuth from "@/components/withAuth";

const { Sider, Content } = Layout;
const { Text } = Typography;

const MainPage = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [collapsed, setCollapsed] = useState(false); // State to handle collapse
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state: RootState) => state.auth);
  if (!user) {
    router.push("/pages/login");
  }
  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "wishlist",
      icon: <HeartOutlined />,
      label: "Wishlist",
    },
    {
      key: "orders",
      icon: <ShoppingOutlined />,
      label: "Orders",
    },
    {
      key: "signout",
      icon: <UserOutlined />,
      label: "Sign Out",
    },
  ];

  const handleMenuClick = async (e: { key: string }) => {
    if (e.key === "signout") {
      const result = await dispatch(authThunks.signOut()).unwrap();
      if (result.meta.requestStatus === "fulfilled") {
        router.push("/pages/login");
      }
    } else {
      setSelectedMenuItem(e.key);
    }
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "profile":
        return <Profile />;
      case "wishlist":
        return <div>Wishlist</div>;
      case "orders":
        return <div>Orders</div>;
      default:
        return <Profile />;
    }
  };

  return (
    <Layout1>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          collapsedWidth={80} // Set the width when collapsed
          width={300} // Set the normal width of the Sider
          className="sider"
        >
          <div className="avatar-section">
            <Avatar
              size={collapsed ? 65 : 130}
              icon={<UserOutlined />}
              src={user?.avatar || "https://via.placeholder.com/130"}
            />
            {!collapsed && (
              <>
                <br />
                <Text className="user-name">{user?.name || "Guest"}</Text>
              </>
            )}
          </div>
          <Menu
            mode="inline"
            theme="light"
            defaultSelectedKeys={["profile"]}
            selectedKeys={[selectedMenuItem]}
            onClick={handleMenuClick}
            className="menu"
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Content className="content">{renderContent()}</Content>
        </Layout>
      </Layout>
    </Layout1>
  );
};

export default withAuth(MainPage);
