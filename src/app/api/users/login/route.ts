import { connectDB } from "@/DB/db";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { json } from "stream/consumers";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("Received login data:", { email });

    // Find user by email
    const user = await User.findOne({ email }).select("-confirmPassword");
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Update the user to set isVerified to true
    user.isVerified = true;
    await user.save();
    console.log(user.isVerified, "isverified");
    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "1d" }
    );

    // Return the token and success message
    const response = NextResponse.json(
      {
        message: "Login successful",
        token,
        user: user,
        success: true,
      },
      { status: 200 }
    );
    response.cookies.set("token", token);
    response.cookies.set("user", JSON.stringify(user));
    response.cookies.set("isVerified", user.isVerified.toString());
    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
