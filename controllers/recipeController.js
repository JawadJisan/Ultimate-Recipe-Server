import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

export const addReaction = async (req, res) => {
  const { recipeId, userId } = req.body;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe.reactions.includes(userId)) {
      recipe.reactions.push(userId);
      await recipe.save();
    }
    res
      .status(200)
      .json({ message: "Reaction added", reactions: recipe.reactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeReaction = async (req, res) => {
  const { recipeId, userId } = req.body;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (recipe.reactions.includes(userId)) {
      console.log("block find");
      recipe.reactions = recipe.reactions.filter(
        (id) => id.toString() !== userId
      );
      await recipe.save();
    }
    res
      .status(200)
      .json({ message: "Reaction removed", reactions: recipe.reactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addRecipe = async (req, res) => {
  const { name, image, details, videoCode, country, category, creatorEmail } =
    req.body;
  const newRecipe = new Recipe({
    name,
    image,
    details,
    videoCode,
    country,
    category,
    creatorEmail,
  });
  await newRecipe.save();
  res.status(201).json(newRecipe);
};

// export const getAllRecipes = async (req, res) => {
//   const recipes = await Recipe.find(
//     {},
//     "name image purchased_by creatorEmail country"
//   );
//   res.status(200).json(recipes);
// };

export const getAllRecipes = async (req, res) => {
  const { limit = 10, page = 1, category, country, search } = req.query;
  const query = {};
  if (category) {
    query.category = category;
  }
  if (country) {
    query.country = country;
  }
  if (search) {
    query.name = { $regex: search, $options: "i" }; // Case-insensitive search
  }
  const skip = (page - 1) * limit;

  try {
    // const recipes = await Recipe.find(query)
    //   .select("name image purchased_by creatorEmail country")
    //   .limit(parseInt(limit))
    //   .skip((parseInt(page) - 1) * parseInt(limit));
    const recipes = await Recipe.find(query)
      .select("name image purchased_by creatorEmail country category")
      // .project({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments(query);
    res
      .status(200)
      .json({ total, page: parseInt(page), limit: parseInt(limit), recipes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching recipes", error: error.message });
  }
};

export const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  res.status(200).json({ recipe });
};
export const countRecipe = async (req, res) => {
  const total = await Recipe.countDocuments();
  res.status(200).json({ total });
};

export const recipeSuggestions = async (req, res) => {
  const { category, country } = req.query;
  // console.log(category, country, "suggestionssuggestions");
  const suggestions = await Recipe.find({
    $or: [{ category }, { country }],
  })
    .select("name image  creatorEmail country category")
    .limit(5);
  res.status(200).json({ suggestions });

  /* 
  try {
    const { category, country } = req.query;
    console.log(category, country, "suggestionssuggestions");
    const suggestions = await Recipe.find({
      $or: [{ category }, { country }],
    }).limit(5);
    res.status(200).json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  */
};

export const purchaseRecipe = async (req, res) => {
  const { buyerUser, creatorEmail, recipeId } = req.body;

  const user = await User.findById(buyerUser);
  // console.log(user, "buyer user");
  const recipe = await Recipe.findById(recipeId);
  // console.log(recipe, "recipe");
  const creator = await User.findOne({ email: creatorEmail });
  // console.log(creator, "creator user");

  if (user.coin < 10)
    return res.status(400).json({ message: "Not enough coins" });

  user.coin -= 10;
  recipe.watchCount += 1;
  recipe.purchased_by.push(user.email);
  creator.coin += 1;
  await user.save();
  await recipe.save();
  await creator.save();

  res.status(200).json({ message: "Recipe purchased successfully" });
};
