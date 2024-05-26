import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: String,
  image: String,
  details: String,
  videoCode: String,
  country: String,
  category: String,
  creatorEmail: String,
  watchCount: { type: Number, default: 0 },
  purchased_by: { type: [String], default: [] },
  reactions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
