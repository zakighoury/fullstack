"use client";
import React, { useEffect, useState } from "react";
import "./login.scss"; // Import regular SCSS
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import authThunks from "@/lib/toolkit/auth/authThunks";
import Layout from "@/app/components/layout";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
const { Title } = Typography;
import Cookies from "js-cookie";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isVerified = useAppSelector((state) => state.auth.user);
  console.log(isVerified, "login");
  const loading = useAppSelector((state) => state.auth.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (values: any) => {
    const result = await dispatch(authThunks.signin({ email, password }));
    if (authThunks.signin.fulfilled.match(result)) {
      // Get the role from the server response or from the local storage if needed
      const role = result.payload.user.role; // Assuming your response payload includes the role
      console.log(role, "role");
      if (role === "admin") {
        router.push("/dashboard/layout");
      } else if (role === "user") {
        router.push("/pages/main");
      }
    } else {
      // Handle error
      console.error("Login failed:", result.error);
    }
  };
  useEffect(() => {
    // If user is already verified, redirect to main page
    const isverified = Cookies.get("isVerified");
    console.log(isverified, "login1");
    if (isverified) {
      router.push("/pages/main");
    }
  }, [isVerified, router]);

  return (
    <Layout>
      <div className="loginContainer">
        <div className="loginBox">
          <Title level={2} className="loginHeader">
            Login
          </Title>
          <Form onFinish={handleSubmit} layout="vertical" requiredMark={false}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                placeholder="Enter Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="inputField"
                prefix={<MailOutlined />}
                autoComplete="email"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="inputField"
                autoComplete="current-password"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <div className="checkboxContainer">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="/pages/forgot-password" className="forgotPassword">
                Forgot password
              </a>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submitButton ant-btn-primary"
                loading={loading}
                block
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
