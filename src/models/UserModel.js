import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  name: String,
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  confirmPassword: String,
  phonenumber: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
    required: [true, "Role is required"],
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotpasswordtoken: String,
  forgotpasswordexpires: Date,
  verifytoken: String,
  verifytokenexpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
