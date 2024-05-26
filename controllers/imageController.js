import axios from "axios";
import FormData from "form-data";
import { IMGBB_API_KEY } from "../config.js";

export const uploadImage = async (req, res) => {
  try {
    const image = req.file; // `multer` stores the file in `req.file`
    console.log(image, "image");

    const form = new FormData();
    form.append("image", image.buffer.toString("base64")); // Convert buffer to base64 string

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      form,
      {
        headers: { ...form.getHeaders() },
      }
    );
    const imageUrl = response.data.data.url;
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Image upload failed", error: error.message });
  }
};
