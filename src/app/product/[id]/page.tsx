"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import { ProductThunk } from "@/lib/toolkit/products/productSlice";
import { Spin, Button, Select, InputNumber, Rate } from "antd";
import "../page.scss";
import HomeLayout from "../../components/layout";
const { Option } = Select;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>(""); // State for the main image
  const [quantity, setQuantity] = useState(1); // State for product quantity
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (id && !product) {
      const existingProduct = products.find((p) => p._id === id);
      if (existingProduct) {
        setProduct(existingProduct);
        setMainImage(existingProduct.images?.[0]); // Set the main image initially
      } else {
        dispatch(ProductThunk.fetchProductById(id))
          .then((data) => {
            const fetchedProduct = data.payload.product;
            setProduct(fetchedProduct);
            setMainImage(fetchedProduct.images?.[0]); // Set the main image initially
          })
          .catch((error) => console.error("Error fetching product:", error));
      }
    }
  }, [id, dispatch, product]);

  if (loading) return <Spin size="large" />;

  if (!product) return <div>Product not found</div>;

  // Check if product.colors is a string or array
  const colorOptions = typeof product.colors === "string"
    ? product.colors.split(" ") // Split string into array
    : product.colors || []; // Use array if available

  return (
    <HomeLayout>
      <div className="product-detail">
        <div className="product-detail__container">
          {/* Left: Product Thumbnails (4 smaller images in column) */}
          <div className="product-detail__thumbnails">
            {product.images?.slice(0, 4).map((image: string, index: number) => (
              <div
                key={index}
                className="product-detail__thumbnail"
                onClick={() => setMainImage(image)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`product-detail__thumbnail-img ${
                    image === mainImage ? "active" : ""
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Right: Larger Image in a row (main image updates when clicking thumbnails) */}
          <div className="product-detail__main-image">
            <img
              src={mainImage}
              alt="Main Product"
              className="product-detail__img"
            />
          </div>

          {/* Right: Product Info */}
          <div className="product-detail__info">
            <h1>{product?.title}</h1>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Rating:</strong> <Rate disabled value={product.rating} />
            </p>

            {/* Quantity selector */}
            <div>
              <strong>Quantity: </strong>
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value: any) => setQuantity(value)}
              />
            </div>

            {/* Color and Size Options */}
            <div className="product-detail__options">
              <div>
                <strong>Color:</strong>{" "}
                <Select defaultValue={product.color} style={{ width: 120 }}>
                  {colorOptions.map((color: string) => (
                    <Option key={color} value={color}>
                      {color}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <strong>Size:</strong>{" "}
                <Select defaultValue={product.size[0]} style={{ width: 120 }}>
                  {product.size?.map((size: string) => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <Button type="primary" block style={{ marginTop: "20px" }}>
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Bottom: Product Description */}
        <div className="product-detail__description">
          <h3>Description:</h3>
          <p>{product.description}</p>
        </div>

        {/* Bottom: Customer Reviews */}
        <div className="product-detail__reviews">
          <h3>Customer Reviews</h3>
          <div className="product-detail__reviews-list">
            {product.reviews?.map((review: any, index: number) => (
              <div key={index} className="product-detail__review">
                <Rate disabled value={review.rating} />
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default ProductDetail;
