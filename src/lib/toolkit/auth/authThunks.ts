import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

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
    async (_, { rejectWithValue, getState }) => {
      const state = getState() as { auth: any };
      const token = state.auth.token;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data; // Return profile data
      } catch (error: any) {
        message.error(error.response?.data?.error || "Failed to fetch profile");
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch profile"
        );
      }
    }
  ),

  // Thunk to handle user sign-out
  signOut: createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
    try {
      await axios.post("http://localhost:3000/api/users/logout");
      message.success("Signed out successfully!");
      return; // No data returned on success
    } catch (error: any) {
      message.error(error.response?.data?.error || "Sign out failed");
      return rejectWithValue(error.response?.data?.error || "Sign out failed");
    }
  }),
};

export default authThunks;
