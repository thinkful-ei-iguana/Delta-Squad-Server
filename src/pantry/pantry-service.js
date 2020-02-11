const PantryService = {
  getIngredients(db, user_id) {
    return db("ingredients")
      .where("user_id", user_id)
      .select("*");
  },
  addIngredient(db, ingredient) {
    return db
      .insert(ingredient)
      .into("ingredients")
      .returning("*")
      .then((rows) => {
        return rows[0];
      })
      .catch((err) => {
        throw err;
      });
  },
  updateIngredientInStock(db, ingredient_id, in_stock) { // not finished
    return db("ingredients")
      .where({ id: ingredient_id })
      .where("in_stock", in_stock)
      .returning("in_stock");
  },
  updateIngredientNotes(db, ingredient_id, notes) { // not finished
    return db("ingredients")
      .where({ id: ingredient_id })
      .where("notes", notes)
      .returning("notes");
  }
};

module.exports = PantryService;