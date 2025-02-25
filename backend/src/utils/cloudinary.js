import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { ApiError } from "./ApiError.js";
import { config } from "../config/config.js";
import { write } from "fs";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const uploadOnCloudinary = async (localFilePath, folder) => {
  try {
    if (!localFilePath) return null;

    console.log("Uploading file:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder, // Specify the folder here
    });

    console.log("File uploaded to Cloudinary successfully:", response);

    // Optionally delete the local file after upload
    await fs.unlink(localFilePath);

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new ApiError(500, "Failed to upload file to Cloudinary", error);
  }
};
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    console.log("Deleting file with public ID:", publicId);

    const response = await cloudinary.uploader.destroy(publicId);

    console.log("File deleted from Cloudinary successfully:", response);

    return response;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new ApiError(500, "Failed to delete file from Cloudinary", error);
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
