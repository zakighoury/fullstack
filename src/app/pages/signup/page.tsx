"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import authThunks from "@/lib/toolkit/auth/authThunks";
import { Form, Input, Button } from "antd";
import "./signup.scss";
import Layout from "@/app/components/layout";

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
  const { loading } = useAppSelector((state) => state.auth);
  const isVerified = useAppSelector((state) => state.auth.user);

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

  useEffect(() => {
    // If user is already verified, redirect to main page
    const cookie = document.cookie;
    const isVerified = cookie.includes("isVerified=true");
    console.log("LOGIN", isVerified);
    if (isVerified) {
      router.push("/pages/main");
    }
  }, [router]);

  const handleSubmit = async () => {
    try {
      const result = await dispatch(authThunks.signup(user)).unwrap();
      if (authThunks.signup.fulfilled.match(result)) {
        router.push("/pages/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="signup">
        <div className="signup-container">
          <h1 className="signup-header">Signup</h1>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={user}
            className="signup-form"
            requiredMark={false}
          >
            <div className="form-item">
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input
                  placeholder="Enter Your Full Name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Item>
            </div>
            <div className="form-item">
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  placeholder="Enter Your Username"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Item>
            </div>
            <div className="form-item">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  placeholder="Enter Your Email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Item>
            </div>
            <div className="form-item">
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input
                  placeholder="Enter Your Password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Item>
            </div>
            <div className="form-item">
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
                  placeholder="Enter Your Confirm Password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Item>
            </div>
            <div className="form-item">
              <Form.Item
                label="Phone Number"
                name="phonenumber"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                  {
                    min: 11,
                    message: "Phone number must be at least 10 digits.",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Your Phone Number"
                  name="phonenumber"
                  value={user.phonenumber}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Item>
            </div>
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
          <p className="signup-footer">
            Already have an account?{" "}
            <Link href="/pages/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
