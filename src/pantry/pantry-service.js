const PantryService = {
  getIngredients(db, user_id) {
    console.log("getting ingredients");
    return db("ingredients")
      .select("*")
      .where("ingredient_owner", user_id)
      .whereNot("in_stock", null);
  },
  getIngredientsByIds(db, idArr) {
    return db("ingredients")
      .select("ingredient_name")
      .whereIn("id", idArr);
  },
  addIngredient(db, ingredient) {
    return db
      .insert(ingredient)
      .into("ingredients")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  addNewIngredientsFromRecipe(db, ingredient) {
    return db
      .insert(ingredient)
      .into("ingredients") 
      .whereNotExists(
        db("ingredients").select("*").where("ingredient_name", ingredient)
      )
      .returning("*")
      .then(rows => {
        return rows[0];
      })
    ;
  },

  getIngredientsIds(db, ingredientArr, ingredient_owner) {
    return db("ingredients")
      .select("id")
      .whereIn("ingredient_name", ingredientArr)
      .where({ ingredient_owner });
  },

  updateIngredient(db, updatedIngredient, ingredientId) {
    // not finished
    return db("ingredients")
      .where({ id: ingredientId })
      .update(updatedIngredient)
      .returning("*");
  },
  deleteIngredient(knex, id) {
    return knex("ingredients")
      .where({ id })
      .delete();
  },
};

module.exports = PantryService;
