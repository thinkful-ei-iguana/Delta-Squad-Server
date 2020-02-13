const PantryService = {
  getIngredients(db, user_id) {
    console.log("getting ingredients");
    return db("ingredients")
      .select("*")
      .where("ingredient_owner", user_id);
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
  updateIngredient(db, updatedIngredient, ingredientId) { // not finished
    return db("ingredients")
      .where({ id: ingredientId })
      .update(updatedIngredient)
      .returning("*");
  }
};

module.exports = PantryService;
