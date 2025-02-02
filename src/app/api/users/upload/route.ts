import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/upload-image";
import User from "@/models/UserModel";
// export const config = {
//   api: {
//     bodyParser: false, // Important: disable default Next.js body parsing for file uploads
//   },
// };
interface UploadResponse {
  secure_url: any;
  // Add other properties if necessary
}
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const avatar = formData.get("avatar") as unknown as File;
  const id = formData.get("id") as string;

  try {
    const data = (await uploadImage(avatar, "Ghoury")) as UploadResponse;
    console.log("Uploaded file:", data);
    console.log("userid:", id);
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        {
          status: 404,
        }
      );
    }

    user.avatar = data.secure_url; // Save the Cloudinary URL
    const savedUser = await user.save();
    console.log("🚀 ~ POST ~ savedUser:", savedUser)
    return NextResponse.json(
      { message: "File uploaded successfully", avatar: savedUser.avatar },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "File upload failed", details: error.message },
      {
        status: 500,
      }
    );
  }
}
