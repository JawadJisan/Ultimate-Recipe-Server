import User from "../models/User.js";
import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(
  "sk_test_51L0l3aDIahaKXnTe0u0ZQPqD2DoWj712k0z4mFTJED9ymPTPnJVstJxcSkeB6LqTsMs2qfhrfCAYzU7wztrdvpY200muWiDZT3"
);

export const buyCoins = async (req, res) => {
  const { userId, amount } = req.body;
  console.log(amount, "amont");
  console.log(userId, "userId");
  const user = await User.findById(userId);
  // if (!user) {
  //   return res.status(404).json({ message: "User not found" });
  // }
  let coins;
  if (amount === 1) {
    coins = 100;
  } else if (amount === 5) {
    coins = 500;
  } else if (amount === 10) {
    coins = 1000;
  } else {
    return res.status(400).json({ message: "Invalid amount" });
  }

  user.coin += coins;
  await user.save();
  res.status(200).json({ message: "Coins purchased successfully" });
};

export const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    // console.log(paymentIntent, "from paymentIntent");
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
};
