const recipesService = {
  getAllRecipes(db, user_id) {
    return db("recipes")
      .select("*")
      .where("recipe_owner", user_id);
  },
  getAllByUser(db, accounts) {
    return db("recipes")
      .select("*")
      .where("owner", accounts);
  },
  getRecipeById(db, id) {
    return db("recipes")
      .select("*")
      .where("id", id)
      .first();
  },
  getRecipeOwnerData(db, owner) {
    return db("users")
      .where("owner", owner)
      .first();
  },
  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into("recipes")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  addRecipeIngredient(db, ingredient) {
    return db
      .insert(ingredient)
      .into("recipe_ingredients")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteRecipeIngredient(db, recipe_id) {
    return db("recipe_ingredients")
      .where({ recipe_id })
      .delete();
  },

  getRecipeIngredientsId(db, recipe_id) {
    return db("recipe_ingredients")
      .select("ingredient_id")
      .where({ recipe_id });
  },

  deleteRecipe(db, id) {
    return db("recipes")
      .where({ id })
      .delete();
  },
  updateRecipe(db, updatedRecipeId, recipeId) {
    return db("recipes")
      .where({ id: recipeId })
      .update(updatedRecipeId)
      .returning("*");
  }
};

module.exports = recipesService;
