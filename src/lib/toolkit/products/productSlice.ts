import { message } from "antd";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for adding a new product (POST)
export const ProductThunk = {
  addProduct: createAsyncThunk(
    "products/addProduct",
    async (productData: FormData, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/add/products",
          productData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success(response.data.message);
        return response.data;
      } catch (error: any) {
        message.error(error.response.data.message);
        return rejectWithValue(error.response.data);
      }
    }
  ),

  // Async thunk for fetching all products (GET)
  fetchProducts: createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/add/products"
        );
        return response.data;
      } catch (error: any) {
        message.error(error.response.data.message || "Error fetching products");
        return rejectWithValue(error.response.data);
      }
    }
  ),

  // Async thunk for fetching a single product by ID (GET)
  fetchProductById: createAsyncThunk(
    "products/fetchProductById",
    async (id: string | string[], { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/add/products/${id}`
        );
        return response.data;
      } catch (error: any) {
        message.error(error.response.data.message || "Error fetching product");
        return rejectWithValue(error.response.data);
      }
    }
  ),
};

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  images: string[];
  color: string;
  size: string;
  category: string;
}

interface ProductState {
  loading: boolean;
  error: string | null;
  success: boolean;
  products: Product[];
  productDetail: Product | null;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  success: false,
  products: [],
  productDetail: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle Add Product (POST)
    builder
      .addCase(ProductThunk.addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ProductThunk.addProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(ProductThunk.addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // Handle Fetch Products (GET)
    builder
      .addCase(ProductThunk.fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProductThunk.fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Set the products array
      })
      .addCase(ProductThunk.fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle Fetch Product by ID (GET)
    builder
      .addCase(ProductThunk.fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetail = null;
      })
      .addCase(ProductThunk.fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload; // Set the individual product details
      })
      .addCase(ProductThunk.fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
