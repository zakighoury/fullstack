import { Readable } from "stream";
import cloudinary from "./cloudinary";

export const uploadImage = async (file: File, folder: string) => {
  const buffer = await file.arrayBuffer(); // Fixed the typo 'bufffer'
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // Auto-detect file type
        folder: folder,        // Specify the folder
      },
      (err, result) => {
        if (err) {
          return reject(err.message); // Return the error message if an error occurs
        }
        console.log("Cloudinary upload result:", result); // Log the upload result
        return resolve(result); // Resolve the promise with the result
      }
    );

    // Pass the buffer to the upload stream
     Readable.from(bytes).pipe(uploadStream);
  });
};
