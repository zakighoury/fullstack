import mongoose, { Schema, Document } from "mongoose";

// Define the interface for Product schema
interface IProduct extends Document {
  name: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  size: string[];
  color: string;
  quantity: number;
  images: string[]; // Assuming images will be stored as URLs after uploading
  category: string; // New category field
}

// Define the Product schema
const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  size: {
    type: [String],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  images: {
    type: [String], // URLs for images
    required: true,
  },
  category: {
    type: String, // Category is stored as a string
    required: true,
  },
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

// Export the Mongoose model
export default Product;
