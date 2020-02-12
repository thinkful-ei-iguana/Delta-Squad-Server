const planningService = {
  getAllRecipes(knex, user_id) {
    return knex("recipes")
      .where("recipe_owner", user_id)
      .select("*");
  },
  getAllByUser(knex, accounts) {
    return knex("recipes")
      .select("*")
      .where("owner", accounts);
  },
  getRecipeById(knex, id) {
    return knex("recipes")
      .select("*")
      .where("recipes.id", id)
      .first();
  },
  getRecipeOwnerData(knex, owner) {
    return knex("users")
      .where("owner", owner)
      .first();
  },
  insertRecipe(knex, newRecipe) {
    return knex("recipes")
      .insert(newRecipe)
      .returning("*")
      .then(rows => rows[0]);
  },
  deleteRecipe(knex, id) {
    return knex("recipes")
      .where({ id })
      .delete();
  },
  updateRecipe(knex, id, updatedData) {
    return knex("recipes")
      .where({ id })
      .update(updatedData);
  }
};

module.exports = const recipesService = {
  getAllRecipes(knex, user_id) {
    return knex("recipes")
      .where("recipe_owner", user_id)
      .select("*");
  },
  getAllByUser(knex, accounts) {
    return knex("recipes")
      .select("*")
      .where("owner", accounts);
  },
  getRecipeById(knex, id) {
    return knex("recipes")
      .select("*")
      .where("recipes.id", id)
      .first();
  },
  getRecipeOwnerData(knex, owner) {
    return knex("users")
      .where("owner", owner)
      .first();
  },
  insertRecipe(knex, newRecipe) {
    return knex("recipes")
      .insert(newRecipe)
      .returning("*")
      .then(rows => rows[0]);
  },
  deleteRecipe(knex, id) {
    return knex("recipes")
      .where({ id })
      .delete();
  },
  updateRecipe(knex, id, updatedData) {
    return knex("recipes")
      .where({ id })
      .update(updatedData);
  }
};

module.exports = planningService;
