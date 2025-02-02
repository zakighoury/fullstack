import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/ProductModel";
import { uploadImage } from "@/lib/upload-image";
import { connectDB } from "@/DB/db"; // Utility to handle MongoDB connection

interface UploadResponse {
  secure_url: string;
}

export const POST = async (req: NextRequest) => {
  await connectDB(); // Ensure the database connection is established

  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const price = formData.get("price")?.toString();
    const rating = formData.get("rating")?.toString();
    const size = formData.get("size")?.toString();
    const color = formData.get("color")?.toString();
    const quantity = formData.get("quantity")?.toString();
    const category = formData.get("category")?.toString(); // Retrieve category from formData
    const images = formData.getAll("images") as File[]; // Handle multiple images

    // Ensure required fields are present
    if (
      !name ||
      !title ||
      !price ||
      !size ||
      !quantity ||
      !category || // Ensure category is provided
      images.length === 0
    ) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Upload each image and collect the secure URLs
    const imageUrls: string[] = [];
    for (const image of images) {
      const uploadResponse = (await uploadImage(
        image,
        "Ghoury"
      )) as UploadResponse;
      imageUrls.push(uploadResponse.secure_url);
    }

    // Create a new product object
    const newProduct = new Product({
      name,
      title,
      description,
      price: Number(price),
      rating: Number(rating),
      size: size.split(","), // Convert size from string to array
      color,
      quantity: Number(quantity),
      images: imageUrls, // Store array of image URLs
      category, // Include the category in the product object
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    return NextResponse.json({
      message: "Product added successfully!",
      product: savedProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error adding product", error: error.message },
      { status: 500 }
    );
  }
};

// Optional: Get all products
export const GET = async () => {
  try {
    await connectDB(); // Ensure DB connection
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};
