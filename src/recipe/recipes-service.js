const recipesService = {
  getAllRecipes(db, user_id) {
    return db ("recipes")
      .select("*")  
      .where("recipe_owner", user_id);
  },
  getAllByUser(db, accounts) {
    return db ("recipes")
      .select("*")
      .where("owner", accounts);
  },
  getRecipeById(db, id) {
    return db ("recipes")
      .select("*")
      .where("recipes.id", id)
      .first();
  },
  getRecipeOwnerData(db, owner) {
    return db ("users")
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
  deleteRecipe(db, id) {
    return db ("recipes")
      .where({ id })
      .delete();
  },
  updateRecipe(db, id, updatedData) {
    return db ("recipes")
      .where({ id })
      .update(updatedData);
  }
};

module.exports = recipesService;
