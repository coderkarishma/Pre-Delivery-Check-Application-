import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ inspections: user.inspections });
  } catch (error) {
    console.error("Get inspections error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const inspection = user.inspections.id(req.params.id);

    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    res.json({ inspection });
  } catch (error) {
    console.error("Get inspection error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const newInspection = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    user.inspections.push(newInspection);
    await user.save();

    const createdInspection = user.inspections[user.inspections.length - 1];
    res.status(201).json({ inspection: createdInspection });
  } catch (error) {
    console.error("Create inspection error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const inspection = user.inspections.id(req.params.id);

    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    Object.assign(inspection, req.body, { updatedAt: new Date() });
    await user.save();

    res.json({ inspection });
  } catch (error) {
    console.error("Update inspection error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/temp/upload",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "pdi-pro-inspections",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto:good" },
          ],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Image upload failed" });
          }
          res.json({ imageUrl: result.secure_url });
        }
      );

      result.end(req.file.buffer);
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.inspections.id(req.params.id).deleteOne();
    await user.save();

    res.json({ message: "Inspection deleted successfully" });
  } catch (error) {
    console.error("Delete inspection error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
