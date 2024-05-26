// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config.js";

// export const loginUser = async (req, res) => {
//   const { displayName, photoURL, email } = req.body;
//   let user = await User.findOne({ email });

//   if (!user) {
//     user = new User({ displayName, photoURL, email });
//     await user.save();
//   }

//   const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//   res.status(200).json({ user, token });
// };
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

export const countUsers = async (req, res) => {
  const total = await User.countDocuments();
  res.status(200).json({ total });
};

export const purchaseCoins = async (req, res) => {
  const { coins } = req.body;
  req.user.coin += coins;
  await req.user.save();
  res.json({ coin: req.user.coin });
};
