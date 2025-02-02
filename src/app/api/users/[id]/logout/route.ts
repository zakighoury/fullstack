import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel"; // Ensure the correct path to your User model
import { connectDB } from "@/DB/db"; // Ensure the correct path to your DB connection

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectDB();

    // Extract user ID from URL params
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Ensure id is a valid ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Find the user by id and set isVerified to false
    const user = await User.findByIdAndUpdate(
      id,
      { isVerified: false },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove cookies by setting them to expire in the past
    const response = NextResponse.json({ message: "Logout Successful", user });
    response.cookies.delete("token");
    response.cookies.delete("user");
    response.cookies.delete("isVerified");

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to unverify user" },
      { status: 500 }
    );
  }
}
