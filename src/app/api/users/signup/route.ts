import { connectDB } from "@/DB/db";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, name, email, password, phonenumber } = reqBody;
    console.log(reqBody);

    // Check if user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const user = new User({
      username: username,
      name: name,
      email: email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      phonenumber: phonenumber,
    });

    await user.save();
    console.log(user);

    return NextResponse.json(
      {
        message: "User created successfully",
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
