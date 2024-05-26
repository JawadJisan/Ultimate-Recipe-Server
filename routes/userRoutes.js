// import express from "express";
// import { loginUser } from "../controllers/userController.js";
// const router = express.Router();
// router.post("/login", loginUser);
// export default router;
import express from "express";
import { authenticate, protect } from "../middlewares/auth.js";
import {
  getUserProfile,
  purchaseCoins,
  countUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", authenticate);
router.get("/countUsers", countUsers);
router.route("/me").get(protect, getUserProfile);
router.route("/purchase-coins").post(protect, purchaseCoins);

export default router;
