"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import authThunks from "@/lib/toolkit/auth/authThunks";
import { Form, Input, Button, Alert } from "antd"; // Import Ant Design components
import "./signup.scss"; // Import the global SCSS file
import Ghoury from "./Ghoury E-COmmmerce.png";
interface User {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phonenumber: string;
}

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [user, setUser] = useState<User>({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(authThunks.signup(user)).unwrap();
      router.push("/pages/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="signup">
      <div>
        <div className="box">
          {/* <h1>welcome to ghoury</h1> */}
          <img width={600} height={700} src={Ghoury.src} alt="" />
        </div>
      </div>
      <div className="signup-container">
        <h1 className="signup-header">Signup</h1>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={user}
          className="signup-form"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              placeholder="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input
              placeholder="Confirm Password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phonenumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { min: 11, message: "Phone number must be at least 10 digits." },
            ]}
          >
            <Input
              placeholder="Phone Number"
              name="phonenumber"
              value={user.phonenumber}
              onChange={handleChange}
              className="input-field"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button ant-btn-primary"
              loading={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </Button>
          </Form.Item>
        </Form>
        {error && (
          <Alert message={error} type="error" className="error-message" />
        )}
        <p className="signup-footer">
          Already have an account?{" "}
          <Link href="/pages/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
