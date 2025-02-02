"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hook"; // Redux hooks
import { ProductThunk } from "@/lib/toolkit/products/productSlice";
import Layout from "../components/layout";
import { Input, Select, Button } from "antd";
import { useRouter } from "next/navigation";
import './ShopPage.scss'; // Importing SCSS file

const { Option } = Select;

const ShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  const router = useRouter();

  // State for filtering
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>("");

  // Fetch products from Redux store
  useEffect(() => {
    dispatch(ProductThunk.fetchProducts());
  }, [dispatch]);

  // Handle filters
  const handleColorChange = (value: string) => {
    setSelectedColor(value);
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSearchTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedCategory(null);
    setSearchTitle("");
  };

  // Filter the products based on the selected criteria
  const filteredProducts = products.filter((product) => {
    const matchesColor = selectedColor
      ? product.color.includes(selectedColor)
      : true;

    const matchesSize = selectedSize
      ? product.size.includes(selectedSize)
      : true;

    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;

    const matchesTitle = searchTitle
      ? product.title.toLowerCase().includes(searchTitle.toLowerCase())
      : true;

    return matchesColor && matchesSize && matchesCategory && matchesTitle;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="shop-page">
        {/* Sidebar for filters */}
        <div className="sidebar">
          <h3>Filter Products</h3>
          <div className="filter-section">
            <h4>Filter by Title</h4>
            <Input
              placeholder="Search title"
              value={searchTitle}
              onChange={handleSearchTitle}
              style={{ marginBottom: "16px" }}
            />
          </div>

          <div className="filter-section">
            <h4>Filter by Color</h4>
            <Select
              placeholder="Select color"
              value={selectedColor}
              onChange={handleColorChange}
              style={{ width: "100%", marginBottom: "16px" }}
            >
              <Option value="Red">Red</Option>
              <Option value="Blue">Blue</Option>
              <Option value="Green">Green</Option>
              <Option value="Black">Black</Option>
            </Select>
          </div>

          <div className="filter-section">
            <h4>Filter by Size</h4>
            <Select
              placeholder="Select size"
              value={selectedSize}
              onChange={handleSizeChange}
              style={{ width: "100%", marginBottom: "16px" }}
            >
              <Option value="S">Small</Option>
              <Option value="M">Medium</Option>
              <Option value="L">Large</Option>
              <Option value="XL">Extra Large</Option>
            </Select>
          </div>

          <div className="filter-section">
            <h4>Filter by Category</h4>
            <Select
              placeholder="Select category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: "100%", marginBottom: "16px" }}
            >
              <Option value="Electronics">Electronics</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Home">Home</Option>
              <Option value="Sports">Sports</Option>
            </Select>
          </div>

          <Button type="primary" onClick={handleResetFilters} style={{ width: "100%" }}>
            Reset Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => router.push(`/product/${product._id}`)} // Navigate to product details
                style={{ cursor: "pointer" }}
              >
                <img src={product.images[0]} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.title}</p>
                <p>${product.price}</p>
              </div>
            ))
          ) : (
            <div>No products found</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;
