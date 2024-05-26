import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      //   "mongodb+srv://MUserName:nzCU9CkeMAu27THN@cluster0.npoz0l6.mongodb.net/recipeDB",
      // `mongodb+srv://recipe_admin:ughoybV3qor0nuiG@cluster0.gd9jpsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      // `mongodb+srv://recipe_admin:ughoybV3qor0nuiG@cluster0.gd9jpsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      `mongodb+srv://recipe_admin:ughoybV3qor0nuiG@cluster0.gd9jpsg.mongodb.net/`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
