import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the User document (extends Mongoose's Document interface)
interface IUser extends Document {
  avatar: string;
  username: string;
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phonenumber?: string;
  dateofbirth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  role: 'user' | 'admin';
  isVerified: boolean;
  isAdmin: boolean;
  forgotPasswordToken?: string;
  forgotPasswordExpires?: Date;
  verifyToken?: string;
  verifyTokenExpires?: Date;
}

// Define the user schema
const userSchema: Schema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default:
        'https://i.pinimg.com/originals/2f/11/6e/2f116e65db22c18a3e97de60b2b24f59.jpg',
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (this: IUser, value: string): boolean {
          return value === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    phonenumber: {
      type: String,
      trim: true,
    },
    dateofbirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
      required: [true, 'Role is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordExpires: Date,
    verifyToken: String,
    verifyTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Define the User model with IUser interface
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
