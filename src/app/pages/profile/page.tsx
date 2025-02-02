"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "@/lib/store";
import authThunks from "@/lib/toolkit/auth/authThunks";
import { UploadOutlined } from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Image,
  message,
  Upload,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import "./profilePage.scss";
const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  // Ensure user and userId have fallback values
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    id: "",
    name: "",
    email: "",
    phonenumber: "",
    dateofbirth: null as Dayjs | null,
    gender: "",
    avatar: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    user?.avatar
  );
  const [fileList, setFileList] = useState<any[]>([]); // Store selected file

  useEffect(() => {
    dispatch(authThunks.fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setInitialValues({
        id: user._id || "",
        name: user.name || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
        dateofbirth: user.dateofbirth ? dayjs(user.dateofbirth) : null,
        gender: user.gender || "",
        avatar: user.avatar || "",
      });
      setAvatarUrl(user.avatar || "");
      setPreviewUrl(user.avatar || "");
    }
  }, [user]);

  const handleEditClick = () => {
    setEditMode(true);
    form.setFieldsValue(initialValues);
  };
  const getCookieValue = (name: string): string | null => {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1] || null
    );
  };

  // Get and decode the user data from cookies
  const encodedUserData = getCookieValue("user");
  let decodedUserData: any = null;

  if (encodedUserData) {
    try {
      decodedUserData = JSON.parse(decodeURIComponent(encodedUserData));
      console.log(decodedUserData);
    } catch (error) {
      console.error("Error parsing user cookie data:", error);
    }
  }
  const userId = decodedUserData._id;
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const { dateofbirth, ...restValues } = values;
      const updatedValues = {
        ...restValues,
        dateofbirth: dateofbirth
          ? dayjs(dateofbirth).format("YYYY-MM-DD")
          : null,
        avatar: avatarUrl, // Ensure avatar URL is saved with the updated profile
      };

      // Only handle avatar update if there's a file selected
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("avatar", fileList[0].originFileObj); // New FormData instance
        formData.append("id", userId); // Add user ID if available

        // Dispatch the updateAvatar thunk
        const result = await dispatch(authThunks.updateAvatar(formData));

        // Update avatarUrl if avatar upload is successful
        setAvatarUrl(result.payload); // Update to the new avatar URL if needed
        setFileList([]); // Clear the file list after upload
      }

      // Dispatch the updateProfile thunk
      await dispatch(authThunks.updateProfile(updatedValues));

      setEditMode(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    form.setFieldsValue(initialValues);
    setPreviewUrl(avatarUrl);
  };

  const handleAvatarChange = (info: any) => {
    const file = info.file.originFileObj || info.file;

    // Only update the preview URL if the file is available
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }

    // Update file list to allow saving avatar
    setFileList(info.fileList);
  };

  return (
    <div className="profile-container">
      <Card title="User Profile" bordered={false} className="card">
        <Form
          requiredMark={false}
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          {/* Avatar field */}
          <Form.Item label="Avatar" name="avatar" className="form-item">
            {editMode && (
              <>
                <Upload
                  name="avatar"
                  listType="picture"
                  fileList={fileList}
                  onChange={handleAvatarChange}
                  beforeUpload={() => false} // Disable auto-upload
                  accept="image/*"
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                </Upload>
              </>
            )}
            <Image
              src={previewUrl || avatarUrl}
              alt="Avatar"
              width={150}
              height={150}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </Form.Item>

          {/* Name field */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input disabled={!editMode} />
          </Form.Item>

          {/* Email field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input disabled={!editMode} />
          </Form.Item>

          {/* Phone number field */}
          <Form.Item
            label="Phone Number"
            name="phonenumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input disabled={!editMode} />
          </Form.Item>

          {/* Date of birth field */}
          <Form.Item
            label="Date of Birth"
            name="dateofbirth"
            rules={[
              { required: true, message: "Please input your date of birth!" },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              disabled={!editMode}
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Gender field */}
          <Form.Item label="Gender" name="gender">
            <Select disabled={!editMode}>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          {/* Action buttons */}
          <div className="form-actions">
            {editMode ? (
              <>
                <Button type="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEditClick}>
                Edit
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
