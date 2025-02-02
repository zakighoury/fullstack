import bcryptjs from "bcryptjs";
import { connectDB } from "@/DB/db";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

// Named export for the GET method
export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    await connectDB(); // Connect to the database

    // Get the token from the authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    console.log("Authorization Header:", authHeader);
    console.log("Extracted Token:", token);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "yourSecretKey"
    ) as {
      userId: string; // Adjusted to match your JWT payload structure
    };
    console.log("Decoded Token:", decoded);

    // Find the user in the database using the correct field
    const user = await User.findById(decoded.userId).select(
      "-password -confirmPassword"
    ); // Adjusted to use 'userId'
    console.log(user, "User");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user profile data
    return NextResponse.json(
      {
        user: user,
        success: true,
        message: "Successfully retrieved profile",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (req.method !== "PUT") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    await connectDB(); // Connect to the database

    // Get the token from the authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "yourSecretKey"
      ) as { userId: string };
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Find the user in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the request body to get the updated profile data
    const data = await req.json();
    console.log("Received Data:", data); // Log the data received

    // Validate and update the username
    if (data.username && typeof data.username === "string") {
      user.username = data.username;
    }

    // Validate and update the name
    if (data.name && typeof data.name === "string") {
      user.name = data.name;
    }

    // Validate and update the email
    if (data.email && typeof data.email === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
      user.email = data.email;
    }

    // Validate and update the phone number
    if (data.phonenumber && typeof data.phonenumber === "string") {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Simple international format
      if (!phoneRegex.test(data.phonenumber)) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }
      user.phonenumber = data.phonenumber;
    }

    // Validate and update the password (with hashing)
    if (data.password && typeof data.password === "string") {
      if (data.password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(data.password, salt);
      user.password = hashedPassword;
    }

    // Ensure `dateofbirth` is correctly received and validated
    if (data.dateofbirth) {
      const dob = dayjs(data.dateofbirth); // Parse the date using dayjs
      console.log("Parsed dob:", dob); // Log the parsed dayjs object
      if (!dob.isValid()) {
        return NextResponse.json(
          { error: "Invalid date of birth" },
          { status: 400 }
        );
      }
      user.dateofbirth = dob.toDate(); // Save as a Date object
    }

    // Validate gender against allowed values
    if (data.gender && !["Male", "Female", "Other"].includes(data.gender)) {
      return NextResponse.json(
        { error: `Invalid value for gender: ${data.gender}` },
        { status: 400 }
      );
    }

    // Update the user's profile with the new data
    await user.save();

    // Format date before sending response
    const formattedDOB = user.dateofbirth
      ? dayjs(user.dateofbirth).format("YYYY-MM-DD")
      : null;

    // Return the updated user profile data
    return NextResponse.json(
      {
        user: {
          username: user.username,
          name: user.name,
          email: user.email,
          phonenumber: user.phonenumber,
          dateofbirth: formattedDOB, // Use formatted date
          gender: user.gender,
          avatar: user.avatar,
        },
        success: true,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT method:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
