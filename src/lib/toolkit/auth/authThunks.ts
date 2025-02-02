import User from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";
interface User {
  _id: string;
  name: string;
  email: string;
  phonenumber?: string;
  dateofbirth?: string;
  gender?: string;
  avatar?: string;
}

// Define the authThunks object with methods for signup, signin (login), and other actions
const authThunks = {
  // Thunk for user signup
  signup: createAsyncThunk(
    "auth/signup",
    async (user: any, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/signup",
          user
        );
        message.success(response.data.message);
        return response.data; // Return signup response data
      } catch (error: any) {
        message.error(error.response?.data?.error || "Signup failed");
        return rejectWithValue(error.response?.data?.error || "Signup failed");
      }
    }
  ),

  // Thunk for user signin (login)
  signin: createAsyncThunk(
    "auth/signin",
    async (
      { email, password }: { email: string; password: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/login",
          {
            email,
            password,
          }
        );
        message.success(response.data.message);
        return response.data; // Return login response data
      } catch (error: any) {
        message.error(error.response?.data?.error || "Login failed");
        return rejectWithValue(error.response?.data?.error || "Login failed");
      }
    }
  ),

  // Thunk to fetch user profile
  fetchProfile: createAsyncThunk(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
      try {
        const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data.user; // Return profile data
      } catch (error: any) {
        message.error(error.response?.data?.error || "Failed to fetch profile");
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch profile"
        );
      }
    }
  ),

  // Thunk to handle user sign-out
  signOut: createAsyncThunk(
    "auth/signOut",
    async (_, { rejectWithValue, getState }) => {
      try {
        const getCookieValue = (name: string): string | null => {
          return (
            document.cookie
              .split("; ")
              .find((row) => row.startsWith(`${name}=`))
              ?.split("=")[1] || null
          );
        };

        // Get and decode the user data from cookies
        const encodedUserData = getCookieValue("user");
        let decodedUserData: any = null;
        if (encodedUserData) {
          try {
            decodedUserData = JSON.parse(decodeURIComponent(encodedUserData));
            console.log(decodedUserData);
          } catch (error) {
            console.error("Error parsing user cookie data:", error);
          }
        }
        const userId = decodedUserData._id;
        const response = await axios.post(
          `http://localhost:3000/api/users/${userId}/logout`,
          { userId }
        );
        message.success(response.data.message);
        return response.data; // No data returned on success
      } catch (error: any) {
        message.error(error.response?.data?.error || "Sign out failed");
        return rejectWithValue(
          error.response?.data?.error || "Sign out failed"
        );
      }
    }
  ),
  updateProfile: createAsyncThunk(
    "auth/updateProfile",
    async (updatedData: Partial<any>, { rejectWithValue }) => {
      const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
      try {
        const response = await axios.put(
          "http://localhost:3000/api/users/profile",
          updatedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Profile updated successfully");
        return response.data.user;
      } catch (error: any) {
        message.error(error.response?.data?.error || "Update failed");
        return rejectWithValue(error.response?.data?.error || "Update failed");
      }
    }
  ),
  updateAvatar: createAsyncThunk(
    "auth/updateAvatar",
    async (avatar: any, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/upload",
          avatar, // Pass formData as the body
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set the correct content type
            },
          }
        );
        console.log(avatar, "avatar");
        console.log(response.data, "response.data");
        message.success(response.data.message);
        return response.data.avatar; // Assuming response contains updated user data
      } catch (error: any) {
        message.error(error.response.data.message);
        return rejectWithValue(error.response?.data);
      }
    }
  ),
};

export default authThunks;
