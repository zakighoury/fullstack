"use client";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/hook"; // Adjust the import path as necessary
import authThunks from "@/lib/toolkit/auth/authThunks";
import "./login.scss"; // Import regular SCSS

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const resultAction = await dispatch(
        authThunks.signin({ email, password })
      );

      if (authThunks.signin.fulfilled.match(resultAction)) {
        const { token } = resultAction.payload;
        localStorage.setItem("token", token);
        // window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <Form onFinish={handleSubmit} layout="vertical">
          <Title level={2} className="loginHeader">
            Login
          </Title>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputField"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputField"
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
              className="submitButton"
              loading={loading}
              block
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
