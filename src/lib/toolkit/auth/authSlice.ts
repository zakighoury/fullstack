import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authThunks from "./authThunks"; // Adjust the import path as necessary
import dayjs, { Dayjs } from "dayjs";
interface User {
  _id: any;
  avatar: string;
  name: string;
  email: string;
  phonenumber: string;
  role: string;
  dateofbirth: string;
  gender: string;
  isVerified: boolean;
  // Add other user properties as needed
}

interface AuthPayload {
  user: User;
  token: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling signup thunk
      .addCase(authThunks.signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authThunks.signup.fulfilled,
        (state, action: PayloadAction<AuthPayload>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(
        authThunks.signup.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Signup failed";
        }
      )

      // Handling signin thunk
      .addCase(authThunks.signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authThunks.signin.fulfilled,
        (state, action: PayloadAction<AuthPayload>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(
        authThunks.signin.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Signin failed";
        }
      )

      // Handling fetchProfile thunk
      .addCase(authThunks.fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authThunks.fetchProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(
        authThunks.fetchProfile.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch profile";
        }
      )

      // Handling updateProfile thunk
      .addCase(authThunks.updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authThunks.updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(
        authThunks.updateProfile.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Update failed";
        }
      )

      // Handling signOut thunk
      .addCase(authThunks.signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authThunks.signOut.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(
        authThunks.signOut.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Sign out failed";
        }
      )

      // Handling updateAvatar thunk
      .addCase(authThunks.updateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authThunks.updateAvatar.fulfilled,
        (state, action: PayloadAction<any>) => {
          console.log("🚀 ~ action:", action);
          state.loading = false;
          if (state.user) {
            state.user.avatar = action.payload;
          }
        }
      )
      .addCase(
        authThunks.updateAvatar.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Failed to update avatar";
        }
      );
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
