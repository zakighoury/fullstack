import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  // Check for token presence
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the token
  try {
    const secret = process.env.JWT_SECRET || "yourSecretKey";
    const decoded = jwt.verify(token, secret);

    // Optionally add user info to request headers
    // Example: req.headers.set('user-id', (decoded as any).userId);

    return NextResponse.next(); // Allow the request to proceed if the token is valid
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/app/pages*"], // Apply middleware to API routes and specific pages
};
