import { connectDB } from "@/DB/db";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("Received login data:", { email });

    // Find user by email
    const user = await User.findOne({ email });
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

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "1h" }
    );

    // Return the token and success message
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: user,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
