import { NextResponse } from "next/server";
import Product from "@/models/ProductModel";
import { connectDB } from "@/DB/db";
interface Params {
  id: string;
}
// The handler function for getting a product by its ID
export async function GET(request: any, { params }: { params: Params }) {
  await connectDB(); // Connect to the database

  const { id } = params; // Get the product ID from the URL

  try {
    const product = await Product.findById(id); // Query product by ID

    // If product not found, return 404
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Return product data
    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching product by ID" },
      { status: 500 }
    );
  }
}
