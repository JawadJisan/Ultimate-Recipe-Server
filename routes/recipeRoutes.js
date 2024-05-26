import express from "express";
import {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  purchaseRecipe,
  recipeSuggestions,
  countRecipe,
  addReaction,
  removeReaction,
} from "../controllers/recipeController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/suggestions", recipeSuggestions);
router.post("/add", protect, addRecipe);
router.post("/addReaction", addReaction);
router.post("/removeReaction", removeReaction);

router.get("/all", getAllRecipes);
router.get("/countRecipe", countRecipe);
router.get("/:id", protect, getRecipeById);
router.post("/purchase", protect, purchaseRecipe);

export default router;
