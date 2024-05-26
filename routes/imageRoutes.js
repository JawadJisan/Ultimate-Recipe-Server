import express from "express";
import { uploadImage } from "../controllers/imageController.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/upload", protect, upload.single("image"), uploadImage);

export default router;
