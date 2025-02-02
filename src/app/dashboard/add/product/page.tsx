"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  InputNumber,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { ProductThunk } from "@/lib/toolkit/products/productSlice"; // Import thunk
import "./AddProductPage.scss"; // Import SCSS file

const { TextArea } = Input;
const { Option } = Select;

const AddProductPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.products); // Redux state

  const [fileList, setFileList] = useState([]); // For uploaded images

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();

    // Append form values to FormData
    formData.append("name", values.name);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("rating", values.rating);
    formData.append("size", values.size.join(",")); // Convert array to comma-separated string
    formData.append("color", values.color.join(",")); // Convert array to comma-separated string
    formData.append("quantity", values.quantity);
    formData.append("category", values.category); // Add category to FormData

    // Append each uploaded image to FormData
    fileList.forEach((file: any) => {
      formData.append("images", file.originFileObj);
    });

    // Dispatch the Redux thunk to add the product
    dispatch(ProductThunk.addProduct(formData));
  };

  return (
    <div className="add-product-page">
      <h2 className="add-product-title">Add New Product</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: "",
          title: "",
          description: "",
          price: 0,
          rating: 0,
          size: ["M"],
          color: ["Black"], // Default value for color
          quantity: 1,
          category: "", // Default value for category
        }}
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Product Title"
          name="title"
          rules={[{ required: true, message: "Please enter the product title" }]}
        >
          <Input placeholder="Enter product title" />
        </Form.Item>

        <Form.Item
          label="Product Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item
          label="Product Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber
            min={0}
            placeholder="Enter product price"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Product Rating"
          name="rating"
          rules={[{ required: true, message: "Please enter the rating (1-5)" }]}
        >
          <InputNumber
            min={1}
            max={5}
            placeholder="Enter product rating"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Product Sizes"
          name="size"
          rules={[{ required: true, message: "Please select the product sizes" }]}
        >
          <Select mode="multiple" placeholder="Select product sizes">
            <Option value="S">Small</Option>
            <Option value="M">Medium</Option>
            <Option value="L">Large</Option>
            <Option value="XL">Extra Large</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Product Colors"
          name="color"
          rules={[{ required: true, message: "Please select the product colors" }]}
        >
          <Select mode="multiple" placeholder="Select product colors">
            <Option value="Black">Black</Option>
            <Option value="White">White</Option>
            <Option value="Red">Red</Option>
            <Option value="Blue">Blue</Option>
            <Option value="Green">Green</Option>
            <Option value="Yellow">Yellow</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Product Category" // New category field
          name="category"
          rules={[{ required: true, message: "Please select a product category" }]}
        >
          <Select placeholder="Select product category">
            <Option value="electronics">Electronics</Option>
            <Option value="clothing">Clothing</Option>
            <Option value="accessories">Accessories</Option>
            <Option value="home">Home</Option>
            {/* Add more categories as needed */}
          </Select>
        </Form.Item>

        <Form.Item
          label="Product Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter the quantity" }]}
        >
          <InputNumber
            min={1}
            placeholder="Enter product quantity"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Product Images">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductPage;
