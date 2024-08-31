import mongoose from "mongoose";
export const connectDB = async () => {
  const uri =
    "mongodb+srv://zakikhn8:ghoury.pk@ghoury.83ebk.mongodb.net/?retryWrites=true&w=majority&appName=Ghoury";

  if (!uri) {
    throw new Error("Please define the MONGO_URI environment variable");
  }

  try {
    await mongoose.connect(uri);

    const db = mongoose.connection;
    db.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    db.on("error", (error) => {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1); // Exit process with a failure code
    });
  } catch (error) {
    console.error("An error occurred during the DB connection process:", error);
    process.exit(1); // Exit process with a failure code
  }
};
